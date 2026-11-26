const Products = require("../models/products");
const path = require("path");
const fs = require("fs").promises;

exports.createProduct = async (req, res) => {
  try {
    const imageName = req.files.map((file) => file.filename);

    let sizes = req.body.item_sizes;
    if (typeof sizes === "string") {
      sizes = JSON.parse(sizes);
    }

    const product = await Products.create({
      item_name: req.body.item_name,
      item_description: req.body.item_description,
      item_category: req.body.item_category,
      item_price: req.body.item_price,
      item_images: imageName,
      item_sizes: sizes,
      item_stock: req.body.item_stock,
      item_visible: req.body.item_visible,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const product = await Products.find({
      isArchived: { $ne: true },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProductsForAdmin = async (req, res) => {
  try {
    const product = await Products.find();
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.archiveProduct = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.isArchived) {
      return res
        .status(400)
        .json({ success: false, message: "Product is already archived" });
    }

    product.isArchived = true;
    product.archivedAt = new Date();

    await product.save();
    res.json({
      success: true,
      message: "Product archived successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.restoreProduct = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (!product.isArchived) {
      return res
        .status(400)
        .json({ success: false, message: "Product is not archived" });
    }

    product.isArchived = false;
    product.archivedAt = null;

    await product.save();
    res.json({
      success: true,
      message: "Product restored successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// exports.updateProduct = async (req, res) => {
//   try {
//     let updateData = { ...req.body };

//     if (typeof updateData.item_sizes === "string") {
//       updateData.item_sizes = JSON.parse(updateData.item_sizes);
//     }
//     let product = await Products.findOne({ _id: req.params.id });
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }
//     let existingImages = req.body.existing_images || [];
//     if (!Array.isArray(existingImages)) {
//       existingImages = [existingImages];
//     }
//     const uploadedImages = req.files?.map((file) => file.filename) || [];
//     const imagesToRemove = product.item_images.filter(
//       (img) => !existingImages.includes(img),
//     );
//     if (!existingImages.length && product.item_images.length > 0) {
//       console.warn("⚠️ Prevented deleting all images (empty existingImages)");
//     } else {
//       for (const img of imagesToRemove) {
//         const filePath = path.join(__dirname, "..", "uploads", img);
//         try {
//           await fs.unlink(filePath);
//         } catch (error) {
//           if (error.code !== "ENOENT") {
//             console.error("Error deleting file:", error);
//           }
//         }
//       }
//     }
//     updateData.item_images = [...existingImages, ...uploadedImages];

//     product = await Products.findOneAndUpdate(
//       { _id: req.params.id },
//       updateData,
//       { returnDocument: "after" },
//     );
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.updateProduct = async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let updateData = { ...req.body };

    // Convert archivedAt string "null" into actual null
    if (updateData.archivedAt === "null") {
      updateData.archivedAt = null;
    }
    // Convert the isArchived string into a boolean
    if (updateData.isArchived === "true") {
      updateData.isArchived = true;
    } else if (updateData.isArchived === "false") {
      updateData.isArchived = false;
    }

    // Parse item_sizes safely
    if (typeof updateData.item_sizes === "string") {
      try {
        updateData.item_sizes = JSON.parse(updateData.item_sizes);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid item_sizes format",
        });
      }
    }

    // Normalize existing_images
    let existingImages = req.body.existing_images;

    if (existingImages === undefined) {
      existingImages = product.item_images || [];
    } else if (!Array.isArray(existingImages)) {
      existingImages = [existingImages];
    }

    const uploadedImages = req.files?.map((file) => file.filename) || [];

    updateData.item_images = [...existingImages, ...uploadedImages];

    // Update and validate the document
    Object.assign(product, updateData);
    await product.save();

    return res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating product:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Products.findOne({ _id: req.params.id });
    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.item_images?.length > 0) {
      for (const img of product.item_images) {
        const filePath = path.join(__dirname, "..", "uploads", img);
        try {
          await fs.unlink(filePath);
        } catch (error) {
          if (error.code !== "ENOENT") {
            console.error("Error deleting file:", error);
          }
        }
      }
    }
    await Products.findOneAndDelete({ _id: req.params.id });
    res.json({
      success: true,
      message: "Product deleted successfully",
      id: req.params.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
