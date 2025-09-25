import React, { useContext, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import { db } from "../../Components/Utility/Firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { FiCheckCircle, FiPackage, FiTruck, FiCalendar } from "react-icons/fi";

function Orders() {
  const [state] = useContext(DataContext);
  const { user } = state;
  const location = useLocation();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const hasLoadedFromLocalStorage = useRef(false);

  // Load orders from localStorage on component mount
  useEffect(() => {
    const savedOrders = localStorage.getItem("userOrders");
    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        setOrders(parsedOrders);
        hasLoadedFromLocalStorage.current = true;
      } catch (error) {
        console.error("Error parsing saved orders:", error);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save orders to localStorage whenever orders change (but not on initial load)
  useEffect(() => {
    if (isInitialized && orders.length > 0) {
      localStorage.setItem("userOrders", JSON.stringify(orders));
    }
  }, [orders, isInitialized]);

  // Force refresh when location.state changes (new payment)
  useEffect(() => {
    if (location.state?.orderData && isInitialized) {
      // This will trigger the main useEffect to handle the new order
      console.log("New order data received:", location.state.orderData);
    }
  }, [location.state?.orderData, isInitialized]);

  // Set loading to false when we have orders from localStorage
  useEffect(() => {
    if (isInitialized && hasLoadedFromLocalStorage.current && loading) {
      setLoading(false);
    }
  }, [isInitialized, loading]);

  useEffect(() => {
    // Only run after initialization
    if (!isInitialized) return;

    // Check for success message from payment
    if (location.state?.msg) {
      setSuccessMessage(location.state.msg);
      // Clear the message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    }

    // Handle order data from payment navigation
    if (location.state?.orderData) {
      const newOrder = {
        id: `order_${Date.now()}`,
        items: location.state.orderData.items,
        amount: location.state.orderData.total,
        status: "confirmed",
        createdAt: new Date(location.state.orderData.timestamp),
        cardInfo: location.state.orderData.cardInfo,
        paymentIntentId: location.state.orderData.paymentIntentId,
      };

      // Add the new order to the existing orders
      setOrders((prevOrders) => {
        // Check if this order already exists to prevent duplicates
        const orderExists = prevOrders.some(
          (order) =>
            order.paymentIntentId === newOrder.paymentIntentId ||
            (order.items.length === newOrder.items.length &&
              order.items.every(
                (item, index) =>
                  item.id === newOrder.items[index]?.id &&
                  item.quantity === newOrder.items[index]?.quantity
              ))
        );

        if (orderExists) {
          return prevOrders;
        }

        return [newOrder, ...prevOrders];
      });
      setLoading(false);

      // Clear the navigation state to prevent duplicate orders on refresh
      navigate("/orders", {
        replace: true,
        state: { msg: location.state.msg },
      });
      return;
    }

    // If we already loaded from localStorage, don't fetch from Firestore
    if (hasLoadedFromLocalStorage.current) {
      setLoading(false);
      return;
    }

    // Fetch user's orders from Firestore (only if no localStorage orders)
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(ordersQuery);
        const userOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        // If Firestore fails, just show empty orders
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, location.state, navigate, isInitialized]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "#28a745";
      case "shipped":
        return "#007bff";
      case "delivered":
        return "#6f42c1";
      case "cancelled":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  if (loading) {
    return (
      <LayOut>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div>Loading your orders...</div>
        </div>
      </LayOut>
    );
  }

  const refreshOrders = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Refresh Orders button clicked!");

    // Instant refresh from localStorage
    const savedOrders = localStorage.getItem("userOrders");
    console.log("Saved orders from localStorage:", savedOrders);

    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders);
        console.log("Parsed orders:", parsedOrders);
        console.log("Setting orders to:", parsedOrders);
        setOrders(parsedOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error parsing saved orders:", error);
        setOrders([]);
        setLoading(false);
      }
    } else {
      console.log("No saved orders found in localStorage");
      setOrders([]);
      setLoading(false);
    }
  };

  const clearAllOrders = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Clear All Orders button clicked!");
    if (
      window.confirm(
        "Are you sure you want to clear all orders? This action cannot be undone."
      )
    ) {
      localStorage.removeItem("userOrders");
      setOrders([]);
      console.log("All orders cleared");
    }
  };

  return (
    <LayOut>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h1>Your Orders</h1>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={(e) => clearAllOrders(e)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "bold",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#c82333";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#dc3545";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Clear All Orders
            </button>
            <button
              type="button"
              onClick={(e) => refreshOrders(e)}
              disabled={isRefreshing}
              style={{
                padding: "10px 20px",
                backgroundColor: isRefreshing ? "#6c757d" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isRefreshing ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "bold",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                opacity: isRefreshing ? 0.7 : 1,
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                if (!isRefreshing) {
                  e.target.style.backgroundColor = "#0056b3";
                  e.target.style.transform = "translateY(-1px)";
                }
              }}
              onMouseOut={(e) => {
                if (!isRefreshing) {
                  e.target.style.backgroundColor = "#007bff";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            >
              {isRefreshing ? "Refreshing..." : "Refresh Orders"}
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div
            style={{
              background: "#d4edda",
              color: "#155724",
              border: "1px solid #c3e6cb",
              borderRadius: "4px",
              padding: "15px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <FiCheckCircle style={{ fontSize: "20px" }} />
            {successMessage}
          </div>
        )}

        {orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <FiPackage
              style={{ fontSize: "64px", color: "#ccc", marginBottom: "20px" }}
            />
            <h3>No orders yet</h3>
            <p>
              You haven't placed any orders yet. Start shopping to see your
              orders here!
            </p>
          </div>
        ) : (
          <div>
            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  background: "white",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "20px",
                  marginBottom: "20px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "15px",
                  }}
                >
                  <div>
                    <h3>Order #{order.id.slice(-8)}</h3>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        color: "#666",
                      }}
                    >
                      <FiCalendar style={{ fontSize: "16px" }} />
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#28a745",
                      }}
                    >
                      ${order.amount?.toFixed(2)}
                    </div>
                    <div
                      style={{
                        color: getStatusColor(order.status),
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {order.status}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <strong>Items ({order.items?.length || 0}):</strong>
                  <div style={{ marginTop: "10px" }}>
                    {order.items?.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "5px",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{
                            width: "40px",
                            height: "40px",
                            objectFit: "contain",
                          }}
                        />
                        <span>{item.title}</span>
                        <span style={{ color: "#666" }}>
                          x{item.quantity || 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.cardInfo && (
                  <div
                    style={{
                      color: "#666",
                      fontSize: "14px",
                      marginTop: "10px",
                    }}
                  >
                    <strong>Payment:</strong> Card ending in{" "}
                    {order.cardInfo.last4}
                    {order.cardInfo.expDate &&
                      ` (Exp: ${order.cardInfo.expDate})`}
                  </div>
                )}

                {order.paymentIntentId && (
                  <div
                    style={{
                      color: "#666",
                      fontSize: "12px",
                      marginTop: "5px",
                    }}
                  >
                    <strong>Transaction ID:</strong> {order.paymentIntentId}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </LayOut>
  );
}

export default Orders;
