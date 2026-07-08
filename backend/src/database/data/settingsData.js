export const defaultSettings = [
  {
    key: "MAX_FREE_CATEGORIES",
    value: 5,
    description: "Maximum number of categories a free user can select",
    isPublic: true,
  },
  {
    key: "DEFAULT_REFRESH_INTERVAL",
    value: "1hour",
    description: "Default quote refresh interval assigned to new users",
    isPublic: true,
  },
  {
    key: "AVAILABLE_REFRESH_INTERVALS",
    value: ["1min", "1hour", "1day"],
    description: "All available options for quote refresh interval",
    isPublic: true,
  },
  {
    key: "AUTO_ASSIGN_CATEGORIES_COUNT",
    value: 2,
    description: "Number of random categories auto-assigned on registration",
    isPublic: false,
  },
  {
    key: "APP_NAME",
    value: "Quote Generator",
    description: "Application display name",
    isPublic: true,
  },
  {
    key: "APP_VERSION",
    value: "1.0.0",
    description: "Current application version",
    isPublic: true,
  },
];
