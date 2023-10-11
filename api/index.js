const {BetaAnalyticsDataClient} = require('@google-analytics/data');

// https://vercel.com/docs/functions/serverless-functions/runtimes
// https://vercel.com/docs/functions/serverless-functions/runtimes/node-js
// https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries
// https://googleapis.dev/nodejs/analytics-data/latest/

// https://googleapis.dev/nodejs/analytics-data/latest/v1beta.BetaAnalyticsDataClient.html
const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY
  },
  projectId: process.env.GOOGLE_PROJECT_ID
});

const propertyId = 'UA-24981697-3';

export default async function handler(req, res) {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '2018-06-21',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'city',
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
    });
    res.status(200).send(response);
  } catch(error) {
    res.status(500).json({ error: 'An error occurred' });
  }
}
