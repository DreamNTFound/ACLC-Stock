export const seedMerchandise = () => {
  if (!localStorage.getItem("merchandise_items")) {
    localStorage.setItem(
      "merchandise_items",
      JSON.stringify([
        {
          id: 1,
          name: "ACLC T-Shirt",
          description: "Comfortable cotton t-shirt with ACLC logo",
          category: "Clothing",
          price: 600,
          stock: 25,
          image: "https://via.placeholder.com/150?text=ACLC+T-Shirt",
          visible: true,
        },
        {
          id: 2,
          name: "ACLC Hoodie",
          description: "Comfortable cotton hoodie with ACLC logo",
          category: "Clothing",
          price: 600,
          stock: 5,
          image: "https://via.placeholder.com/150?text=ACLC+Hoodie",
          visible: true,
        },
        {
          id: 3,
          name: "ACLC Baseball Cap",
          description: "Comfortable cotton baseball cap with ACLC logo",
          category: "Accessory",
          price: 600,
          stock: 50,
          image: "https://via.placeholder.com/150?text=ACLC+Baseball+Cap",
          visible: true,
        },
        {
          id: 4,
          name: "ACLC Id Lace",
          description: "Comfortable cotton id lace with ACLC logo",
          category: "Accessory",
          price: 600,
          stock: 50,
          image: "https://via.placeholder.com/150?text=ACLC+Id+Lace",
          visible: true,
        },
        {
          id: 5,
          name: "ACLC PE Shirt",
          description: "Comfortable cotton t-shirt with ACLC logo",
          category: "PE Uniform",
          price: 600,
          stock: 0,
          image: "https://via.placeholder.com/150?text=ACLC+PE+Shirt",
          visible: true,
        },
      ]),
    );
  }
};

export const seedReservations = () => {
  if (!localStorage.getItem("reservations")) {
    localStorage.setItem(
      "reservations",
      JSON.stringify([
        {
          id: 1,
          itemName: "ACLC Hoodie",
          userName: "Archie",
          userEmail: "archie@aclc.edu.ph",
          size: "M",
          quantity: 3,
          created_at: "01-06-2025",
          status: "Pending",
          paymentMethod: "GCash",
          gcash_ref: "GCASH123456",
        },
        {
          id: 2,
          itemName: "ACLC PE Shirt",
          userName: "Archie",
          userEmail: "archie@aclc.edu.ph",
          size: "M",
          quantity: 1,
          created_at: "06-12-2025",
          status: "Pending",
          paymentMethod: "GCash",
          gcash_ref: "GCASH123456",
        },
        {
          id: 3,
          itemName: "ACLC T-Shirt",
          userName: "Archie",
          userEmail: "archie@aclc.edu.ph",
          size: "M",
          quantity: 2,
          created_at: "04-25-2025",
          status: "Pending",
          paymentMethod: "GCash",
          gcash_ref: "GCASH123456",
        },
      ]),
    );
  }
};

export const seedSchedule = () => {
  if (!localStorage.getItem("restock_schedule")) {
    localStorage.setItem(
      "restock_schedule",
      JSON.stringify([
        {
          id: 1,
          merchandise_item: {
            id: 2,
            name: "ACLC Hoodie",
          },
          expected_date: "2025-06-25",
          expected_quantity: 50,
          status: "Scheduled",
          notes: "Waiting for supplier confirmation",
        },
        {
          id: 2,
          merchandise_item: {
            id: 5,
            name: "ACLC PE Shirt",
          },
          expected_date: "2025-05-12",
          expected_quantity: 50,
          status: "Scheduled",
          notes: "Waiting for supplier confirmation",
        },
      ]),
    );
  }
};

export const seedLocalShop = () => {
  if (!localStorage.getItem("localShop")) {
    localStorage.setItem(
      "localShop",
      JSON.stringify([
        {
          id: 1,
          name: "Main Campus Store",
          address: "123 Fatima",
          contact: "0987654321",
          avail_items: [
            "Uniform",
            "PE Uniform",
            "ID Lace",
            "School Supply",
            "Accessory",
            "Other",
          ],
          mapLink: "https://maps.google.com/?q=123+Fatima",
          partner: true,
          active: true,
        },
        {
          id: 2,
          name: "57th Street Branch",
          address: "123 Real Avenue",
          contact: "0987654321",
          avail_items: ["Uniform", "PE Uniform", "ID Lace"],
          mapLink: "https://maps.google.com/?q=123+Real+Avenue",
          partner: true,
          active: true,
        },
        {
          id: 3,
          name: "Local Store",
          address: "123 Davao Bohol Branch",
          contact: "0987654321",
          avail_items: ["ID Lace", "School Supply", "Accessory", "Other"],
          mapLink: "https://maps.google.com/?q=123+Davao+Bohol+Branch",
          partner: true,
          active: true,
        },
      ]),
    );
  }
};
