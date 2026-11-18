
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiCreditCard,
  FiGift,
  FiMail,
  FiMessageSquare,
  FiShield,
  FiUser,
  FiAlertCircle,
} from "react-icons/fi";

import { useCart } from "../context/CartContext";
import { useBalance } from "../context/BalanceContext";

import "../styles/checkout.css";

const Checkout = () => {
  const {
    cart,
    cartCount,
    cartTotal,
  } = useCart();

  const {
    balance,
    formattedBalance,
    loadingBalance,
  } = useBalance();

  const [formData, setFormData] = useState({
    senderEmail: "",
    recipientName: "",
    recipientEmail: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const deliveryFee = 0;
  const total = cartTotal + deliveryFee;

  const walletBalance = Number(balance) || 0;
  const sufficientBalance = walletBalance >= total;

  const formatPrice = (amount) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    if (
      !formData.senderEmail ||
      !formData.recipientName ||
      !formData.recipientEmail
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (loadingBalance) {
      setError("Please wait while your wallet balance loads.");
      return;
    }

    if (!sufficientBalance) {
      setError(
        "Insufficient main wallet balance. Please fund your wallet to continue."
      );
      return;
    }

    setLoading(true);

    try {
      // Backend payment integration will be connected here.
      // The backend must verify prices and balance before deducting funds.

      const orderDetails = {
        items: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),

        senderEmail: formData.senderEmail,
        recipientName: formData.recipientName,
        recipientEmail: formData.recipientEmail,
        message: formData.message,

        paymentMethod: "main_balance",

        subtotal: cartTotal,
        deliveryFee,
        total,
      };

      console.log("Checkout order:", orderDetails);

      setError(
        "Payment processing is not connected yet. Your wallet has not been charged."
      );
    } catch (err) {
      console.error("Checkout error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to process your order."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <FiGift size={42} />

          <h2>Your cart is empty</h2>

          <p>
            Add some gifts before proceeding to checkout.
          </p>

          <Link to="/gift" className="checkout-back-button">
            Explore Gifts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        <Link to="/gift" className="checkout-back-link">
          <FiArrowLeft />
          Continue Shopping
        </Link>

        <div className="checkout-heading">
          <div>
            <h1>Checkout</h1>
            <p>Complete your gift order securely.</p>
          </div>

          <div className="checkout-secure">
            <FiShield />
            Secure Checkout
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="checkout-layout">

            <div className="checkout-main">

              {/* Recipient Information */}
              <section className="checkout-section">
                <div className="checkout-section-heading">
                  <div className="checkout-heading-icon">
                    <FiUser />
                  </div>

                  <div>
                    <h2>Recipient Information</h2>
                    <p>
                      Enter the details of the gift recipient.
                    </p>
                  </div>
                </div>

                <div className="checkout-form-grid">

                  <div className="checkout-field">
                    <label>Sender Email</label>

                    <div className="checkout-input-wrapper">
                      <FiMail />

                      <input
                        type="email"
                        name="senderEmail"
                        placeholder="Your email address"
                        value={formData.senderEmail}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="checkout-field">
                    <label>Recipient Full Name</label>

                    <div className="checkout-input-wrapper">
                      <FiUser />

                      <input
                        type="text"
                        name="recipientName"
                        placeholder="Recipient's full name"
                        value={formData.recipientName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="checkout-field checkout-full-width">
                    <label>Recipient Email</label>

                    <div className="checkout-input-wrapper">
                      <FiMail />

                      <input
                        type="email"
                        name="recipientEmail"
                        placeholder="Recipient's email address"
                        value={formData.recipientEmail}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="checkout-field checkout-full-width">
                    <label>Gift Message (Optional)</label>

                    <div className="checkout-input-wrapper checkout-textarea-wrapper">
                      <FiMessageSquare />

                      <textarea
                        name="message"
                        placeholder="Write a message for the recipient..."
                        value={formData.message}
                        onChange={handleChange}
                        maxLength={300}
                        rows={4}
                      />
                    </div>

                    <small>
                      {formData.message.length}/300 characters
                    </small>
                  </div>

                </div>
              </section>

              {/* Payment Method */}
              <section className="checkout-section">
                <div className="checkout-section-heading">
                  <div className="checkout-heading-icon">
                    <FiCreditCard />
                  </div>

                  <div>
                    <h2>Payment Method</h2>
                    <p>
                      Pay directly from your Numio main balance.
                    </p>
                  </div>
                </div>

                <div className="checkout-payment-option selected">

                  <div className="checkout-payment-icon">
                    <FiCreditCard />
                  </div>

                  <div className="checkout-payment-info">
                    <h3>Main Wallet Balance</h3>

                    <p>
                      Available balance:{" "}
                      {loadingBalance
                        ? "Loading..."
                        : formattedBalance}
                    </p>
                  </div>

                  <FiCheckCircle className="checkout-payment-check" />

                </div>

                {!loadingBalance && !sufficientBalance && (
                  <div className="checkout-warning">
                    <FiAlertCircle />

                    <span>
                      Your wallet balance is insufficient for this order.
                    </span>
                  </div>
                )}

                <div className="checkout-wallet-note">
                  <FiShield />

                  <span>
                    Your payment will be deducted from your main wallet
                    balance once payment processing is connected.
                  </span>
                </div>
              </section>

            </div>

            {/* Order Summary */}
            <aside className="checkout-summary">
              <h2>Order Summary</h2>

              <p className="checkout-item-count">
                {cartCount} item{cartCount !== 1 ? "s" : ""} in your cart
              </p>

              <div className="checkout-summary-items">

                {cart.map((item) => (
                  <div
                    className="checkout-summary-item"
                    key={item.id}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    <div className="checkout-summary-item-info">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>

                    <strong>
                      {formatPrice(item.price * item.quantity)}
                    </strong>
                  </div>
                ))}

              </div>

              <div className="checkout-summary-divider" />

              <div className="checkout-summary-row">
                <span>Subtotal</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>

              <div className="checkout-summary-row">
                <span>Delivery Fee</span>
                <strong className="checkout-free">Free</strong>
              </div>

              <div className="checkout-summary-divider" />

              <div className="checkout-summary-row checkout-total">
                <span>Total</span>
                <strong>{formatPrice(total)}</strong>
              </div>

              <div className="checkout-balance-info">
                <span>Main Wallet Balance</span>

                <strong>
                  {loadingBalance ? "Loading..." : formattedBalance}
                </strong>
              </div>

              <div className="checkout-balance-info">
                <span>Balance After Payment</span>

                <strong
                  className={
                    sufficientBalance
                      ? ""
                      : "checkout-insufficient"
                  }
                >
                  {loadingBalance
                    ? "Loading..."
                    : formatPrice(
                        Math.max(0, walletBalance - total)
                      )}
                </strong>
              </div>

              {error && (
                <div className="checkout-error">
                  <FiAlertCircle />
                  {error}
                </div>
              )}

              {success && (
                <div className="checkout-success">
                  <FiCheckCircle />
                  {success}
                </div>
              )}

              <button
                type="submit"
                className="checkout-place-order"
                disabled={
                  loading ||
                  loadingBalance ||
                  !sufficientBalance
                }
              >
                {loading
                  ? "Processing..."
                  : `Pay ${formatPrice(total)}`}
              </button>

              <p className="checkout-terms">
                By placing your order, you agree to our terms and
                conditions.
              </p>

            </aside>

          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
