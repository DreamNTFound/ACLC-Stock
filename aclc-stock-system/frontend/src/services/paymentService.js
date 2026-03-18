export const payWithGCash = async ({ userId, amount, gcashNumber }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const success = Math.random() > 0.1;
      if (success) {
        resolve({
          success: true,
          transactionId: `GC${Date.now()}`,
          message: "Payment successful via GCash!",
        });
      } else {
        resolve({
          success: false,
          error: "GCash payment failed. Please try again.",
        });
      }
    }, 3000);
  });
};
