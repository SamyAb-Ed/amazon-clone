import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { auth } from "../../Utility/firebase";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthProvider: Starting auth initialization...");

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        console.log(
          "AuthProvider: Auth state changed, user:",
          user ? "logged in" : "not logged in"
        );
        setUser(user);
        setLoading(false);
      },
      (error) => {
        console.error("AuthProvider: Auth state change error:", error);
        setLoading(false);
      }
    );

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log(
        "AuthProvider: Timeout reached - proceeding without authentication"
      );
      setLoading(false);
    }, 3000); // 3 seconds should be enough for Firebase to initialize

    return () => {
      console.log("AuthProvider: Cleaning up...");
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: "Password reset email sent successfully!",
      };
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  };

  const sendVerificationEmail = async () => {
    try {
      if (user && !user.emailVerified) {
        await sendEmailVerification(user);
        return {
          success: true,
          message: "Verification email sent successfully!",
        };
      }
      throw new Error("User not found or email already verified");
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw error;
    }
  };

  const updateUserProfile = async (updates) => {
    try {
      if (user) {
        await updateProfile(user, updates);
        return { success: true, message: "Profile updated successfully!" };
      }
      throw new Error("No user logged in");
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const updateUserEmail = async (newEmail, currentPassword) => {
    try {
      if (user) {
        // Re-authenticate user before changing email
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);

        await updateEmail(user, newEmail);
        return { success: true, message: "Email updated successfully!" };
      }
      throw new Error("No user logged in");
    } catch (error) {
      console.error("Error updating email:", error);
      throw error;
    }
  };

  const updateUserPassword = async (newPassword, currentPassword) => {
    try {
      if (user) {
        // Re-authenticate user before changing password
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);

        await updatePassword(user, newPassword);
        return { success: true, message: "Password updated successfully!" };
      }
      throw new Error("No user logged in");
    } catch (error) {
      console.error("Error updating password:", error);
      throw error;
    }
  };

  const value = {
    user,
    logout,
    loading,
    resetPassword,
    sendVerificationEmail,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword,
  };

  if (loading) {
    console.log("AuthProvider: Still loading, showing loading screen...");
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#f8f9fa",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2>Loading Amazon Clone...</h2>
          <p>Please wait while we initialize the application.</p>
          <p>Initializing Firebase authentication...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
