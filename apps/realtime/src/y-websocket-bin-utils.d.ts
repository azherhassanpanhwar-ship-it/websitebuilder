/**
 * y-websocket/bin/utils has no type declarations. The export we use
 * is a CommonJS module that exposes `setupWSConnection`. We declare
 * just the shape we touch to keep TS happy without pulling in
 * `@types/y-websocket` (which doesn't exist on npm).
 */
declare module "y-websocket/bin/utils" {
  import type { IncomingMessage } from "node:http";
  import type { WebSocket } from "ws";

  export interface SetupWSConnectionOptions {
    docName: string;
    gc?: boolean;
  }

  export function setupWSConnection(
    ws: WebSocket,
    req: IncomingMessage,
    options?: SetupWSConnectionOptions,
  ): void;
}
