
// import { createContext, useContext, useState } from "react";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState([]);

//   // Add product to cart
//   const addToCart = (gift) => {
//     setCart((prevCart) => {
//       const existingItem = prevCart.find(
//         (item) => item.id === gift.id
//       );

//       if (existingItem) {
//         return prevCart.map((item) =>
//           item.id === gift.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       }

//       return [...prevCart, { ...gift, quantity: 1 }];
//     });
//   };

//   // Total number of items in cart
//   const cartCount = cart.reduce(
//     (total, item) => total + item.quantity,
//     0
//   );

//   return (
//     <CartContext.Provider
//       value={{ cart, addToCart, cartCount }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);


import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Add product to cart
  const addToCart = (gift) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === gift.id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === gift.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...gift, quantity: 1 }];
    });
  };

  // Increase or decrease quantity
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Remove product
  const removeFromCart = (id) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.id !== id)
    );
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Total number of products
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Total cart price
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
