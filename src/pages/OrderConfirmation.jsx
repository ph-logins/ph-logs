
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiPackage,
  FiArrowRight,
  FiShoppingBag,
  FiCopy,
  FiMapPin,
  FiMail,
  FiUser,
  FiCreditCard,
  FiClock,
} from "react-icons/fi";

import "../styles/order-confirmation.css";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Order data should be passed after the backend confirms payment.
  const order = location.state?.order;

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));

  const copyOrderId = () => {
    if (order?.orderId) {
      navigator.clipboard.writeText(order.orderId);
    }
  };

  // Do not display a successful order if no confirmed order was supplied.
  if (!order || !order.orderId || order.paymentStatus !== "success") {
    return (
      <div className="order-confirmation-page">
        <div className="confirmation-empty">
          <FiPackage />
          <h2>No confirmed order found</h2>
          <p>
            Your order confirmation will appear here after your payment
            has been successfully processed.
          </p>
          <button onClick={() => navigate("/gift")}>
            Return to Gift Store
          </button>
        </div>
      </div>
    );
  }

  const items = order.items || (order.gift ? [order.gift] : []);
  const total = order.total ?? order.amount ?? 0;

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">

        {/* Success Header */}
        <div className="confirmation-success">
          <div className="confirmation-success-icon">
            <FiCheckCircle />
          </div>

          <span className="confirmation-status">
            Payment Successful
          </span>

          <h1>Your order has been placed!</h1>

          <p>
            Your payment was successful. We're processing your gift order
            and will keep you updated on its delivery.
          </p>
        </div>

        {/* Order Reference */}
        <div className="confirmation-order-reference">
          <div>
            <span>Order Reference</span>
            <strong>{order.orderId}</strong>
          </div>

          <button
            type="button"
            onClick={copyOrderId}
            title="Copy order reference"
          >
            <FiCopy />
            Copy
          </button>
        </div>

        {/* Order Details */}
        <div className="confirmation-content">

          <div className="confirmation-main">

            {/* Delivery Status */}
            <section className="confirmation-card">
              <div className="confirmation-card-heading">
                <FiPackage />
                <h3>Delivery Information</h3>
              </div>

              <div className="confirmation-delivery-status">
                <div className="confirmation-delivery-icon">
                  <FiClock />
                </div>

                <div>
                  <strong>
                    {order.deliveryStatus || "Processing"}
                  </strong>
                  <p>
                    Your order is being processed. Delivery updates will
                    be provided when available.
                  </p>
                </div>
              </div>
            </section>

            {/* Gift Details */}
            <section className="confirmation-card">
              <div className="confirmation-card-heading">
                <FiShoppingBag />
                <h3>Order Summary</h3>
              </div>

              <div className="confirmation-items">
                {items.map((item, index) => (
                  <div
                    className="confirmation-item"
                    key={item.id || item._id || index}
                  >
                    <div className="confirmation-item-image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <FiShoppingBag />
                      )}
                    </div>

                    <div className="confirmation-item-info">
                      <strong>{item.name}</strong>
                      <span>
                        Quantity: {item.quantity || 1}
                      </span>
                    </div>

                    <strong className="confirmation-item-price">
                      {formatPrice(
                        Number(item.price || 0) *
                        Number(item.quantity || 1)
                      )}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="confirmation-total">
                <span>Total Paid</span>
                <strong>{formatPrice(total)}</strong>
              </div>
            </section>

            {/* Recipient Details */}
            <section className="confirmation-card">
              <div className="confirmation-card-heading">
                <FiUser />
                <h3>Recipient Details</h3>
              </div>

              <div className="confirmation-recipient-details">
                <div>
                  <FiUser />
                  <span>{order.recipientName || "Not provided"}</span>
                </div>

                <div>
                  <FiMail />
                  <span>{order.recipientEmail || "Not provided"}</span>
                </div>

                <div>
                  <FiMapPin />
                  <span>
                    {order.recipientAddress || "Not provided"}
                  </span>
                </div>

                {order.message && (
                  <div className="confirmation-message">
                    <span>Gift Message</span>
                    <p>{order.message}</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Payment Details */}
          <aside className="confirmation-sidebar">
            <div className="confirmation-card">
              <div className="confirmation-card-heading">
                <FiCreditCard />
                <h3>Payment Details</h3>
              </div>

              <div className="confirmation-payment-row">
                <span>Payment Method</span>
                <strong>Main Wallet</strong>
              </div>

              <div className="confirmation-payment-row">
                <span>Payment Status</span>
                <strong className="confirmation-paid">
                  Successful
                </strong>
              </div>

              <div className="confirmation-payment-row">
                <span>Amount Paid</span>
                <strong>{formatPrice(total)}</strong>
              </div>

              {order.createdAt && (
                <div className="confirmation-payment-row">
                  <span>Order Date</span>
                  <strong>
                    {new Date(order.createdAt).toLocaleDateString(
                      "en-NG",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </strong>
                </div>
              )}

              <div className="confirmation-payment-note">
                <FiCheckCircle />
                <span>
                  Payment has been confirmed and deducted from your
                  main wallet.
                </span>
              </div>
            </div>
          </aside>
        </div>

        {/* Actions */}
        <div className="confirmation-actions">
          <button
            className="confirmation-primary-button"
            onClick={() =>
              navigate(`/gift/orders/${order.orderId}`)
            }
          >
            View Order Details
            <FiArrowRight />
          </button>

          <button
            className="confirmation-secondary-button"
            onClick={() => navigate("/gift")}
          >
            Continue Shopping
          </button>
        </div>

        <p className="confirmation-footer">
          Thank you for choosing Numio. We appreciate your order.
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
