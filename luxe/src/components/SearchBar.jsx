import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const load = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${query}`);
        const data = await res.json();
        setSuggestions(data.results || []);
      } catch (err) {
        console.error("Search error:", err);
        setSuggestions([]);
      }
    }, 200);

    return () => clearTimeout(load);
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${query}`);
    setSuggestions([]);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search wallets..."
            className="w-full pl-10 pr-4 py-2 border rounded-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </form>

      {suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-20">
          {suggestions.map((s) => (
            <button
              key={s.id}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-3"
              onClick={() => {
                navigate(`/product/${s.id}`);
                setSuggestions([]);
                setQuery("");
              }}
            >
              <img
                src={s.image}
                className="w-10 h-10 object-cover rounded"
                alt={s.name}
              />
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-gray-500">${s.price}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
