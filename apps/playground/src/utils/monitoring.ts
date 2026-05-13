// Example: Application Insights setup (Node.js/Browser)
let appInsights: any = null;
if (typeof window === "undefined" && process.env.APPINSIGHTS_CONNECTION_STRING) {
  // Node.js/server-side
  appInsights = require("applicationinsights");
  appInsights.setup(process.env.APPINSIGHTS_CONNECTION_STRING).start();
}

// Example: Sentry setup (universal)
if (process.env.SENTRY_DSN) {
  // Dynamically import Sentry for both client/server
  import("@sentry/nextjs").then(Sentry => {
    Sentry.init({ dsn: process.env.SENTRY_DSN });
  });
}
