import { db } from "./firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api-pk4tgockea-uc.a.run.app";

// Payment service to handle Stripe integration and Firebase storage
export class PaymentService {
  static async createPaymentIntent(amount, currency = "usd", metadata = {}) {
    try {
      console.log("Creating payment intent for amount:", amount);
      console.log("API_BASE_URL:", API_BASE_URL);

      // Check if we should use demo mode or real API
      const useDemoMode = true; // Temporarily enable demo mode for testing

      if (useDemoMode) {
        // DEMO MODE: Simulate payment intent creation
        console.log("DEMO MODE: Creating payment intent for amount:", amount);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const mockClientSecret = `pi_demo_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        console.log("DEMO MODE: Payment intent created:", mockClientSecret);
        return mockClientSecret;
      }

      // REAL MODE: Call backend API
      console.log(
        "Making request to:",
        `${API_BASE_URL}/api/payment/create?total=${amount}`
      );
      const response = await fetch(
        `${API_BASE_URL}/api/payment/create?total=${amount}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error(
          "API Response not OK:",
          response.status,
          response.statusText
        );
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Payment intent created:", data);
      return data.clientSecret;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        cause: error.cause,
      });
      console.error("Full error object:", error);
      throw error;
    }
  }

  static async confirmPayment(paymentIntentId, paymentMethodId) {
    try {
      console.log("Confirming payment:", { paymentIntentId, paymentMethodId });

      // Check if we should use demo mode or real API
      const useDemoMode = true; // Temporarily enable demo mode for testing

      if (useDemoMode) {
        // DEMO MODE: Simulate payment confirmation
        console.log("DEMO MODE: Simulating payment confirmation");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          success: true,
          paymentIntent: { id: paymentIntentId, status: "succeeded" },
        };
      }

      // REAL MODE: Call backend API
      const response = await fetch(`${API_BASE_URL}/confirm-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentIntentId,
          paymentMethodId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Payment confirmed:", data.paymentIntent);
      return data;
    } catch (error) {
      console.error("Error confirming payment:", error);
      throw error;
    }
  }

  static async saveOrderToFirebase(orderData) {
    try {
      console.log("Saving order to Firebase:", orderData);

      // Check if we should use demo mode or real API
      const useDemoMode = true; // Use demo mode for order saving to Firebase

      if (useDemoMode) {
        // DEMO MODE: Save directly to Firebase
        const orderRef = await addDoc(collection(db, "orders"), {
          ...orderData,
          createdAt: serverTimestamp(),
          status: "completed",
        });
        console.log("Order saved to Firebase:", orderRef.id);
        return orderRef.id;
      }

      // REAL MODE: Call backend API
      const response = await fetch(`${API_BASE_URL}/save-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Order saved via API:", data.orderId);
      return data.orderId;
    } catch (error) {
      console.error("Error saving order:", error);
      throw error;
    }
  }

  static async processPayment(basket, user, addressData) {
    try {
      const totalAmount = basket.reduce(
        (total, item) => total + item.price * (item.quantity || 1),
        0
      );

      // Create order data
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        items: basket.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity || 1,
          image: item.image,
          description: item.description || "",
        })),
        totalAmount: totalAmount,
        address: addressData,
        paymentStatus: "completed",
        orderDate: new Date().toISOString(),
      };

      // Save order to Firebase
      const orderId = await this.saveOrderToFirebase(orderData);

      return {
        success: true,
        orderId,
        totalAmount,
      };
    } catch (error) {
      console.error("Error processing payment:", error);
      throw error;
    }
  }

  static async fetchUserOrders(userId) {
    try {
      console.log("Fetching orders for user:", userId);

      if (!userId) {
        console.log("No userId provided, returning empty array");
        return [];
      }

      // Check if we should use demo mode or real API
      const useDemoMode = true; // Use demo mode for fetching orders from Firebase

      if (useDemoMode) {
        // DEMO MODE: Fetch directly from Firebase
        const ordersRef = collection(db, "orders");
        const q = query(
          ordersRef,
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        console.log("Query snapshot size:", querySnapshot.size);
        const orders = [];
        querySnapshot.forEach((doc) => {
          console.log("Order document:", doc.id, doc.data());
          orders.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        console.log("Fetched orders from Firebase:", orders);
        return orders;
      }

      // REAL MODE: Call backend API
      const response = await fetch(`${API_BASE_URL}/orders/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched orders via API:", data.orders);
      return data.orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      console.error("Error details:", {
        code: error.code,
        message: error.message,
        stack: error.stack,
      });

      // Return empty array instead of throwing error for better UX
      console.log("Returning empty array due to error");
      return [];
    }
  }

  // Test method to create a sample order (for debugging)
  static async createTestOrder(userId) {
    try {
      const testOrderData = {
        userId: userId,
        userEmail: "test@example.com",
        items: [
          {
            id: "test_item_1",
            title: "Test Product",
            price: 29.99,
            quantity: 1,
            image: "https://via.placeholder.com/150",
          },
        ],
        totalAmount: 29.99,
        address: {
          fullName: "Test User",
          street: "123 Test St",
          city: "Test City",
          state: "TS",
          zipCode: "12345",
          country: "Test Country",
          phone: "+1234567890",
        },
        paymentStatus: "completed",
        orderDate: new Date().toISOString(),
      };

      const orderId = await this.saveOrderToFirebase(testOrderData);
      console.log("Test order created:", orderId);
      return orderId;
    } catch (error) {
      console.error("Error creating test order:", error);
      throw error;
    }
  }
}
