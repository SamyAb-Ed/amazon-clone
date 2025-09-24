import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./Auth.module.css";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import { ActionType } from "../../Components/Utility/ActionType";
import LayOut from "../../Components/LayOut/LayOut";
import { auth } from "../../Components/Utility/Firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [state, dispatch] = useContext(DataContext);
  const navigate = useNavigate();
  const navStateData = useLocation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Name is required";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        // Sign in with Firebase v9+
        const userCredential = await signInWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        const user = userCredential.user;
        const userData = {
          id: user.uid,
          name: user.displayName || "User",
          email: user.email,
          avatar: user.photoURL || "https://via.placeholder.com/40",
        };

        dispatch({ type: ActionType.SetUser, user: userData });
        navigate("/");
      } else {
        // Create account with Firebase v9+
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        const user = userCredential.user;

        // Update the user's display name
        await updateProfile(user, {
          displayName: formData.name,
        });

        const userData = {
          id: user.uid,
          name: formData.name,
          email: user.email,
          avatar: user.photoURL || "https://via.placeholder.com/40",
        };

        dispatch({ type: ActionType.SetUser, user: userData });
        navigate("/");
      }
    } catch (error) {
      console.error("Authentication error:", error);

      // Handle specific Firebase errors
      let errorMessage = "Authentication failed. Please try again.";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists.";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters.";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        default:
          errorMessage =
            error.message || "Authentication failed. Please try again.";
      }

      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
  };

  return (
    <LayOut>
      <div className={classes.authContainer}>
        <div className={classes.authCard}>
          <div className={classes.authHeader}>
            <div className={classes.logoContainer}>
              <div className={classes.amazonLogo}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                  alt="Amazon Logo"
                  className={classes.logoImage}
                />
              </div>
            </div>
            <h2>{isLogin ? "Sign In" : "Create Account"}</h2>
            <p className={classes.subtitle}>
              {isLogin
                ? "Sign in to your Amazon account"
                : "Create your Amazon account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className={classes.authForm}>
            {errors.general && (
              <div className={classes.errorMessage}>{errors.general}</div>
            )}

            {!isLogin && (
              <div className={classes.formGroup}>
                <label htmlFor="name">Your name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={errors.name ? classes.inputError : ""}
                  placeholder="First and last name"
                />
                {errors.name && (
                  <span className={classes.fieldError}>{errors.name}</span>
                )}
              </div>
            )}

            <div className={classes.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? classes.inputError : ""}
                placeholder="Enter your email"
              />
              {errors.email && (
                <span className={classes.fieldError}>{errors.email}</span>
              )}
            </div>

            <div className={classes.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? classes.inputError : ""}
                placeholder="Enter your password"
              />
              {errors.password && (
                <span className={classes.fieldError}>{errors.password}</span>
              )}
            </div>

            {!isLogin && (
              <div className={classes.formGroup}>
                <label htmlFor="confirmPassword">Re-enter password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? classes.inputError : ""}
                  placeholder="Re-enter your password"
                />
                {errors.confirmPassword && (
                  <span className={classes.fieldError}>
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            )}

            <button
              type="submit"
              className={classes.submitButton}
              disabled={loading}
            >
              {loading ? (
                <div className={classes.spinnerContainer}>
                  <div className={classes.spinner}></div>
                  <span>Please wait...</span>
                </div>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className={classes.authFooter}>
            <p className={classes.termsText}>
              By signing in, you agree to the Amazon Fake conditions of Sale!
            </p>
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleMode}
                className={classes.toggleButton}
              >
                {isLogin ? "Create Account" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </LayOut>
  );
};

export default Auth;
