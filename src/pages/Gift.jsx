import {
  FiShoppingCart, 
  FiPlus,
} from "react-icons/fi";

import "../styles/gift.css";

const gifts = [
  {
    id: 1,
    name: "Netflix Gift Card",
    category: "Entertainment",
    price: 15000,
    image: "https://placehold.co/400x300/171717/ffffff?text=Netflix+Gift+Card",
  },
  {
    id: 2,
    name: "Steam Gift Card",
    category: "Gaming",
    price: 12000,
    image: "https://placehold.co/400x300/171717/ffffff?text=Steam+Gift+Card",
  },
  {
    id: 3,
    name: "Google Play Gift Card",
    category: "Digital Gift",
    price: 10000,
    image: "https://placehold.co/400x300/171717/ffffff?text=Google+Play",
  },
  {
    id: 4,
    name: "Apple Gift Card",
    category: "Digital Gift",
    price: 20000,
    image: "https://placehold.co/400x300/171717/ffffff?text=Apple+Gift+Card",
  },
  {
    id: 5,
    name: "Amazon Gift Card",
    category: "Shopping",
    price: 18000,
    image: "https://placehold.co/400x300/171717/ffffff?text=Amazon+Gift+Card",
  },
  {
    id: 6,
    name: "Spotify Gift Card",
    category: "Entertainment",
    price: 8000,
    image: "https://placehold.co/400x300/171717/ffffff?text=Spotify+Gift+Card",
  },
];

export default function Gift() {
  const addToCart = (gift) => {
    console.log("Added to cart:", gift);
    // Connect your cart functionality here
  };

  return (
    <div className="gift-page">

      <div className="gift-header">
        <div>
          <h1>
           Digital Gifts
          </h1>
          <p>
            Discover and send digital gift cards
            to friends and loved ones.
          </p>
        </div>

        <button className="gift-cart-button">
          <FiShoppingCart />
          <span>Cart</span>
        </button>
      </div>

      <div className="gift-section-header">
        <div>
          <h3>Available Gifts</h3>
          <p>Choose a gift you would love to send</p>
        </div>

        <span className="gift-count">
          {gifts.length} Products
        </span>
      </div>

      <div className="gift-grid">
        {gifts.map((gift) => (
          <div className="gift-card" key={gift.id}>

            <div className="gift-image">
              <img
                src={gift.image}
                alt={gift.name}
              />
            </div>

            <div className="gift-details">
              <span className="gift-category">
                {gift.category}
              </span>

              <h4>{gift.name}</h4>

              <div className="gift-card-bottom">
                <div className="gift-price">
                  <span>Price</span>
                  <h3>
                    ₦{gift.price.toLocaleString("en-NG")}
                  </h3>
                </div>

                <button
                  className="add-cart-button"
                  onClick={() => addToCart(gift)}
                >
                  <FiPlus />
                  Add
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
