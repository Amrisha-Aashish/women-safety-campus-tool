function analyticsUrl(path) {
  const baseUrl = process.env.ANALYTICS_SERVICE_URL;

  if (!baseUrl) {
    throw new Error('ANALYTICS_SERVICE_URL is not configured.');
  }

  return `${baseUrl.replace(/\/$/, '')}${path}`;
}

async function fetchAnalytics(path) {
  const response = await fetch(analyticsUrl(path), {
    signal: AbortSignal.timeout(5000)
  });

  if (!response.ok) {
    throw new Error(`Analytics service returned ${response.status}.`);
  }

  return response.json();
}

export async function getRiskZones(_request, response, next) {
  try {
    const data = await fetchAnalytics('/risk-zones');
    response.status(200).json(data);
  } catch (error) {
    error.statusCode = 502;
    next(error);
  }
}

export async function getRedTimeZones(_request, response, next) {
  try {
    const data = await fetchAnalytics('/red-time-zones');
    response.status(200).json(data);
  } catch (error) {
    error.statusCode = 502;
    next(error);
  }
}