export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  hasAppUrlEnv: Boolean(process.env.NEXT_PUBLIC_APP_URL),
  nodeEnv: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV !== "production",
} as const;
