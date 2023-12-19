const vitalsUrl = "https://vitals.vercel-analytics.com/v1/vitals";

function getConnectionSpeed() {
  return "connection" in navigator &&
    navigator["connection"] &&
    "effectiveType" in navigator["connection"]
    ? navigator["connection"]["effectiveType"]
    : "";
}

export function sendToVercelAnalytics(metric) {
  const analyticsId = process.env.REACT_APP_VERCEL_ANALYTICS_ID;
  console.log(analyticsId);
  if (!analyticsId) {
    console.log(
      "No analytics ID found. Please set the VERCEL_ANALYTICS_ID environment variable."
    );
    return;
  }

  const body = {
    dsn: analyticsId,
    id: metric.id,
    page: window.location.pathname,
    href: window.location.href,
    event_name: metric.name,
    value: metric.value.toString(),
    speed: getConnectionSpeed(),
  };

  const blob = new Blob([new URLSearchParams(body).toString()], {
    // This content type is necessary for `sendBeacon`
    type: "application/x-www-form-urlencoded",
  });
  if (navigator.sendBeacon) {
    console.log("Sending beacon");
    navigator.sendBeacon(vitalsUrl, blob);
  } else {
    console.log("Sending fetch");
    fetch(vitalsUrl, {
      body: blob,
      method: "POST",
      credentials: "omit",
      keepalive: true,
    });
  }
}
