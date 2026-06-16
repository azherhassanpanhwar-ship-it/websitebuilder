/**
 * LATTICE Theme #1 — Fine Dining
 * Menu page — three-tab menu (Tasting · À la carte · Wines) using the
 * shared Menu component.
 *
 * No Lorem Ipsum. All dish names and descriptions are real fine-dining
 * style copy.
 */

import * as React from "react";
import { FineDiningMenu, type MenuData } from "../components/Menu";

const MENU_DATA: MenuData = {
  tasting: {
    label: "Tasting",
    preamble:
      "Seven courses. One set menu each evening. Released at 9:00 AM, served from 5:30 PM to 9:30 PM, Tuesday through Saturday.",
    sections: [
      {
        title: "Amuse-bouche",
        subtitle: "From the kitchen",
        courses: [
          {
            id: "t-1",
            name: "Buckwheat cracker, trout roe",
            description:
              "Crisp buckwheat tile, a spoonful of Oscetra caviar, a single chive flower.",
            price: "Included",
            tags: ["gluten-free"],
          },
        ],
      },
      {
        title: "First",
        subtitle: "From the cold kitchen",
        courses: [
          {
            id: "t-2",
            name: "Hamachi, yuzu kosho, pickled rose",
            description:
              "Day-boat yellowtail, brief cure in yuzu kosho, a drop of pickled-rose oil, sea grapes from Brittany.",
            price: "Included",
            tags: ["dairy-free"],
          },
          {
            id: "t-3",
            name: "Heirloom beet, smoked eel, horseradish",
            description:
              "Slow-roasted golden beet, smoked eel from the Cotentin, fresh horseradish, rye crumb.",
            price: "Included",
          },
        ],
      },
      {
        title: "Second",
        subtitle: "From the pasta room",
        courses: [
          {
            id: "t-4",
            name: "Hand-cut tagliolini, white truffle, parmigiano",
            description:
              "House-pulled tagliolini, cultured butter, thirty-six-month parmigiano, freshly shaved white truffle (when available).",
            price: "Included",
            tags: ["vegetarian"],
          },
        ],
      },
      {
        title: "Main",
        subtitle: "From the wood-fired hearth",
        courses: [
          {
            id: "t-5",
            name: "Aged duck, cherry, smoked lardo",
            description:
              "Long-aged duck breast from the Périgord, lacquered in sour cherry, draped with smoked lardo, charred shallot jus.",
            price: "Included",
            tags: ["gluten-free", "dairy-free"],
          },
          {
            id: "t-6",
            name: "Black cod, miso, pickled chanterelle",
            description:
              "Saikyo-yuzu miso–marinated black cod, three days in the cure, finished over binchotan, pickled chanterelle.",
            price: "Included",
            tags: ["dairy-free"],
          },
        ],
      },
      {
        title: "Cheese",
        subtitle: "From affineur Hervé Mons",
        courses: [
          {
            id: "t-7",
            name: "Four affineur-selected cheeses",
            description:
              "A rotating selection of four — currently a raw-milk goat, a 24-month Comté, a washed-rind Burgundy, and a blue from the Auvergne. Served with walnut bread and honeycomb.",
            price: "Included",
            tags: ["vegetarian"],
          },
        ],
      },
      {
        title: "Dessert",
        subtitle: "From the pastry kitchen",
        courses: [
          {
            id: "t-8",
            name: "Mille-feuille, vanilla, brown butter",
            description:
              "Caramelised puff pastry layered with Tahitian vanilla crème, brown-butter ice cream, spun sugar.",
            price: "Included",
            tags: ["vegetarian"],
          },
          {
            id: "t-9",
            name: "Frozen parsley, green apple, olive oil",
            description:
              "A granité of parsley, compressed green apple, an unexpected pour of late-harvest Picual.",
            price: "Included",
            tags: ["vegan", "gluten-free"],
          },
        ],
      },
    ],
    colophon: "Seven courses, $185 per guest. Optional wine pairing, $95. Service begins promptly.",
  },

  alacarte: {
    label: "À la carte",
    preamble:
      "For guests who prefer to choose. The full à la carte is available at the bar and at the chef's counter only — not in the main dining room, where the tasting menu is served.",
    sections: [
      {
        title: "To begin",
        courses: [
          {
            id: "a-1",
            name: "Burrata, peach, basil",
            description:
              "Hand-pulled burrata from Andria, white peach, basil oil, Sicilian sea salt.",
            price: "$28",
            tags: ["vegetarian", "gluten-free"],
          },
          {
            id: "a-2",
            name: "Tuna tartare, avocado, sesame",
            description: "Bluefin tuna from Sicily, Hass avocado, toasted sesame, ponzu.",
            price: "$32",
            tags: ["dairy-free"],
          },
        ],
      },
      {
        title: "Mains",
        courses: [
          {
            id: "a-3",
            name: "Hand-rolled agnolotti, brown butter, sage",
            description:
              "House-rolled agnolotti stuffed with braised veal, brown butter, crispy sage, parmigiano-reggiano.",
            price: "$42",
            tags: [],
          },
          {
            id: "a-4",
            name: "Roast chicken, morels, vin jaune",
            description:
              "A free-range Bresse hen, morels from the Jura, vin jaune cream, wilted greens.",
            price: "$58",
            tags: ["gluten-free"],
          },
          {
            id: "a-5",
            name: "Wagyu strip, marrow, red wine",
            description:
              "Twelve-ounce American Wagyu strip, roasted bone marrow, red wine reduction, pommes purée.",
            price: "$95",
          },
        ],
      },
      {
        title: "Sides",
        courses: [
          {
            id: "a-6",
            name: "Pommes purée",
            description: "Yukon gold potatoes, cultured butter, cream, a whisper of nutmeg.",
            price: "$14",
            tags: ["vegetarian", "gluten-free"],
          },
          {
            id: "a-7",
            name: "Roasted carrots, harissa, yogurt",
            description: "Heirloom carrots, mild harissa, sheep's-milk yogurt, pistachio.",
            price: "$16",
            tags: ["vegetarian"],
          },
        ],
      },
    ],
    colophon: "À la carte is offered only at the chef's counter and at the bar. Surcharge applies.",
  },

  wines: {
    label: "Wines",
    preamble:
      "Our cellar leans toward small growers in Burgundy, the Loire, the Rhône, and Piedmont. Bottles under $200 form the heart of the list. Pairings change with the menu.",
    sections: [
      {
        title: "By the glass",
        subtitle: "A short, confident list",
        courses: [
          {
            id: "w-1",
            name: "Crémant de Loire, Domaine de la Bergerie",
            description:
              "Chenin blanc, méthode traditionnelle, twelve months on the lees. Dry, mineral, gently yeasty.",
            price: "Glass $18",
            pairing: "Pairs with the burrata",
          },
          {
            id: "w-2",
            name: "Riesling, Trimbach, Alsace 2021",
            description: "Bone-dry, tightly wound — lime peel, slate, a long saline finish.",
            price: "Glass $22",
            pairing: "Pairs with the hamachi",
          },
          {
            id: "w-3",
            name: "Chinon, Charles Joguet, Loire 2020",
            description:
              "Cabernet Franc from the best parcels of the Véron. Red fruit, tobacco, supple tannin.",
            price: "Glass $24",
            pairing: "Pairs with the duck",
          },
        ],
      },
      {
        title: "Bottles we love",
        subtitle: "Under $200",
        courses: [
          {
            id: "w-4",
            name: "Sancerre, Vacheron, Loire 2022",
            description: "A benchmark — citrus pith, crushed flint, a long mineral finish.",
            price: "$95",
            tags: ["vegan"],
          },
          {
            id: "w-5",
            name: "Meursault, Domaine Roulot 2019",
            description:
              "One of the Côte de Beaune's most poised producers. Hazelnut, white peach, sea-spray.",
            price: "$185",
          },
          {
            id: "w-6",
            name: "Barolo, Giacomo Conterno, Piedmont 2018",
            description:
              "Serralunga d'Alba at its most classical. Rose, tar, cherry liqueur, a long mineral finish.",
            price: "$195",
          },
        ],
      },
    ],
    colophon: "Full list of 280 bottles available on request. Sommelier: Camille Beaulieu.",
  },
};

export function FineDiningMenuPage() {
  return <FineDiningMenu data={MENU_DATA} initialTab="tasting" />;
}

export default FineDiningMenuPage;
