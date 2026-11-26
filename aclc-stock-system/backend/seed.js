require("dotenv").config();
const connectDB = require("./db");
const User = require("./models/user");
const Profile = require("./models/profile");
const Product = require("./models/products");

async function addSampleData() {
  try {
    // Helper function to create profiles and their login credentials
    const createProfileAndLogin = async (
      usn,
      name,
      email,
      contact,
      role,
      password,
    ) => {
      // Check if the profile already exists
      const existingProfile = await Profile.findOne({ usn });
      if (existingProfile) {
        console.log(
          `${role.charAt(0).toUpperCase() + role.slice(1)} profile already exists.`,
        );
        return; // Exit if profile already exists
      }

      // Create the login credentials for the user
      const newUser = new User({
        usn,
        password,
        role,
      });
      await newUser.save();
      console.log(
        `${role.charAt(0).toUpperCase() + role.slice(1)} Login Credentials created.`,
      );

      // Create a new profile if it doesn't exist
      const newProfile = new Profile({
        usn,
        name,
        email,
        contact,
        userId: newUser._id,
      });

      // Try to save the profile, and catch any duplicate errors
      try {
        await newProfile.save();
        console.log(
          `${role.charAt(0).toUpperCase() + role.slice(1)} profile created.`,
        );
      } catch (error) {
        // Handle the duplicate error gracefully if the profile already exists in the database
        if (error.code === 11000) {
          console.log(
            `${role.charAt(0).toUpperCase() + role.slice(1)} profile with usn: ${usn} already exists.`,
          );
        } else {
          console.error("Error saving profile:", error);
        }
        return; // Prevent further execution if duplicate
      }
    };

    // Create Admin Profile
    await createProfileAndLogin(
      "admin",
      "Admin",
      "admin@aclc.edu.ph",
      "1234567890",
      "admin",
      "admin123",
    );

    // Create Student Profile
    await createProfileAndLogin(
      "12345678",
      "Archie Cabus",
      "archiecabus@gmail.com",
      "1234567890",
      "student",
      "12345678",
    );

    // Create Student #2 Profile
    await createProfileAndLogin(
      "87654321",
      "Kael Ruby",
      "kaelruby@gmail.com",
      "1234567890",
      "student",
      "12345678",
    );

    // Create Student #3 Profile
    // await createProfileAndLogin(
    //   "12348765",
    //   "Kyle Lawrence",
    //   "kaelruby@gmail.com",
    //   "1234567890",
    //   "student",
    //   "12345679",
    // );
  } catch (error) {
    console.error("Error adding sample data:", error);
  }
}

// async function addSampleProducts() {
//   try {
//     const addProduct = async (
//       item_name,
//       item_description,
//       item_category,
//       item_price,
//       item_images,
//       item_stock,
//       item_visible,
//     ) => {
//       const existingProduct = await Product.findOne({ item_name });
//       if (existingProduct) {
//         console.log(
//           `${role.charAt(0).toUpperCase() + role.slice(1)} product already exists.`,
//         );
//         return; // Exit if product already exists
//       }

//       const addProduct = new Product({
//         item_name,
//         item_description,
//         item_category,
//         item_price,
//         item_images,
//         item_stock,
//         item_visible,
//       });

//       // Try to save the product, and catch any duplicate errors
//       try {
//         await addProduct.save();
//         console.log(
//           `${role.charAt(0).toUpperCase() + role.slice(1)} product created.`,
//         );
//       } catch (error) {
//         // Handle the duplicate error gracefully if the product already exists in the database
//         console.error("Error saving product:", error);
//         return; // Prevent further execution if duplicate
//       }
//     };

//     // Create Products
//     await addProduct(
//       "Product 1",
//       "Product 1 Description",
//       "Category 1",
//       100,
//       ["https://example.com/product1.jpg", "https://example.com/product2.jpg"],
//       10,
//       true,
//       10,
//       true,
//     );
//   } catch (error) {
//     console.error("Error adding sample data:", error);
//   }
// }

async function seedAll() {
  await connectDB();
  await addSampleData();
  //await addSampleProducts();
  process.exit(0);
}
seedAll();
