const users = [
  {
    id: 1,
    usn: "admin",
    password: "admin123",
    name: "Admin",
    email: "admin@aclc.edu.ph",
    role: "admin",
  },
  {
    id: 2,
    usn: "87654321",
    password: "87654321",
    name: "Archie",
    email: "archie@aclc.edu.ph",
    role: "student",
  },
];

export const authService = {
  login: async (usn, password) => {
    // console.log("Attempting login with USN:", usn);
    // console.log("Available users:", users);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(
          (u) => u.usn === usn.trim() && u.password === password.trim(),
        );
        if (user) {
          //console.log("Login successful for user:", user);
          localStorage.setItem("user", JSON.stringify(user));
          resolve(user);
        } else {
          console.log("Login Failed");
          reject(new Error("Invalid USN or password"));
        }
      }, 800);
    });
  },

  logout: () => {
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("user");
  },

  setRememberMe: (usn) => {
    localStorage.setItem("rememberMe", usn);
  },

  getRememberMe: () => {
    return localStorage.getItem("rememberMe") || "";
  },

  clearRememberMe: () => {
    localStorage.removeItem("rememberMe");
  },
};
