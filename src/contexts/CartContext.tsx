"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface CartContextType {
  cartItemsCount: number;
  refreshCartCount: () => Promise<void>;
  incrementCartCount: () => void;
  decrementCartCount: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItemsCount, setCartItemsCount] = useState(0);

  const refreshCartCount = async () => {
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setCartItemsCount(data?.cartItems?.length ?? 0);
    } catch (err) {
      console.error("Cart refresh failed", err);
    }
  };

  const incrementCartCount = () =>
    setCartItemsCount((prev) => prev + 1);

  const decrementCartCount = () =>
    setCartItemsCount((prev) => Math.max(0, prev - 1));

  useEffect(() => {
    refreshCartCount();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItemsCount,
        refreshCartCount,
        incrementCartCount,
        decrementCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
