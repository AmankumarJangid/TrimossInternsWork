import React, { useState } from "react";
import { Heart, HeartOff } from "lucide-react";
import product1 from "../../assets/Images/product1.jpg";
import product2 from "../../assets/Images/product2.jpg";
import product3 from "../../assets/Images/product3.jpg";

const products = [
  {
    id: 1,
    title: "Blue Floral Mosaic Wall Piece",
    price: "₹1499",
    image: product1,
    category: "Mosaic Wall Art",
    color: "Blue",
  },
  {
    id: 2,
    title: "Geometric Table Top Mosaic",
    price: "₹1799",
    image: product2,
    category: "Table Tops",
    color: "Red",
  },
  {
    id: 3,
    title: "Abstract Ceramic Wall Decor",
    price: "₹999",
    image: product3,
    category: "Mosaic Wall Art",
    color: "Black",
  },
  {
    id: 4,
    title: "Multicolor Hanging Mosaic Lamp",
    price: "₹2299",
    image: product1,
    category: "Lamps",
    color: "Multi",
  },
  {
    id: 5,
    title: "Mini Round Table Decor",
    price: "₹899",
    image: product2,
    category: "Table Tops",
    color: "Blue",
  },
  {
    id: 6,
    title: "Mandala Wall Hanging",
    price: "₹1499",
    image: product3,
    category: "Mosaic Wall Art",
    color: "Red",
  },
];

export default function MosaicCollectionPage() {
  const [filters, setFilters] = useState({ category: [], color: [] });
  const [wishlist, setWishlist] = useState([]);
  const [sort, setSort] = useState("Best Match");

  const toggleFilter = (type, value) => {
    setFilters((prev) => {
      const isActive = prev[type].includes(value);
      return {
        ...prev,
        [type]: isActive
          ? prev[type].filter((item) => item !== value)
          : [...prev[type], value],
      };
    });
  };

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const applyFilters = () => {
    let filtered = [...products];

    if (filters.category.length > 0) {
      filtered = filtered.filter((p) => filters.category.includes(p.category));
    }

    if (filters.color.length > 0) {
      filtered = filtered.filter((p) => filters.color.includes(p.color));
    }

    if (sort === "Price: Low to High") {
      filtered.sort(
        (a, b) =>
          parseInt(a.price.replace("₹", "")) -
          parseInt(b.price.replace("₹", ""))
      );
    } else if (sort === "Price: High to Low") {
      filtered.sort(
        (a, b) =>
          parseInt(b.price.replace("₹", "")) -
          parseInt(a.price.replace("₹", ""))
      );
    }

    return filtered;
  };

  const filteredProducts = applyFilters();

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <div className="flex px-4 md:px-8 mt-6">
        <aside className="w-64 hidden lg:block pr-8 border-r">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>

          <div className="mb-4">
            <h3 className="font-medium mb-1">Category</h3>
            <ul className="space-y-1 text-sm">
              {["Mosaic Wall Art", "Table Tops", "Lamps"].map((cat) => (
                <li key={cat}>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(cat)}
                      onChange={() => toggleFilter("category", cat)}
                    />
                    <span>{cat}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-1">Color</h3>
            <ul className="space-y-1 text-sm">
              {["Blue", "Red", "Black", "Multi"].map((color) => (
                <li key={color}>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={filters.color.includes(color)}
                      onChange={() => toggleFilter("color", color)}
                    />
                    <span>{color}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <span>{filteredProducts.length} Items</span>
            <select
              className="border px-2 py-1 text-sm rounded"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option>Best Match</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-4 hover:shadow-md transition relative"
              >
                <button
                  className={`absolute top-4 right-4 rounded-full p-1 ${
                    wishlist.includes(product.id)
                      ? "text-red-600 bg-white"
                      : "text-white border border-white bg-transparent"
                  }`}
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Heart
                    fill={wishlist.includes(product.id) ? "red" : "white"}
                    className="w-5 h-5"
                  />
                </button>

                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-64 object-cover rounded mb-2"
                />
                <h3 className="text-md font-semibold">{product.title}</h3>
                <p className="text-sm text-gray-600">{product.price}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
