// Mock authentication for testing purposes
// This simulates Firebase authentication without requiring a real Firebase project

class MockAuth {
  constructor() {
    this.currentUser = null;
    this.listeners = [];
  }

  // Mock sign in
  async signInWithEmailAndPassword(email, password) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation - more realistic validation
    if (!email || !password) {
      throw new Error("Please enter both email and password");
    }

    if (!this.isValidEmail(email)) {
      throw new Error("Please enter a valid email address");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // For demo purposes, accept these test credentials:
    const validCredentials = [
      { email: "test@example.com", password: "password123" },
      { email: "user@test.com", password: "123456" },
      { email: "demo@demo.com", password: "demo123" },
    ];

    const isValidCredential = validCredentials.some(
      (cred) => cred.email === email && cred.password === password
    );

    if (isValidCredential) {
      const user = {
        uid: `mock_${Date.now()}`,
        email: email,
        displayName: email.split("@")[0] || "User",
        photoURL: null,
      };

      this.currentUser = user;
      this.notifyListeners(user);

      return { user };
    } else {
      throw new Error(
        "Invalid email or password. Try: test@example.com / password123"
      );
    }
  }

  // Mock sign up
  async createUserWithEmailAndPassword(email, password) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation
    if (!email || !password) {
      throw new Error("Please enter both email and password");
    }

    if (!this.isValidEmail(email)) {
      throw new Error("Please enter a valid email address");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // For sign up, we'll accept any valid email/password combination
    const user = {
      uid: `mock_${Date.now()}`,
      email: email,
      displayName: email.split("@")[0] || "User",
      photoURL: null,
    };

    this.currentUser = user;
    this.notifyListeners(user);

    return { user };
  }

  // Mock sign out
  async signOut() {
    this.currentUser = null;
    this.notifyListeners(null);
  }

  // Mock auth state listener
  onAuthStateChanged(callback) {
    this.listeners.push(callback);

    // Call immediately with current user
    callback(this.currentUser);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Notify all listeners
  notifyListeners(user) {
    this.listeners.forEach((callback) => callback(user));
  }

  // Email validation helper
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Create mock auth instance
export const auth = new MockAuth();

// Mock database (not used in auth but needed for compatibility)
export const db = {
  collection: () => ({
    doc: () => ({
      set: () => Promise.resolve(),
      get: () => Promise.resolve({ exists: false }),
      update: () => Promise.resolve(),
      delete: () => Promise.resolve(),
    }),
  }),
};

export default auth;
