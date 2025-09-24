import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import { db } from "../../Components/Utility/Firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { FiCheckCircle, FiPackage, FiTruck, FiCalendar } from "react-icons/fi";

function Orders() {
  const [state] = useContext(DataContext);
  const { user } = state;
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    // Check for success message from payment
    if (location.state?.msg) {
      setSuccessMessage(location.state.msg);
      // Clear the message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    }

    // Fetch user's orders
    const fetchOrders = async () => {
      if (!user) return;

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
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, location.state]);

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

  return (
    <LayOut>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
        <h1>Your Orders</h1>

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

                {order.shipping && (
                  <div style={{ color: "#666", fontSize: "14px" }}>
                    <strong>Shipping to:</strong> {order.shipping.address},{" "}
                    {order.shipping.city}, {order.shipping.state}{" "}
                    {order.shipping.zipCode}
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
