import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import { db } from "../../Components/Utility/Firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  FiCheckCircle,
  FiTruck,
  FiMail,
  FiHome,
  FiPackage,
} from "react-icons/fi";
import classes from "./OrderConfirmation.module.css";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [state] = useContext(DataContext);
  const { user } = state;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const fetchOrder = async () => {
      try {
        if (!orderId) {
          setError("No order ID provided");
          setLoading(false);
          return;
        }

        const orderDoc = await getDoc(doc(db, "orders", orderId));

        if (orderDoc.exists()) {
          const orderData = orderDoc.data();

          // Check if the order belongs to the current user
          if (orderData.userId !== user.uid) {
            setError("Order not found or access denied");
            setLoading(false);
            return;
          }

          setOrder({ id: orderDoc.id, ...orderData });
        } else {
          setError("Order not found");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, user, navigate]);

  if (loading) {
    return (
      <LayOut>
        <div className={classes.container}>
          <div className={classes.loading}>
            <div className={classes.spinner}></div>
            <p>Loading order details...</p>
          </div>
        </div>
      </LayOut>
    );
  }

  if (error) {
    return (
      <LayOut>
        <div className={classes.container}>
          <div className={classes.error}>
            <h2>Error</h2>
            <p>{error}</p>
            <Link to="/orders" className={classes.back_button}>
              View All Orders
            </Link>
          </div>
        </div>
      </LayOut>
    );
  }

  if (!order) {
    return (
      <LayOut>
        <div className={classes.container}>
          <div className={classes.error}>
            <h2>Order Not Found</h2>
            <p>The order you're looking for doesn't exist.</p>
            <Link to="/orders" className={classes.back_button}>
              View All Orders
            </Link>
          </div>
        </div>
      </LayOut>
    );
  }

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

  return (
    <LayOut>
      <div className={classes.container}>
        <div className={classes.header}>
          <FiCheckCircle className={classes.success_icon} />
          <h1>Order Confirmed!</h1>
          <p>
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>
        </div>

        <div className={classes.order_info}>
          <div className={classes.info_card}>
            <h3>Order Details</h3>
            <div className={classes.info_row}>
              <span>Order ID:</span>
              <span className={classes.order_id}>{order.id}</span>
            </div>
            <div className={classes.info_row}>
              <span>Order Date:</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className={classes.info_row}>
              <span>Status:</span>
              <span
                className={classes.status}
                style={{ color: getStatusColor(order.status) }}
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
            <div className={classes.info_row}>
              <span>Total Amount:</span>
              <span className={classes.total}>${order.amount.toFixed(2)}</span>
            </div>
          </div>

          <div className={classes.info_card}>
            <h3>Shipping Information</h3>
            {order.shipping ? (
              <>
                <div className={classes.shipping_address}>
                  <FiHome className={classes.icon} />
                  <div>
                    <p>{order.shipping.address}</p>
                    <p>
                      {order.shipping.city}, {order.shipping.state}{" "}
                      {order.shipping.zipCode}
                    </p>
                    <p>{order.shipping.country}</p>
                  </div>
                </div>
              </>
            ) : (
              <p>No shipping information available</p>
            )}
          </div>
        </div>

        <div className={classes.items_section}>
          <h3>Order Items</h3>
          <div className={classes.items_list}>
            {order.items?.map((item, index) => (
              <div key={`${item.id}-${index}`} className={classes.item}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={classes.item_image}
                />
                <div className={classes.item_details}>
                  <h4>{item.title}</h4>
                  <p>Quantity: {item.quantity || 1}</p>
                  <p>Price: ${item.price}</p>
                </div>
                <div className={classes.item_total}>
                  ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={classes.next_steps}>
          <h3>What's Next?</h3>
          <div className={classes.steps}>
            <div className={classes.step}>
              <FiMail className={classes.step_icon} />
              <div>
                <h4>Confirmation Email</h4>
                <p>We've sent a confirmation email to {order.userEmail}</p>
              </div>
            </div>
            <div className={classes.step}>
              <FiPackage className={classes.step_icon} />
              <div>
                <h4>Order Processing</h4>
                <p>Your order is being prepared for shipment</p>
              </div>
            </div>
            <div className={classes.step}>
              <FiTruck className={classes.step_icon} />
              <div>
                <h4>Shipping</h4>
                <p>You'll receive tracking information once your order ships</p>
              </div>
            </div>
          </div>
        </div>

        <div className={classes.actions}>
          <Link to="/orders" className={classes.primary_button}>
            View All Orders
          </Link>
          <Link to="/" className={classes.secondary_button}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </LayOut>
  );
};

export default OrderConfirmation;
