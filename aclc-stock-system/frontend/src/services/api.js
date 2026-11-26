const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = async (requestFn) => {
  try {
    await delay();

    // Requests now use HTTP-only cookies.
    const response = await requestFn(null);

    if (!response) return null;

    if (response.status === 401) {
      window.dispatchEvent(new Event("auth:expired"));
      throw new Error("Session expired. Please log in again.");
    }

    let data = null;

    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      data = await response.json().catch(() => null);
    }

    if (!response.ok) {
      throw new Error(data?.message || "Error fetching data.");
    }

    return data;
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};
