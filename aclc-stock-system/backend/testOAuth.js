require("dotenv").config();

async function testOAuth() {
  const body = new URLSearchParams({
    client_id: process.env.GMAIL_CLIENT_ID,
    client_secret: process.env.GMAIL_CLIENT_SECRET,
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    grant_type: "refresh_token",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const result = await response.json();

  console.log("HTTP status:", response.status);
  console.log("OAuth error:", result.error || "none");
  console.log("Description:", result.error_description || "none");

  if (response.ok) {
    console.log("Access token refresh succeeded.");
    // Never print the access token.
  }
}

testOAuth().catch((error) => {
  console.error("Request failed:", error.message);
});
