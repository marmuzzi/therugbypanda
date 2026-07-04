export const searchPacks = {
  evergreen: [
    "rugby ball grass",
    "rugby goal posts",
    "empty rugby stadium",
    "rugby pitch",
    "rugby training equipment",
    "rugby supporters",
    "rugby referee",
    "rugby boots",
  ],
  ireland: [
    "Ireland rugby stadium",
    "Aviva Stadium rugby",
    "Ireland rugby supporters",
    "Irish rugby pitch",
  ],
  "six-nations": [
    "Six Nations rugby stadium",
    "international rugby supporters",
    "rugby national anthem",
    "international rugby referee",
  ],
  urc: [
    "United Rugby Championship rugby",
    "club rugby stadium",
    "rugby club supporters",
    "rugby match action",
  ],
};

export function resolveQueries(input) {
  if (input.searchPack === "custom") {
    return Array.isArray(input.queries) ? input.queries.filter(Boolean) : [];
  }

  return searchPacks[input.searchPack] ?? searchPacks.evergreen;
}
