import React, { useState } from "react";
import LayOut from "../../Components/LayOut/LayOut";
import { useAuth } from "../../Components/AuthProvider/AuthProvider";
import classes from "./Profile.module.css";

const Profile = () => {
  const { user, updateUserProfile, updateUserEmail, updateUserPassword } =
    useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Profile update form
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || "",
  });

  // Email update form
  const [emailData, setEmailData] = useState({
    newEmail: "",
    currentPassword: "",
  });

  // Password update form
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateUserProfile({ displayName: profileData.displayName });
      setSuccess("Profile updated successfully!");
    } catch (error) {
      setError(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await updateUserEmail(emailData.newEmail, emailData.currentPassword);
      setSuccess("Email updated successfully!");
      setEmailData({ newEmail: "", currentPassword: "" });
    } catch (error) {
      setError(error.message || "Failed to update email");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await updateUserPassword(
        passwordData.newPassword,
        passwordData.currentPassword
      );
      setSuccess("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setError(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <LayOut>
        <div className={classes.container}>
          <h1>Profile</h1>
          <div className={classes.error}>
            <p>Please sign in to view your profile.</p>
          </div>
        </div>
      </LayOut>
    );
  }

  return (
    <LayOut>
      <div className={classes.container}>
        <h1>Your Account</h1>

        <div className={classes.tabs}>
          <button
            className={`${classes.tab} ${
              activeTab === "profile" ? classes.active : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile Information
          </button>
          <button
            className={`${classes.tab} ${
              activeTab === "email" ? classes.active : ""
            }`}
            onClick={() => setActiveTab("email")}
          >
            Email Settings
          </button>
          <button
            className={`${classes.tab} ${
              activeTab === "password" ? classes.active : ""
            }`}
            onClick={() => setActiveTab("password")}
          >
            Password Settings
          </button>
        </div>

        <div className={classes.content}>
          {error && <div className={classes.error}>{error}</div>}
          {success && <div className={classes.success}>{success}</div>}

          {activeTab === "profile" && (
            <div className={classes.section}>
              <h2>Profile Information</h2>
              <form onSubmit={handleProfileUpdate}>
                <div className={classes.formGroup}>
                  <label htmlFor="displayName">Display Name</label>
                  <input
                    type="text"
                    id="displayName"
                    value={profileData.displayName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        displayName: e.target.value,
                      })
                    }
                    className={classes.input}
                    required
                  />
                </div>
                <div className={classes.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={user.email}
                    className={classes.input}
                    disabled
                  />
                  <small>
                    Email cannot be changed here. Use Email Settings tab.
                  </small>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={classes.submitButton}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "email" && (
            <div className={classes.section}>
              <h2>Email Settings</h2>
              <form onSubmit={handleEmailUpdate}>
                <div className={classes.formGroup}>
                  <label htmlFor="newEmail">New Email</label>
                  <input
                    type="email"
                    id="newEmail"
                    value={emailData.newEmail}
                    onChange={(e) =>
                      setEmailData({ ...emailData, newEmail: e.target.value })
                    }
                    className={classes.input}
                    required
                  />
                </div>
                <div className={classes.formGroup}>
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={emailData.currentPassword}
                    onChange={(e) =>
                      setEmailData({
                        ...emailData,
                        currentPassword: e.target.value,
                      })
                    }
                    className={classes.input}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={classes.submitButton}
                >
                  {loading ? "Updating..." : "Update Email"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "password" && (
            <div className={classes.section}>
              <h2>Password Settings</h2>
              <form onSubmit={handlePasswordUpdate}>
                <div className={classes.formGroup}>
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className={classes.input}
                    required
                  />
                </div>
                <div className={classes.formGroup}>
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className={classes.input}
                    required
                    minLength={6}
                  />
                </div>
                <div className={classes.formGroup}>
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className={classes.input}
                    required
                    minLength={6}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={classes.submitButton}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </LayOut>
  );
};

export default Profile;
