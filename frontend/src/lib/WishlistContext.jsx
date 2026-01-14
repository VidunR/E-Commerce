import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!token) return setWishlist([]);

    fetch("/api/wishlist", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setWishlist(data.wishlist || []))
      .catch(() => setWishlist([]));
  }, [token]);

  async function addToWishlist(productId) {
    await fetch(`/api/wishlist/${productId}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    // Refetch wishlist to get full product data
    const res = await fetch("/api/wishlist", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setWishlist(data.wishlist || []);
  }

  async function removeFromWishlist(productId) {
    await fetch(`/api/wishlist/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setWishlist(prev => prev.filter(w => w.id !== productId));
  }

  function isInWishlist(productId) {
    return wishlist.some(w => w.id === productId);
  }

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
