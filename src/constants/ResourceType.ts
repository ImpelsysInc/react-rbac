export const ResourceType = {
  MENU: "menu",
  PAGE: "page",
  COMPONENT: "component",
  API: "api",
  ANY: "*",
} as const;

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type ResourceType = typeof ResourceType[keyof typeof ResourceType];
