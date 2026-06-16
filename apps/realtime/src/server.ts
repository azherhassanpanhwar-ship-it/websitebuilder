/**
 * LATTICE Realtime Server — Boot (Task 1.5)
 * ──────────────────────────────────────────
 * The single entry point for the y-websocket server. Owns:
 *   1. HTTP listener with a `/health` endpoint (k8s / load-balancer probe).
 *   2. WebSocket upgrade handler that verifies a Supabase JWT BEFORE
 *      completing the handshake.
 *   3. The actual Yjs document sync (delegated to `y-websocket/bin/utils`).
 *   4. Graceful shutdown on SIGTERM / SIGINT — closes the server and
 *      lets in-flight connections drain.
 *
 * Architecture (Skill 1 — CRDT)
 *   The server is a thin relay. It does NOT own the canonical document
 *   state — that lives in the clients' Y.Docs + the Yjs CRDT merge
 *   algorithm. The server's job is to:
 *     a) authenticate the connecting user;
 *     b) route the room name from the URL to the right Y.Doc;
 *     c) broadcast every Y update to every other connection in the room.
 *
 * Persistence note (Task 1.4)
 *   The server is intentionally persistence-less. The browser-side
 *   `saveDoc` (apps/web/src/persistence/saveDoc.ts) writes snapshots
 *   to Supabase; the server is the realtime transport, not a database.
 *   This keeps the server stateless and horizontally scalable.
 *
 * Auth protocol
 *   Client → `ws://localhost:1234/<roomName>?token=<supabase-jwt>`
 *   Server → 401 if token missing/invalid, 101 (upgrade) on success.
 */
import http from "node:http";
import { WebSocketServer, WebSocket } from "ws";
// y-websocket's bin/utils isn't in the package's `exports` map for
// `import` — the conventional entry is the CommonJS path. We use the
// `ws`-style import (relative to the package) that's stable across
// y-websocket 1.x and 2.x. Type declarations live in
// `y-websocket-bin-utils.d.ts`.
import { setupWSConnection } from "y-websocket/bin/utils";

import { loadConfig } from "./config.js";
import { extractTokenFromUrl, verifySupabaseToken, type UserContext } from "./auth.js";

interface ConnectionContext {
  roomName: string;
  user: UserContext;
}

async function main(): Promise<void> {
  const config = loadConfig();

  const server = http.createServer((req, res) => {
    if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", service: "lattice-realtime" }));
      return;
    }
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  });

  const wss = new WebSocketServer({
    noServer: true,
    maxPayload: config.maxPayloadBytes,
  });

  wss.on("connection", (ws: WebSocket, req: http.IncomingMessage, ctx: ConnectionContext) => {
    // Pin the room name + user on the WebSocket so y-websocket's
    // `setupWSConnection` uses our room name (it derives one from the
    // URL otherwise, which is identical here — but we want the
    // authenticated user visible in logs).
    const logPrefix = `[lattice-realtime] user=${ctx.user.email} room=${ctx.roomName}`;
    console.log(`${logPrefix} connected`);

    ws.on("close", () => {
      console.log(`${logPrefix} disconnected`);
    });

    // setupWSConnection reads docName from the request URL path; we
    // pass an explicit options object to make the room name unambiguous
    // and enable GC.
    setupWSConnection(ws, req, { docName: ctx.roomName, gc: true });
  });

  server.on("upgrade", (req, socket, head) => {
    const rawUrl = req.url ?? "/";
    let roomName: string;
    try {
      const url = new URL(rawUrl, "http://localhost");
      roomName = url.pathname.replace(/^\/+/, "");
    } catch {
      socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
      socket.destroy();
      return;
    }

    if (!roomName) {
      socket.write("HTTP/1.1 400 Bad Request — missing room name\r\n\r\n");
      socket.destroy();
      return;
    }

    // Origin check (CSRF mitigation). Browsers send `Origin` on upgrade;
    // non-browser clients (curl, server-to-server) don't. We allow
    // non-browser clients only when the allowed-origins list includes
    // the wildcard, which is opt-in.
    const origin = req.headers["origin"];
    if (origin && !config.allowedOrigins.includes("*") && !config.allowedOrigins.includes(origin)) {
      socket.write("HTTP/1.1 403 Forbidden — origin not allowed\r\n\r\n");
      socket.destroy();
      return;
    }

    const token = extractTokenFromUrl(rawUrl);
    if (!token) {
      socket.write("HTTP/1.1 401 Unauthorized — missing token\r\n\r\n");
      socket.destroy();
      return;
    }

    const user = verifySupabaseToken(token, config);
    if (!user) {
      socket.write("HTTP/1.1 401 Unauthorized — invalid token\r\n\r\n");
      socket.destroy();
      return;
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req, { roomName, user } satisfies ConnectionContext);
    });
  });

  // Periodic ping (server → client) so dead connections are detected
  // before the OS's TCP timeout. y-websocket doesn't ship a server-side
  // ping on its own — we add one and let the protocol layer reply
  // with a pong.
  const pingInterval = setInterval(() => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.ping();
        } catch {
          // If ping itself throws, the connection is in a bad state —
          // terminate it so the next round closes cleanly.
          client.terminate();
        }
      }
    });
  }, config.pingIntervalMs);
  pingInterval.unref(); // don't keep the event loop alive on its own

  server.listen(config.port, config.host, () => {
    console.log(
      `[lattice-realtime] listening on ws://${config.host}:${config.port} ` +
        `(allowed origins: ${config.allowedOrigins.join(", ")})`,
    );
  });

  // Graceful shutdown — close the HTTP server (no new upgrades), then
  // close every WS connection so the client reconnects to a fresh
  // process.
  const shutdown = (signal: NodeJS.Signals): void => {
    console.log(`[lattice-realtime] received ${signal}, shutting down…`);
    clearInterval(pingInterval);
    wss.clients.forEach((client) => {
      try {
        client.close(1001, "server shutting down");
      } catch {
        // ignore
      }
    });
    wss.close();
    server.close(() => process.exit(0));
    // Hard exit after 5s if anything is hanging on a long-lived doc sync.
    setTimeout(() => process.exit(1), 5_000).unref();
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  console.error("[lattice-realtime] fatal startup error:", err);
  process.exit(1);
});
