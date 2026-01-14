import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [cart, setCart] = useState([]);

  const formatCartItem = (item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.product?.name || "",
    price: item.price || item.product?.price || 0,
    quantity: item.quantity,
    productImage: item.product?.images?.[0]?.url || "",
    variantColor: item.variantColor || ""
  });

  useEffect(() => {
    if (!token) {
      const saved = localStorage.getItem("luxuryWalletCart");
      if (saved) setCart(JSON.parse(saved));
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      localStorage.setItem("luxuryWalletCart", JSON.stringify(cart));
    }
  }, [cart, token]);

  useEffect(() => {
    const loadServerCart = async () => {
      if (!token) return;

      try {
        const res = await fetch("/api/cart", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          setCart([]);
          return;
        }

        const data = await res.json();
        setCart((data.items || []).map(formatCartItem));
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    };

    loadServerCart();
  }, [token]);

  const refreshServerCart = async () => {
    const res = await fetch("/api/cart", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setCart((data.items || []).map(formatCartItem));
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      if (token) {
        const res = await fetch("/api/cart/items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            productId: Number(productId),
            quantity: Number(quantity)
          })
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to add item");
        }

        await refreshServerCart();
        return await res.json();
      }

      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) throw new Error("Product not found");
      
      const { product } = await res.json();
      const newItem = {
        id: `local-${Date.now()}-${productId}`,
        productId: Number(productId),
        productName: product.name,
        price: product.price,
        quantity: Number(quantity),
        productImage: product.images?.[0]?.url || "",
        variantColor: ""
      };

      setCart(prev => {
        const existing = prev.find(i => i.productId === Number(productId));
        if (existing) {
          return prev.map(i => 
            i.productId === Number(productId) 
              ? { ...i, quantity: i.quantity + Number(quantity) } 
              : i
          );
        }
        return [...prev, newItem];
      });

      return newItem;
    } catch (err) {
      console.error("Failed to add to cart:", err);
      throw err;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (token) {
        const res = await fetch(`/api/cart/items/${itemId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ quantity: Number(quantity) })
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to update item");
        }

        await refreshServerCart();
        return await res.json();
      }

      if (quantity <= 0) {
        setCart(prev => prev.filter(i => i.id !== itemId));
        return { removed: true };
      }

      setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity } : i));
      return { ok: true };
    } catch (err) {
      console.error("Failed to update quantity:", err);
      throw err;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      if (token) {
        const res = await fetch(`/api/cart/items/${itemId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Failed to remove item");
        }

        await refreshServerCart();
        return { ok: true };
      }

      setCart(prev => prev.filter(i => i.id !== itemId));
      return { ok: true };
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      if (token) {
        await fetch("/api/cart", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => {});
      }
      setCart([]);
    } catch (err) {
      console.error("Failed to clear cart:", err);
      throw err;
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const cartTotal = cart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
