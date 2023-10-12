const { BetaAnalyticsDataClient } = require("@google-analytics/data");

// Vercel Node.js runtime documentation:
// https://vercel.com/docs/functions/serverless-functions/runtimes/node-js

// Because I can't securely deploy a Google service account key (JSON file) and assign its file path
// to the `GOOGLE_APPLICATION_CREDENTIALS` environment variable for the API client to use, I'm
// providing a configuration object instead.
// - Google Analytics Data API overview: https://developers.google.com/analytics/devguides/reporting/data/v1
// - Google Analytics Data API quickstart guide: https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries
// - Google Analytics Data: Node.js Client documentation: https://googleapis.dev/nodejs/analytics-data/latest/

// Previously, I was using the Google Analytics Reporting API, but it's no longer supported by
// Google Analytics 4:
// - Reporting API: https://developers.google.com/analytics/devguides/reporting/core/v4
// - Intro to Google Analytics 4: https://developers.google.com/analytics/devguides/collection/ga4

// See: https://github.com/vercel/vercel/issues/749#issuecomment-715009494
const { privateKey } = JSON.parse(process.env.GOOGLE_PRIVATE_KEY || "{ privateKey: null }");

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: privateKey
  },
  projectId: process.env.GOOGLE_PROJECT_ID
});

const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID;

export default async function handler(req, res) {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{
        startDate: "2018-06-21",
        endDate: "today"
      }],
      // dimensions: [{ name: "city" }],
      metrics: [{ name: "activeUsers" }]
    });
    res.status(200).send(response);
  } catch(error) {
    res.status(500).json({ error: error.message });
  }
}
