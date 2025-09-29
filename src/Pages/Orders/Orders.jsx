import React, { useContext, useEffect, useState } from "react";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import { useAuth } from "../../Components/AuthProvider/AuthProvider";
import { Type } from "../../Utility/action.type";
import { PaymentService } from "../../Utility/paymentService";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import classes from "./Orders.module.css";

const Orders = () => {
  const [{ orders }, dispatch] = useContext(DataContext);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("Fetching orders for user:", user.uid);

        console.log("User ID for orders:", user.uid);
        const userOrders = await PaymentService.fetchUserOrders(user.uid);
        console.log("Received orders:", userOrders);
        console.log("Number of orders:", userOrders.length);

        dispatch({
          type: Type.SET_ORDERS,
          orders: userOrders,
        });
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return (
      <LayOut>
        <div className={classes.orders_container}>
          <h1>Your Orders</h1>
          <div className={classes.auth_required}>
            <h2>Please sign in to view your orders</h2>
            <p>You need to be signed in to see your order history.</p>
          </div>
        </div>
      </LayOut>
    );
  }

  if (loading) {
    return (
      <LayOut>
        <div className={classes.orders_container}>
          <h1>Your Orders</h1>
          <div className={classes.loading}>
            <p>Loading your orders...</p>
          </div>
        </div>
      </LayOut>
    );
  }

  if (error) {
    return (
      <LayOut>
        <div className={classes.orders_container}>
          <h1>Your Orders</h1>
          <div className={classes.error}>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className={classes.retry_button}
            >
              Try Again
            </button>
          </div>
        </div>
      </LayOut>
    );
  }

  const createTestOrder = async () => {
    try {
      console.log("Creating test order for user:", user.uid);
      await PaymentService.createTestOrder(user.uid);
      alert("Test order created! Refresh the page to see it.");
    } catch (error) {
      console.error("Error creating test order:", error);
      alert("Failed to create test order. Check console for details.");
    }
  };

  return (
    <LayOut>
      <div className={classes.orders_container}>
        <h1>Your Orders</h1>

        {/* Debug button - remove in production */}
        <div
          style={{
            marginBottom: "20px",
            padding: "10px",
            background: "#f0f0f0",
            borderRadius: "4px",
          }}
        >
          <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "#666" }}>
            Debug: Create a test order to verify the system is working
          </p>
          <button
            onClick={createTestOrder}
            style={{
              background: "#007bff",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Create Test Order
          </button>
        </div>

        {orders.length === 0 ? (
          <div className={classes.no_orders}>
            <h2>No orders yet</h2>
            <p>
              You haven't placed any orders yet. Start shopping to see your
              orders here!
            </p>
          </div>
        ) : (
          <div className={classes.orders_list}>
            {orders.map((order) => (
              <div key={order.id} className={classes.order_card}>
                <div className={classes.order_header}>
                  <div className={classes.order_info}>
                    <h3>Order #{order.id.slice(-8)}</h3>
                    <p className={classes.order_date}>
                      {formatDate(
                        order.orderDate ||
                          order.createdAt?.toDate?.() ||
                          new Date()
                      )}
                    </p>
                  </div>
                  <div className={classes.order_status}>
                    <span className={classes.status_badge}>
                      {order.status || "Completed"}
                    </span>
                    <p className={classes.total_amount}>
                      Total: <CurrencyFormat amount={order.totalAmount} />
                    </p>
                  </div>
                </div>

                <div className={classes.order_items}>
                  <h4>Items ({order.items?.length || 0})</h4>
                  <div className={classes.items_list}>
                    {order.items?.map((item) => (
                      <div key={item.id} className={classes.order_item}>
                        <img
                          src={item.image}
                          alt={item.title}
                          className={classes.item_image}
                        />
                        <div className={classes.item_details}>
                          <h5>{item.title}</h5>
                          <p>Quantity: {item.quantity || 1}</p>
                          <p>
                            Price: <CurrencyFormat amount={item.price} />
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {order.address && (
                  <div className={classes.shipping_address}>
                    <h4>Shipping Address</h4>
                    <div className={classes.address_details}>
                      <p>
                        <strong>{order.address.fullName}</strong>
                      </p>
                      <p>{order.address.street}</p>
                      <p>
                        {order.address.city}, {order.address.state}{" "}
                        {order.address.zipCode}
                      </p>
                      <p>{order.address.country}</p>
                      {order.address.phone && (
                        <p>Phone: {order.address.phone}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </LayOut>
  );
};

export default Orders;
