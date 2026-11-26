const RestockSchedule = require("../models/restockSchedule");

exports.createRestockSchedule = async (req, res) => {
  try {
    const restockSchedule = await RestockSchedule.create({
      productId: req.body.productId,
      restockDate: req.body.restockDate,
      quantity: req.body.quantity,
      status: req.body.status,
      note: req.body.note,
    });
    const populated = await restockSchedule.populate("productId", "item_name");
    res.status(201).json(populated);
  } catch (error) {
    console.error("Error creating restock schedule:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllRestockSchedules = async (req, res) => {
  try {
    const restockSchedule = await RestockSchedule.find().populate(
      "productId",
      "item_name",
    );
    if (!restockSchedule)
      return res.status(404).json({ error: "Restock schedule not found" });
    res.json(restockSchedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRestockSchedule = async (req, res) => {
  try {
    const restockSchedule = await RestockSchedule.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { returnDocument: "after" },
    ).populate("productId", "item_name");
    console.log("Restock schedule updated:", restockSchedule);
    res.json(restockSchedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRestockSchedule = async (req, res) => {
  try {
    const restockSchedule = await RestockSchedule.findOneAndDelete({
      _id: req.params.id,
    }).populate("productId", "item_name");
    res.json(restockSchedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
