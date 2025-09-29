import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../Utility/firebase";
import { useAuth } from "../../Components/AuthProvider/AuthProvider";
import classes from "./SignUp.module.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Passwords should be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update user profile with name
      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      navigate("/");
    } catch (error) {
      // Handle specific Firebase auth errors
      let errorMessage = "An error occurred. Please try again.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage =
            "An account with this email already exists. Please sign in instead.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        case "auth/weak-password":
          errorMessage =
            "Password is too weak. Please choose a stronger password.";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Account creation is currently disabled.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later.";
          break;
        default:
          errorMessage =
            error.message || "An error occurred. Please try again.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.formContainer}>
        <Link to="/" className={classes.logo}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png"
            alt="Amazon"
            className={classes.logoImg}
          />
        </Link>

        <div className={classes.form}>
          <h1>Create Account</h1>
          {error && <div className={classes.error}>{error}</div>}
          {success && <div className={classes.success}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className={classes.inputGroup}>
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={classes.input}
              />
            </div>

            <div className={classes.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={classes.input}
              />
            </div>

            <div className={classes.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={classes.input}
                placeholder="At least 6 characters"
                minLength={6}
              />
              {formData.password && formData.password.length < 6 && (
                <div className={classes.validationText}>
                  Password must be at least 6 characters
                </div>
              )}
            </div>

            <div className={classes.inputGroup}>
              <label htmlFor="confirmPassword">Re-enter Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={classes.input}
                minLength={6}
              />
              {formData.confirmPassword &&
                formData.password !== formData.confirmPassword && (
                  <div className={classes.validationText}>
                    Passwords do not match
                  </div>
                )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={classes.submitButton}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className={classes.termsText}>
            <p>
              By creating an account, you agree to the ABUSHE'S AMAZON CLONE
              Conditions of Use & Sale. Please see our Privacy Notice, our
              Cookies Notice and our Interest-Based Ads Notice.
            </p>
          </div>

          <div className={classes.signinLink}>
            <p>
              Already have an account? <Link to="/auth/signin">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
