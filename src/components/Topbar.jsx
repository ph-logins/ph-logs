import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaShoppingCart,
  FaWallet,
  FaBars,
  FaTimes,
  FaTrash,
  FaPlus,
  FaMinus,
} from "react-icons/fa";

import { useBalance } from "../context/BalanceContext";
import { useCart } from "../context/CartContext";

import "../styles/topbar.css";

const API_URL = process.env.REACT_APP_API_URL;

const Topbar = ({ setSidebarOpen }) => {
  const { balance } = useBalance();
  const navigate = useNavigate();
  const {
    cart,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [username, setUsername] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);

  const [displayBalance, setDisplayBalance] = useState(0);
  const previousBalance = useRef(0);

  // Fetch authenticated user's profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const { data } = await axios.get(
          `${API_URL}/api/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          setUsername(data.user.username);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  // Animate wallet balance
  useEffect(() => {
    const from = previousBalance.current;
    const to = Number(balance) || 0;
    const duration = 800;

    const start = performance.now();
    let animationFrame;

    const animate = (time) => {
      const progress = Math.min(
        (time - start) / duration,
        1
      );

      const value = Math.round(
        from + (to - from) * progress
      );

      setDisplayBalance(value);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        previousBalance.current = to;
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [balance]);

  // Close cart using Escape key
  useEffect(() => {
    if (!cartOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setCartOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [cartOpen]);

  const formattedBalance = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(displayBalance);

  const formatPrice = (price) =>
    `₦${price.toLocaleString("en-NG")}`;

  return (
    <>
      <header className="topbar">

        <div className="topbar-left">
          <button
            className="hamburger"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars />
          </button>

          <div className="welcome-text">
            <h1>
              {loadingProfile
                ? "Hi..."
                : `Hi ${username || "there"} 👋`}
            </h1>
          </div>
        </div>

        <div className="topbar-right">

          <div className="wallet-box">
            <div>
              <span>Wallet Balance</span>
              <h3>{formattedBalance}</h3>
            </div>

            <FaWallet />
          </div>

          {/* Cart Icon */}
          <button
            className="cart-icon-wrapper"
            onClick={() => setCartOpen(true)}
            aria-label={`Open cart, ${cartCount} items`}
          >
            <FaShoppingCart className="top-icon" />

            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

        </div>
      </header>

      {/* Cart Sidebar */}
      {cartOpen && (
        <div
          className="cart-overlay"
          onClick={() => setCartOpen(false)}
        >
          <aside
            className="cart-sidebar"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Cart Header */}
            <div className="cart-sidebar-header">
              <div>
                <h2>Your Cart</h2>
                <p>
                  {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
                </p>
              </div>

              <button
                className="cart-close"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                <FaTimes />
              </button>
            </div>

            {/* Cart Content */}
            <div className="cart-sidebar-content">

              {cart.length === 0 ? (
                <div className="cart-empty">
                  <FaShoppingCart />

                  <h3>Your cart is empty</h3>

                  <p>
                    Looks like you haven't added any gifts yet.
                  </p>

                  <button
                    onClick={() => setCartOpen(false)}
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="cart-items">

                    {cart.map((item) => (
                      <div
                        className="cart-item"
                        key={item.id}
                      >

                        <img
                          src={item.image}
                          alt={item.name}
                          className="cart-item-image"
                        />

                        <div className="cart-item-details">

                          <div className="cart-item-top">
                            <div>
                              <h4>{item.name}</h4>
                              <span>{item.category}</span>
                            </div>

                            <button
                              className="cart-remove"
                              onClick={() =>
                                removeFromCart(item.id)
                              }
                              aria-label={`Remove ${item.name}`}
                            >
                              <FaTrash />
                            </button>
                          </div>

                          <div className="cart-item-bottom">

                            <strong>
                              {formatPrice(item.price * item.quantity)}
                            </strong>

                            <div className="cart-quantity">

                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <FaMinus />
                              </button>

                              <span>{item.quantity}</span>

                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                                aria-label="Increase quantity"
                              >
                                <FaPlus />
                              </button>

                            </div>

                          </div>

                        </div>

                      </div>
                    ))}

                  </div>

                  <button
                    className="cart-clear"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </button>
                </>
              )}

            </div>

            {/* Cart Footer */}
            {cart.length > 0 && (
              <div className="cart-sidebar-footer">

                <div className="cart-subtotal">
                  <span>Subtotal</span>

                  <h3>{formatPrice(cartTotal)}</h3>
                </div>

                <p>
                  Delivery details and payment will be calculated
                  at checkout.
                </p>

                <button
  className="cart-checkout-button"
  onClick={() => {
    setCartOpen(false);
    navigate("/checkout");
  }}
>
  Proceed to Checkout
</button>

                <button
                  className="cart-continue"
                  onClick={() => setCartOpen(false)}
                >
                  Continue Shopping
                </button>

              </div>
            )}

          </aside>
        </div>
      )}
    </>
  );
};

export default Topbar;
