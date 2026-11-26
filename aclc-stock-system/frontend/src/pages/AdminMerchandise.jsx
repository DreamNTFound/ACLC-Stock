import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Modal from "@/components/common/Modal";
import Skeleton from "@mui/material/Skeleton";
import { ArchiveIcon, SquarePen, Trash } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { categoryOptions, formDate } from "@/utils/formatHelpers";
import { productService } from "@/services/merchandiseService";
import Swal from "sweetalert2";

export default function Merchandise() {
  const menuRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("filter");

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isDelItemModalOpen, setIsDelItemModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [mode, setMode] = useState("add");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 }); // for context menu
  const [openMenuId, setOpenMenuId] = useState(null); // for context menu
  const [searchItem, setSearchItem] = useState("");
  const [openSelect, setOpenSelect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const isFiltered = !!filter;

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProductsForAdmin();
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
        setItems([]);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    loadItems();

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuRef]);

  const getInitialItem = {
    item_name: "",
    item_description: "",
    item_category: "",
    item_price: 0,
    item_images: [],
    item_sizes: [],
    item_stock: 0,
    item_visible: true,
  };
  const [itemForm, setItemForm] = useState(getInitialItem);
  const resetForm = () => {
    setItemForm(getInitialItem);
  };

  {
    /* Add Function */
  }
  const handleAddItem = () => {
    setMode("add");
    setSelectedItemId(null);
    setItemForm(getInitialItem);
    setIsAddItemOpen(true);
    setImageFiles([]);
    setImagePreviews([]);
  };

  {
    /* Edit Function */
  }
  const handleEditItem = (id) => {
    const itemToEdit = items.find((item) => item._id === id);
    if (!itemToEdit) return;
    setMode("edit");
    setOpenMenuId(null);
    setSelectedItemId(id);
    setItemForm({
      ...getInitialItem,
      ...itemToEdit,
    });
    setExistingImages(itemToEdit.item_images || []);
    const existingImage = itemToEdit.item_images.map(
      (img) => `http://localhost:5000/uploads/${img}`,
    );
    setImagePreviews(existingImage);
    setImageFiles([]);
    setIsAddItemOpen(true);
  };

  {
    /* Delete Function */
  }
  const handleDeleteItem = async (id) => {
    setSelectedItemId(id);
    setIsDelItemModalOpen(true);
    setOpenMenuId(null);
  };

  const confirmDeleteItem = async () => {
    if (!selectedItemId || isDeleting) return;

    try {
      setIsDeleting(true);

      await productService.deleteProduct(selectedItemId);

      setItems((prev) => prev.filter((item) => item._id !== selectedItemId));

      setIsDelItemModalOpen(false);
      setSelectedItemId(null);
      resetForm();

      await Toast.fire({
        icon: "success",
        title: "Product deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting item:", error);

      await Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text:
          error?.message || "Unable to delete the product. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // const confirmDeleteItem = async () => {
  //   if (!selectedItemId) return;
  //   try {
  //     setIsDeleting(true);
  //     await productService.deleteProduct(selectedItemId);
  //     setItems((prev) => prev.filter((item) => item._id !== selectedItemId));
  //     setTimeout(() => {
  //       setIsDelItemModalOpen(false);
  //       setSelectedItemId(null);
  //       resetForm();
  //     }, 1000);
  //   } catch (error) {
  //     console.error("Error deleting item:", error);
  //   }
  // };

  {
    /* Archive Function */
  }
  const handleArchiveItem = async (id) => {
    try {
      await productService.archiveProduct(id);

      const archivedAt = new Date().toISOString();

      setItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isArchived: true, archivedAt } : item,
        ),
      );

      setOpenMenuId(null);
    } catch (error) {
      console.error("Error archiving product:", error);
    }
  };

  const handleRestoreItem = async (id) => {
    try {
      await productService.restoreProduct(id);

      setItems((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isArchived: false } : item,
        ),
      );

      setOpenMenuId(null);
    } catch (error) {
      console.error("Error restoring product:", error);
    }
  };

  {
    /* Saved Function */
  }

  const saved = async (e) => {
    e.preventDefault();

    if (isSaving) return;

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const isEditing = mode === "edit";

    setIsSaving(true);

    try {
      if (isEditing) {
        const response = await productService.updateProduct(
          selectedItemId,
          itemForm,
          imageFiles,
          existingImages,
        );

        const updatedProduct =
          response?.product ??
          response?.data?.product ??
          response?.data ??
          response;

        setItems((prev) =>
          prev.map((item) =>
            item._id === selectedItemId
              ? { ...item, ...itemForm, ...updatedProduct, _id: item._id }
              : item,
          ),
        );
      } else {
        const newItem = await productService.addProduct(itemForm, imageFiles);

        setItems((prev) => [...prev, newItem]);
      }

      setIsAddItemOpen(false);
      resetForm();
      setImageFiles([]);
      setImagePreviews([]);
      setExistingImages([]);
      setFormErrors({});

      await Toast.fire({
        icon: "success",
        title: isEditing
          ? "Product updated successfully!"
          : "Product created successfully!",
      });
    } catch (error) {
      console.error("Error saving item:", error);

      await Swal.fire({
        icon: "error",
        title: isEditing ? "Update Failed" : "Creation Failed",
        text:
          error?.message ||
          `Unable to ${isEditing ? "update" : "create"} the product. Please try again.`,
      });
    } finally {
      setIsSaving(false);
    }
  };

  // const saved = async (e) => {
  //   e.preventDefault();

  //   if (isSaving) return;

  //   const errors = validateForm();

  //   if (Object.keys(errors).length > 0) {
  //     setFormErrors(errors);
  //     return;
  //   }

  //   setIsSaving(true);

  //   try {
  //     if (mode === "edit") {
  //       const response = await productService.updateProduct(
  //         selectedItemId,
  //         itemForm,
  //         imageFiles,
  //         existingImages,
  //       );

  //       const updatedProduct =
  //         response?.product ??
  //         response?.data?.product ??
  //         response?.data ??
  //         response;

  //       setItems((prev) =>
  //         prev.map((item) =>
  //           item._id === selectedItemId
  //             ? { ...item, ...itemForm, ...updatedProduct, _id: item._id }
  //             : item,
  //         ),
  //       );
  //     } else {
  //       const newItem = await productService.addProduct(itemForm, imageFiles);

  //       setItems((prev) => [...prev, newItem]);
  //     }

  //     setIsAddItemOpen(false);
  //     resetForm();
  //     setImageFiles([]);
  //     setImagePreviews([]);
  //     setExistingImages([]);
  //     setFormErrors({});
  //   } catch (error) {
  //     console.error("Error saving item:", error);
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  const handlePreview = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);
    const newPreview = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreview]);
  };

  const handleRemoveImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    if (index < existingImages.length) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newImageIdx = index - existingImages.length;
      setImageFiles((prev) => prev.filter((_, i) => i !== newImageIdx));
    }
  };

  {
    /* Size Function */
  }
  const handleAddSize = () => {
    setItemForm((prev) => ({
      ...prev,
      item_sizes: [...prev.item_sizes, { size: "", stock: 0 }],
    }));
  };

  const handleSizeChange = (index, field, value) => {
    setItemForm((prev) => {
      const newSizes = [...prev.item_sizes];
      newSizes[index] = {
        ...newSizes[index],
        [field]: field === "stock" ? Number(value) : value,
      };
      return { ...prev, item_sizes: newSizes };
    });
  };

  const handleRemoveSize = (index) => {
    setItemForm((prev) => {
      const newSizes = prev.item_sizes.filter((_, i) => i !== index);
      return { ...prev, item_sizes: newSizes };
    });
  };

  const getTotalStock = (item) => {
    if (item.item_sizes && item.item_sizes.length > 0) {
      const total = item.item_sizes.reduce((total, s) => {
        const stockNum = Number(s.item_stock);
        return total + (isNaN(stockNum) ? 0 : stockNum);
      }, 0);
      return total;
    }
    return Number(item.item_stock) || 0;
  };

  {
    /* Filter Function */
  }
  const getStockStatus = (item) => {
    const totalStock = getTotalStock(item);
    if (totalStock === 0) return "out of stock";
    if (totalStock <= 5) return "low stock";
    if (totalStock > 5) return "in stock";
    return item.stock;
  };

  // const filteredItems = items.filter((item) => {
  //   const isArchived = item.isArchived === true;

  //   const matchesTab = activeTab === "active" ? !isArchived : isArchived;

  //   const matchesSearch = item.item_name
  //     .toLowerCase()
  //     .includes(searchItem.toLowerCase());
  //   const status = getStockStatus(item);
  //   const matchesFilter =
  //     filter === "out-of-stock"
  //       ? status === "out of stock"
  //       : filter === "low-stock"
  //         ? status === "low stock"
  //         : true;

  //   return matchesTab && matchesSearch && matchesFilter;
  // });

  const filteredItems = items.filter((item) => {
    const isArchived = item.isArchived === true;

    const matchesTab = activeTab === "active" ? !isArchived : isArchived;

    const itemName = (item.item_name ?? "").toLowerCase();
    const search = (searchItem ?? "").toLowerCase();

    const matchesSearch = itemName.includes(search);

    const status = getStockStatus(item);

    const matchesFilter =
      filter === "out-of-stock"
        ? status === "out of stock"
        : filter === "low-stock"
          ? status === "low stock"
          : true;

    return matchesTab && matchesSearch && matchesFilter;
  });

  const handleCategorySelect = (option) => {
    setItemForm((prev) => ({
      ...prev,
      item_category: option,
    }));
    setOpenSelect(false);
  };

  const validateForm = () => {
    const errors = {};
    if (!itemForm.item_name?.trim()) {
      errors.item_name = "Item name is required";
    }
    if (!itemForm.item_description) {
      errors.item_description = "Item description is required";
    }
    if (!itemForm.item_price) {
      errors.item_price = "Price is required";
    }
    if (!itemForm.item_category) {
      errors.item_category = "Category is required";
    }
    const totalImages = imageFiles.length + existingImages.length;
    if (totalImages === 0) {
      errors.item_images = "At least one image is required";
    }
    return errors;
  };

  const activeCount = items.filter((item) => item.isArchived !== true).length;

  const archivedCount = items.filter((item) => item.isArchived === true).length;

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="bg-[#1e3a5f] text-white sticky top-0 z-50 shadow-lg">
          <Navbar />
        </nav>
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="space-y-6">
              {/* Add Item */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#1e3a5f]">
                    Merchandise Management
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">
                    Add, edit, and manage school merchandise items
                  </p>
                </div>
                <button
                  onClick={handleAddItem}
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-colors shadow h-9 px-4 py-2 bg-[#d4a843] hover:bg-[#c49a3a] text-[#1e3a5f] font-semibold"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>

                  <span>Add Item</span>
                </button>
              </div>

              {/* Filter between active and archived */}
              <div className="flex items-center gap-2 border-b border-slate-20">
                <button
                  type="button"
                  onClick={() => setActiveTab("active")}
                  className={`relative px-1 pb-3 text-sm font-medium transition-colors ${
                    activeTab === "active"
                      ? "text-[#1e3a5f] border-b-2 border-[#d4a843]"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Active Inventory {activeCount}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("archived")}
                  className={`flex items-center px-1 pb-3 text-sm font-medium transition-colors ${
                    activeTab === "archived"
                      ? "text-[#1e3a5f] border-b-2 border-[#d4a843]"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <ArchiveIcon size={16} className="mr-1" />
                  Archived {archivedCount}
                </button>
              </div>

              {/* Search bar */}
              <div className="relative max-w-sm flex items-center gap-2">
                <div className="relative flex-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchItem}
                    onChange={(e) => setSearchItem(e.target.value)}
                    className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors md:text-sm pl-10 bg-white border-slate-200"
                  />
                </div>
                {isFiltered && (
                  <button
                    onClick={() => setSearchParams({})}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-colors shadow h-9 px-4 py-2 bg-[#e57373] hover:bg-[#ef5350] text-white font-semibold"
                  >
                    <span>Clear</span>
                  </button>
                )}
              </div>

              <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="p-0">
                  <div className="overflow-x-a">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted bg-slate-50">
                            <th className="h-10 px-2 text-left align-middle font-medium text-mute-foreground]">
                              Item
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-mute-foreground]">
                              Category
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-mute-foreground]">
                              Price
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-mute-foreground]">
                              Stock
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-mute-foreground]">
                              Status
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-mute-foreground]">
                              Posted On
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-mute-foreground]">
                              {activeTab === "archived"
                                ? "Archived On"
                                : "Visible"}
                            </th>
                            <th className="h-10 px-2 text-left align-middle font-medium text-mute-foreground] w-12"></th>
                          </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                          {loading ? (
                            Array.from({ length: 8 }).map((_, idx) => (
                              <tr key={idx}>
                                <td
                                  colSpan={8}
                                  className="p-1 align-middle font-medium text-[#1e3a5f]"
                                >
                                  <Skeleton
                                    variant="rectangular"
                                    width="100%"
                                    height={50}
                                    className="rounded-md"
                                  />
                                </td>
                              </tr>
                            ))
                          ) : filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                              <tr
                                key={item._id}
                                className="opacity-0 animate-fadeIn"
                              >
                                <td className="p-2 align-middle">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                      {item?.item_images?.[0] ? (
                                        <img
                                          src={`http://localhost:5000/uploads/${item?.item_images?.[0]}`}
                                          alt="item"
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.target.style.display = "none";
                                          }}
                                        />
                                      ) : (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="lucide lucide-package-icon lucide-package w-4 h-4 text-slate-400"
                                        >
                                          <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                                          <path d="M12 22V12" />
                                          <polyline points="3.29 7 12 12 20.71 7" />
                                          <path d="m7.5 4.27 9 5.15" />
                                        </svg>
                                      )}
                                    </div>
                                    <span className="font-medium text-[#1e3a5f]">
                                      {item.item_name}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-2 align-middle">
                                  {item.item_category}
                                </td>
                                <td className="p-2 align-middle font-semibold">
                                  {formatCurrency(item.item_price)}
                                </td>
                                <td className="p-2 align-middle font-semibold">
                                  {getTotalStock(item)}
                                </td>
                                <td className="p-2 align-middle">
                                  <div
                                    className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-semibold transition-color border-transparent shadow hover:bg-primary/80 bg-emerald-100 text-emerald-700 border text-xs ${
                                      getStockStatus(item) === "out of stock"
                                        ? "bg-red-100 text-red-700"
                                        : getStockStatus(item) === "low stock"
                                          ? "bg-yellow-100 text-yellow-700"
                                          : "bg-emerald-100 text-emerald-700"
                                    }`}
                                  >
                                    {getStockStatus(item)}
                                  </div>
                                </td>
                                <td className="p-2 align-middle">
                                  {formDate(item.createdAt)}
                                </td>
                                <td className="p-2 align-middle">
                                  {activeTab === "archived" ? (
                                    formDate(item.archivedAt)
                                  ) : item.item_visible ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-4 h-4 text-emerald-500"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                      />
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="w-4 h-4 text-red-500"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                      />
                                    </svg>
                                  )}
                                </td>
                                <td className="p-2 align-middle">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const rect =
                                        e.currentTarget.getBoundingClientRect();
                                      const menuWidth = 128;
                                      const padding = 8;

                                      let left = rect.right - menuWidth;

                                      if (
                                        left + menuWidth >
                                        window.innerWidth
                                      ) {
                                        left =
                                          window.innerWidth -
                                          menuWidth -
                                          padding;
                                      }

                                      if (left < padding) left = padding;

                                      setMenuPosition({
                                        top: rect.bottom + 6,
                                        left,
                                      });
                                      setOpenMenuId((prevId) =>
                                        prevId === item._id ? null : item._id,
                                      );
                                    }}
                                    className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors duration-200 ease-in-out"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      strokeWidth={1.5}
                                      stroke="currentColor"
                                      className="size-6 text-slate-500"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                                      />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={8}
                                className="text-center py-4 text-slate-500"
                              >
                                No items found.
                              </td>
                            </tr>
                          )}

                          {/* <tr>
                            <td colSpan={7} className="p-2">
                              <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                              />
                            </td>
                          </tr> */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white mt-8">
          <Footer />
        </footer>
      </div>

      {/* Edit, Archive, Delete Buttons */}
      {openMenuId && (
        <>
          <div
            ref={menuRef}
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
            }}
            className="fixed w-32 rounded-md border border-slate-200 bg-transparent bg-white shadow-lg z-50"
          >
            {/* Edit */}
            <button
              onClick={() => handleEditItem(openMenuId)}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 bg-white border-b border-slate-200"
            >
              <SquarePen size={16} />
              <span className="">Edit</span>
            </button>
            {/* Archived */}
            {/* Archive or Restore */}
            {items.find((item) => item._id === openMenuId)?.isArchived ? (
              <button
                type="button"
                onClick={() => handleRestoreItem(openMenuId)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 bg-white border-b border-slate-200"
              >
                <ArchiveIcon size={16} />
                <span>Restore</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleArchiveItem(openMenuId)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 bg-white border-b border-slate-200"
              >
                <ArchiveIcon size={16} />
                <span>Archive</span>
              </button>
            )}
            {/* Delete */}
            <button
              onClick={() => handleDeleteItem(openMenuId)}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 bg-white border-b border-slate-200"
            >
              <Trash className="text-red-500" size={16} />
              <span className="text-red-500">Delete</span>
            </button>
          </div>
        </>
      )}

      {/* Add / Edit Item Modal */}
      <Modal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        title={mode === "edit" ? "Edit Merchandise" : "Add Merchandise"}
        children={
          <>
            <form onSubmit={saved} className="space-y-4 py-2">
              <div>
                <label className="text-sm font-medium leading-none">
                  Name *
                </label>
                <input
                  type="text"
                  value={itemForm.item_name}
                  onChange={(e) =>
                    setItemForm({ ...itemForm, item_name: e.target.value })
                  }
                  className="inline-flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm"
                />
                {formErrors.item_name && (
                  <p className="text-red-500 text-xs">{formErrors.item_name}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium leading-none">
                  Description *
                </label>
                <textarea
                  type="text"
                  value={itemForm.item_description}
                  onChange={(e) =>
                    setItemForm({
                      ...itemForm,
                      item_description: e.target.value,
                    })
                  }
                  className="inline-flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm"
                />
                {formErrors.item_description && (
                  <p className="text-red-500 text-xs">
                    {formErrors.item_description}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="text-sm font-medium leading-none">
                    Category
                  </label>
                  <button
                    type="button"
                    onClick={() => setOpenSelect(!openSelect)}
                    className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input px-3 py-2 text-sm shadow-sm ring-offset-background w-full bg-white"
                  >
                    {itemForm.item_category || "Select Category"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19.5 8.25-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </button>
                  {formErrors.item_category && (
                    <p className="text-red-500 text-xs">
                      {formErrors.item_category}*
                    </p>
                  )}
                  {openSelect && (
                    <ul className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-md">
                      {categoryOptions.map((option) => (
                        <li
                          key={option}
                          onClick={() => {
                            handleCategorySelect(option);
                            setOpenSelect(false);
                          }}
                          className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium leading-none">
                    Price (₱)
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={itemForm.item_price}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, item_price: e.target.value })
                    }
                    className="inline-flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm"
                  />
                  {formErrors.item_price && (
                    <p className="text-red-500 text-xs">
                      {formErrors.item_price}*
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="text-slate-900 text-sm font-medium">
                  Images
                </label>
                <div className="flex items-center gap-3 mt-1 relative z-10">
                  {imagePreviews.map((img, idx) => (
                    <div key={idx} className="relative group w-24 h-24">
                      <img
                        src={img}
                        alt="Preview"
                        className="w-24 h-24 object-cover shadow-md hover:shadow-lg transition-colors duration-300 ease-in-out"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg text-sm text-slate-500 hover:bg-slate-50 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                        />
                      </svg>
                      <span>Upload Images</span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handlePreview}
                      multiple
                      accept="image/*"
                    />
                    {formErrors.item_images && (
                      <p className="text-red-500 text-xs">
                        {formErrors.item_images}*
                      </p>
                    )}
                  </label>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium leading-none">
                    Sizes & Stock
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSize}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium rounded-md text-sm transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-8 px-3 text-xs"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4 mr-2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    <span>Add Size</span>
                  </button>
                </div>
                {itemForm.item_sizes.length === 0 ? (
                  <div>
                    <label className="font-medium text-xs text-slate-500">
                      Total Stock (no sizes)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={itemForm.item_stock}
                      onChange={(e) =>
                        setItemForm({ ...itemForm, item_stock: e.target.value })
                      }
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors md:text-sm"
                    />
                  </div>
                ) : (
                  itemForm.item_sizes.map((sizeItem, index) => (
                    <div key={index}>
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Size (e.g. S, M, L)"
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors md:text-sm"
                          value={sizeItem.item_sizes ?? ""}
                          onChange={(e) =>
                            handleSizeChange(
                              index,
                              "item_sizes",
                              e.target.value,
                            )
                          }
                        />
                        <input
                          type="number"
                          min={0}
                          className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm w-24"
                          value={sizeItem.item_stock ?? ""}
                          onChange={(e) =>
                            handleSizeChange(
                              index,
                              "item_stock",
                              e.target.value,
                            )
                          }
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(index)}
                          className="text-red-600 hover:text-red-800"
                          aria-label="Remove size"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-slate-500">
                        Total: {sizeItem.item_stock} items
                      </p>
                    </div>
                  ))
                )}
              </div>
              <div className="flex items-center justify-between">
                <label className="font-medium text-xs text-slate-500">
                  Active (visible to students)
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setItemForm((prev) => ({
                      ...prev,
                      item_visible: !prev.item_visible,
                    }))
                  }
                  aria-pressed={!!itemForm.item_visible}
                  className={`inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors duration-200 ease-in-out focus:outline-none focus:ring-0 ${
                    itemForm.item_visible ? "bg-emerald-500" : "bg-slate-900"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      itemForm.item_visible ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 py-4 border-t border-slate-200 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (isSaving) return;

                    setIsAddItemOpen(false);
                    resetForm();
                    setImageFiles([]);
                    setImagePreviews([]);
                    setExistingImages([]);
                    setFormErrors({});
                  }}
                  disabled={isSaving}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 px-4 py-2 mt-1.5 sm:mt-0 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Cancel</span>
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md cursor-pointer mb-1.5 sm:mb-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving && (
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  )}

                  <span>
                    {isSaving
                      ? mode === "edit"
                        ? "Updating..."
                        : "Creating..."
                      : mode === "edit"
                        ? "Update"
                        : "Create"}
                  </span>
                </button>
              </div>
            </form>
          </>
        }
      />
      {/* Delete Product Modal */}
      <Modal
        isOpen={isDelItemModalOpen}
        onClose={() => setIsDelItemModalOpen(false)}
        title="Delete Product"
        children={
          <>
            <h1 className="text-slate-500">
              Are you sure you want to delete this product?
            </h1>

            <div className="flex items-center justify-end gap-3 pt-4 py-4">
              <button
                type="button"
                onClick={() => setIsDelItemModalOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 px-4 py-2 rounded-md cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteItem}
                disabled={isDeleting}
                className={`px-4 py-2 rounded-md text-white ${
                  isDeleting
                    ? "bg-red-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 cursor-pointer"
                }`}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </>
        }
      />
    </>
  );
}
