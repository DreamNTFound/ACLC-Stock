const cron = require("node-cron");
const Reservation = require("../models/reservation");

const ARCHIVE_AFTER_DAYS = 14;

const archiveOldReservations = async () => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - ARCHIVE_AFTER_DAYS);

    const now = new Date();

    const result = await Reservation.updateMany(
      {
        status: { $in: ["Claimed", "Cancelled"] },
        statusChangedAt: { $lte: cutoffDate },
        isArchived: { $ne: true },
      },
      {
        $set: {
          isArchived: true,
          archivedAt: now,
        },
      },
    );

    if (result.modifiedCount > 0) {
      console.log(`Archived ${result.modifiedCount} reservation(s).`);
    }
  } catch (error) {
    console.error("Automatic reservation archiving failed:", error);
  }
};

// Run once every hour.
const startReservationArchiving = () => {
  cron.schedule("0 * * * *", archiveOldReservations);

  // Also check when the backend starts.
  archiveOldReservations();

  console.log("Reservation archiving job scheduled.");
};

module.exports = { startReservationArchiving };
