const oldHomeLinks = {
  hokkaido: "hokkaido.html",
  stays: "hokkaido.html#stays",
  itinerary: "hokkaido.html#itinerary",
  transport: "hokkaido.html#transport",
  checklist: "hokkaido.html#checklist",
  tokyo: "archive.html#tokyo",
  "tokyo-trip": "archive.html#tokyo-trip",
  overview: "archive.html#overview",
  plan: "archive.html#plan",
  notes: "archive.html#notes"
};

const oldTrip = oldHomeLinks[location.hash.slice(1)];
if (typeof oldTrip === "string") location.replace(oldTrip);
