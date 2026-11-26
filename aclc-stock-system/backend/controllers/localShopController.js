const localShop = require("../models/localShop");

exports.createLocalShop = async (req, res) => {
  try {
    const newLocalShop = await localShop.create({
      shopName: req.body.shopName,
      address: req.body.address,
      contact: req.body.contact,
      avail_items: req.body.avail_items,
      mapLink: req.body.mapLink,
      partner: req.body.partner,
      active: req.body.active,
    });
    res.status(201).json(newLocalShop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllLocalShops = async (req, res) => {
  try {
    const localShops = await localShop.find();
    res.json(localShops);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateLocalShop = async (req, res) => {
  try {
    const updatedLocalShop = await localShop.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { returnDocument: "after" },
    );
    console.log("Local Shop updated:", updatedLocalShop);
    res.json(updatedLocalShop);
  } catch (error) {
    consol.error("Error updating local shop:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteLocalShop = async (req, res) => {
  try {
    const deletedLocalShop = await localShop.findOneAndDelete({
      _id: req.params.id,
    });
    console.log("Local Shop deleted:", deletedLocalShop);
    res.json(deletedLocalShop);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};