import { createContext, useState, useEffect, useCallback } from "react";

import { authService } from "@/services/authService";
import { userService } from "@/services/userService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    setLoading(true);

    try {
      // Verify the HTTP-only cookie with backend
      const session = await authService.getSession();

      if (!session?.user) {
        setUser(null);
        return null;
      }

      // Load additional profile information
      const profile = await userService.getProfile();

      const currentUser = {
        ...session.user,
        ...(profile || {}),
      };

      setUser(currentUser);

      return currentUser;
    } catch (error) {
      console.error("Error loading user:", error);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    loadUser();

    const handleExpired = () => {
      setUser(null);
    };

    window.addEventListener("auth:expired", handleExpired);

    return () => {
      window.removeEventListener("auth:expired", handleExpired);
    };
  }, [loadUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        reloadUser: loadUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;

// import { createContext, useState, useEffect, useCallback } from "react";

// import { authService } from "@/services/authService";
// import { userService } from "@/services/userService";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const loadUser = useCallback(async () => {
//     setLoading(true);

//     try {
//       // Verify the HTTP-only cookie with backend
//       const session = await authService.getSession();

//       if (!session?.user) {
//         setUser(null);
//         return null;
//       }

//       // Load additional profile information
//       const profile = await userService.getProfile();

//       const currentUser = {
//         ...session.user,
//         ...(profile || {}),
//       };

//       setUser(currentUser);

//       return currentUser;
//     } catch (error) {
//       console.error("Error loading user:", error);
//       setUser(null);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const logout = useCallback(async () => {
//     try {
//       await authService.logout();
//     } finally {
//       setUser(null);
//     }
//   }, []);

//   useEffect(() => {
//     loadUser();

//     const handleExpired = () => {
//       setUser(null);
//     };

//     window.addEventListener("auth:expired", handleExpired);

//     return () => {
//       window.removeEventListener("auth:expired", handleExpired);
//     };
//   }, [loadUser]);

//   return (
//     <UserContext.Provider
//       value={{
//         user,
//         setUser,
//         loading,
//         reloadUser: loadUser,
//         logout,
//       }}
//     >
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserContext;

// // import { createContext, useState, useEffect, useRef } from "react";
// // import { authService } from "@/services/authService";
// // import { userService } from "@/services/userService";

// // const UserContext = createContext();

// // export const UserProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const hasLoaded = useRef(false);

// //   const loadUser = async () => {
// //     setLoading(true);
// //     try {
// //       const auth = authService.getCurrentUser();
// //       if (!auth) {
// //         setUser(null);
// //         return;
// //       }
// //       const profile = await userService.getProfile();

// //       const currentUser = { ...auth, ...profile };

// //       //console.log("Current User:", currentUser);

// //       setUser(currentUser);
// //     } catch (error) {
// //       console.error("Error loading user:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (hasLoaded.current) return;
// //     hasLoaded.current = true;

// //     loadUser();
// //   }, []);

// //   return (
// //     <UserContext.Provider
// //       value={{ user, setUser, loading, reloadUser: loadUser }}
// //     >
// //       {children}
// //     </UserContext.Provider>
// //   );
// // };

// // export default UserContext;
