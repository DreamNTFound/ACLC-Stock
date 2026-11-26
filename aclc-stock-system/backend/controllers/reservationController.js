const Reservation = require("../models/reservation");
const Notification = require("../models/notification");
const { sendPickupEmail } = require("../utils/email");

exports.createReservation = async (req, res) => {
  try {
    const reservation = await Reservation.create({
      productId: req.body.productId,
      profileId: req.body.profileId,
      size: req.body.size,
      quantity: req.body.quantity,
      created_at: req.body.created_at,
      status: req.body.status,
      paymentMethod: req.body.paymentMethod,
      paymentStatus: req.body.paymentStatus,
      gcashRef: req.body.gcashRef,
      note: req.body.note,
    });
    res.status(201).json(reservation);
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("productId", "item_name item_sizes")
      .populate("profileId", "name email");
    res.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getMyReservation = async (req, res) => {
  try {
    const reservation = await Reservation.find({
      profileId: req.params.profileId,
    })
      .populate("productId", "item_name item_sizes item_price")
      .populate("profileId", "name email");

    res.json(reservation);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate("profileId", "name email")
      .populate("productId", "item_name");

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    const oldStatus = reservation.status;
    const { status, paymentStatus } = req.body;

    // Update only the fields this endpoint is intended to change.
    if (status !== undefined) {
      reservation.status = status;
    }

    if (paymentStatus !== undefined) {
      reservation.paymentStatus = paymentStatus;
    }

    // Track when the reservation enters a terminal status.
    if (oldStatus !== reservation.status) {
      if (["Claimed", "Cancelled"].includes(reservation.status)) {
        reservation.statusChangedAt = new Date();
      } else {
        reservation.statusChangedAt = null;
      }
    }

    await reservation.save();

    if (
      oldStatus !== "Ready for Pickup" &&
      reservation.status === "Ready for Pickup"
    ) {
      // Populate references can be null if the related record was deleted.
      if (reservation.profileId && reservation.productId) {
        await Notification.create({
          profileId: reservation.profileId._id,
          title: "Reservation Ready",
          message: `Your reservation for ${reservation.productId.item_name} is ready for pickup.`,
          isRead: false,
        });

        if (reservation.profileId.email) {
          await sendPickupEmail(
            reservation.profileId.email,
            reservation.profileId.name,
            reservation.productId.item_name,
          );
        }

        req.io
          .to(reservation.profileId._id.toString())
          .emit("reservation-ready", {
            reservationId: reservation._id,
            message: `Your reservation for ${reservation.productId.item_name} is ready for pickup.`,
          });
      }
    }

    res.json(reservation);
  } catch (error) {
    console.error("Error updating reservation:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    reservation.status = "Cancelled";
    reservation.statusChangedAt = new Date();

    await reservation.save();

    res.json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    res.status(500).json({ error: "Failed to cancel reservation" });
  }
};

// exports.updateReservation = async (req, res) => {
//   try {
//     const reservation = await Reservation.findById(req.params.id)
//       .populate("profileId", "name email")
//       .populate("productId", "item_name");

//     if (!reservation) {
//       return res.status(404).json({ error: "Reservation not found" });
//     }

//     const oldStatus = reservation.status;
//     Object.assign(reservation, req.body);
//     await reservation.save();

//     if (
//       oldStatus !== "Ready for Pickup" &&
//       reservation.status === "Ready for Pickup"
//     ) {
//       await Notification.create({
//         profileId: reservation.profileId._id,
//         title: "Reservation Ready",
//         message: `Your reservation for ${reservation.productId.item_name} is ready for pickup.`,
//         isRead: false,
//       });

//       await sendPickupEmail(
//         reservation.profileId.email,
//         reservation.profileId.name,
//         reservation.productId.item_name,
//       );

//       req.io
//         .to(reservation.profileId._id.toString())
//         .emit("reservation-ready", {
//           reservationId: reservation._id,
//           message: `Your reservation for ${reservation.productId.item_name} is ready for pickup.`,
//         });
//     }
//     res.json(reservation);
//   } catch (error) {
//     console.error("Error updating reservation:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.cancelReservation = async (req, res) => {
//   try {
//     const reservation = await Reservation.findById(req.params.id);

//     // Check if the reservation exists
//     if (!reservation) {
//       return res.status(404).json({ error: "Reservation not found" });
//     }
//     reservation.status = "Cancelled";

//     await reservation.save();
//     res.json({ message: "Reservation cancelled successfully" });
//   } catch (error) {
//     console.error("Error cancelling reservation:", error);
//     res.status(500).json({ error: "Failed to cancel reservation" });
//   }
// };
