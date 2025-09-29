import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../Utility/firebase";
import { useAuth } from "../../Components/AuthProvider/AuthProvider";
import classes from "./SignIn.module.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Client-side validation
    if (password.length < 6) {
      setError("Passwords should be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      // Handle specific Firebase auth errors
      let errorMessage = "An error occurred. Please try again.";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection.";
          break;
        case "auth/invalid-credential":
          errorMessage =
            "Invalid email or password. Please check your credentials.";
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

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setError("");
    setSuccess("");

    try {
      await resetPassword(email);
      setSuccess("Password reset email sent! Check your inbox.");
      setShowPasswordReset(false);
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";

      switch (error.code) {
        case "auth/user-not-found":
          errorMessage = "No account found with this email address.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many requests. Please try again later.";
          break;
        default:
          errorMessage =
            error.message || "An error occurred. Please try again.";
      }

      setError(errorMessage);
    } finally {
      setResetLoading(false);
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
          <h1>Sign In</h1>
          {error && <div className={classes.error}>{error}</div>}
          {success && <div className={classes.success}>{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className={classes.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={classes.input}
              />
            </div>

            <div className={classes.inputGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={classes.input}
                minLength={6}
              />
              {password && password.length < 6 && (
                <div className={classes.validationText}>
                  Password must be at least 6 characters
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={classes.submitButton}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {!showPasswordReset ? (
            <div className={classes.passwordReset}>
              <button
                type="button"
                onClick={() => setShowPasswordReset(true)}
                className={classes.resetButton}
              >
                Forgot your password?
              </button>
            </div>
          ) : (
            <div className={classes.passwordResetForm}>
              <h3>Reset Password</h3>
              <p>
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
              <form onSubmit={handlePasswordReset}>
                <div className={classes.inputGroup}>
                  <label htmlFor="resetEmail">Email</label>
                  <input
                    type="email"
                    id="resetEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={classes.input}
                    placeholder="Enter your email address"
                  />
                </div>
                <div className={classes.resetActions}>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className={classes.submitButton}
                  >
                    {resetLoading ? "Sending..." : "Send Reset Email"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordReset(false)}
                    className={classes.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className={classes.termsText}>
            <p>
              By signing-in you agree to the ABE'S AMAZON CLONE Conditions of
              Use & Sale. Please see our Privacy Notice, our Cookies Notice and
              our Interest-Based Ads Notice.
            </p>
          </div>

          <div className={classes.signupLink}>
            <p>
              Don't have an account? <Link to="/auth/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
