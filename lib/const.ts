// =========== Constants ===========
export const BOOKING_STEPS = [
  { id: "search", title: "Search Trips" },
  { id: "select", title: "Select Trip" },
  { id: "details", title: "Parcel Details" },
  { id: "review", title: "Review & Pay" },
];

export const POPULAR_LOCATIONS = [
  "rueil-malmaison",
  "al hoceima",
  "Hamburg",
  "Munich",
  "Cologne",
];

export const COUNTRIES = [
  { code: "FR", name: "France", value: "france" },
  { code: "ES", name: "Spain", value: "spain" },
  { code: "IT", name: "Italy", value: "italy" },
  { code: "NL", name: "Netherlands", value: "netherlands" },
  { code: "MA", name: "Morocco", value: "morocco" },
] as const;
