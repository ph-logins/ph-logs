
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiCheckCircle,
  FiCreditCard,
  FiGift,
  FiMail,
  FiMessageSquare,
  FiShield,
  FiUser,
  FiWallet,
} from "react-icons/fi";

import { useCart } from "../context/CartContext";
import { useBalance } from "../context/BalanceContext";

import "../styles/checkout.css";

const Checkout = () => {
  const navigate = useNavigate();

  const { cart, cartCount, cartTotal } = useCart();
  const { balance } = useBalance();

  const [formData, setFormData] = useState({
    senderEmail: "",
    recipientName: "",
    recipientEmail: "",
    message: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "Checkout - Numio";
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(price);

  const walletBalance = Number(balance) || 0;

  const deliveryFee = 0;
  const total = cartTotal + deliveryFee;

  const sufficientBalance = walletBalance >= total;

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

    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    if (
      paymentMethod === "wallet" &&
      !sufficientBalance
    ) {
      setError("Insufficient wallet balance. Please fund your wallet.");
      return;
    }

    setSubmitting(true);

    try {
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
        paymentMethod,
        subtotal: cartTotal,
        deliveryFee,
        total,
      };

      // Connect this payload to your backend order API.
      console.log("Checkout order:", orderDetails);

      setError(
        "Checkout details are ready. Payment processing has not been connected yet."
      );
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <FiGift />

          <h2>Your cart is empty</h2>

          <p>
            You haven't added any gifts to your cart yet.
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

      {/* Page Header */}
      <div className="checkout-header">
        <button
          className="checkout-back"
          onClick={() => navigate("/gift")}
        >
          <FiArrowLeft />
          Continue Shopping
        </button>

        <div>
          <h1>Checkout</h1>
          <p>Complete your gift order securely.</p>
        </div>
      </div>

      <div className="checkout-layout">

        {/* Checkout Form */}
        <form
          className="checkout-form"
          onSubmit={handleSubmit}
        >

          {/* Recipient Information */}
          <section className="checkout-section">

            <div className="checkout-section-title">
              <div className="checkout-section-icon">
                <FiGift />
              </div>

              <div>
                <h3>Gift Recipient</h3>
                <p>Who are you sending this gift to?</p>
              </div>
            </div>

            <div className="checkout-input-group">
              <label>Recipient's Full Name</label>

              <div className="checkout-input-wrapper">
                <FiUser />

                <input
                  type="text"
                  name="recipientName"
                  placeholder="Enter recipient's name"
                  value={formData.recipientName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="checkout-input-group">
              <label>Recipient's Email Address</label>

              <div className="checkout-input-wrapper">
                <FiMail />

                <input
                  type="email"
                  name="recipientEmail"
                  placeholder="recipient@example.com"
                  value={formData.recipientEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              <small>
                Digital gift delivery will be sent to this email.
              </small>
            </div>

          </section>

          {/* Sender Information */}
          <section className="checkout-section">

            <div className="checkout-section-title">
              <div className="checkout-section-icon">
                <FiUser />
              </div>

              <div>
                <h3>Sender Information</h3>
                <p>Your contact information.</p>
              </div>
            </div>

            <div className="checkout-input-group">
              <label>Your Email Address</label>

              <div className="checkout-input-wrapper">
                <FiMail />

                <input
                  type="email"
                  name="senderEmail"
                  placeholder="your@email.com"
                  value={formData.senderEmail}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

          </section>

          {/* Gift Message */}
          <section className="checkout-section">

            <div className="checkout-section-title">
              <div className="checkout-section-icon">
                <FiMessageSquare />
              </div>

              <div>
                <h3>Gift Message</h3>
                <p>Add a personal message to your gift.</p>
              </div>
            </div>

            <div className="checkout-input-group">
              <label>Personal Message (Optional)</label>

              <textarea
                name="message"
                placeholder="Write something special..."
                value={formData.message}
                onChange={handleChange}
                rows={4}
                maxLength={300}
              />

              <small>
                {formData.message.length}/300 characters
              </small>
            </div>

          </section>

          {/* Payment Method */}
          <section className="checkout-section">

            <div className="checkout-section-title">
              <div className="checkout-section-icon">
                <FiCreditCard />
              </div>

              <div>
                <h3>Payment Method</h3>
                <p>Select how you want to pay.</p>
              </div>
            </div>

            <label className={`payment-option ${
              paymentMethod === "wallet" ? "selected" : ""
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="wallet"
                checked={paymentMethod === "wallet"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />

              <FiWallet className="payment-option-icon" />

              <div>
                <h4>Pay with Wallet</h4>
                <p>
                  Available balance: {formatPrice(walletBalance)}
                </p>
              </div>

              <FiCheckCircle className="payment-check" />
            </label>

            {!sufficientBalance && paymentMethod === "wallet" && (
              <div className="insufficient-balance">
                Insufficient balance. You need {formatPrice(total - walletBalance)} more.
                <Link to="/fund-wallet">Fund Wallet</Link>
              </div>
            )}

          </section>

          {error && (
            <div className="checkout-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="place-order-button"
            disabled={submitting || !sufficientBalance}
          >
            <FiShield />
            {submitting ? "Processing..." : `Place Order · ${formatPrice(total)}`}
          </button>

          <p className="checkout-secure-note">
            <FiShield />
            Your checkout information is handled securely.
          </p>

        </form>

        {/* Order Summary */}
        <aside className="checkout-summary">

          <div className="checkout-summary-header">
            <h3>Order Summary</h3>

            <span>{cartCount} Items</span>
          </div>

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

                <div className="checkout-summary-details">
                  <h4>{item.name}</h4>

                  <span>
                    Quantity: {item.quantity}
                  </span>

                  <strong>
                    {formatPrice(item.price * item.quantity)}
                  </strong>
                </div>

              </div>
            ))}

          </div>

          <div className="checkout-summary-divider" />

          <div className="checkout-price-row">
            <span>Subtotal</span>
            <strong>{formatPrice(cartTotal)}</strong>
          </div>

          <div className="checkout-price-row">
            <span>Delivery Fee</span>
            <strong className="free-delivery">FREE</strong>
          </div>

          <div className="checkout-summary-divider" />

          <div className="checkout-total">
            <span>Total</span>
            <h2>{formatPrice(total)}</h2>
          </div>

          <div className="checkout-delivery-note">
            <FiGift />

            <p>
              Digital gifts are delivered electronically
              to the recipient's email address.
            </p>
          </div>

        </aside>

      </div>
    </div>
  );
};

export default Checkout;
