"use client";

import { useState } from "react";

const allTags = [
  "cold",
  "nature",
  "hiking",
  "history",
  "culture",
  "walking",
  "animals",
  "adventure",
  "photography",
  "beach",
  "surfing",
  "young-vibe",
  "climbing",
  "view",
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [results, setResults] = useState<{ id: number; reason: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTagChange = (tag: string, checked: boolean) => {
    if (checked) {
      setSelectedTags([...selectedTags, tag]);
    } else {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, minPrice, maxPrice, selectedTags }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResults(data.results);
      }
    } catch (err) {
      setError("Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-2">
          Smart Travel Scout
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Discover travel experiences tailored to your preferences
        </p>

        {/* Query Section */}
        <div className="mb-6">
          <label className="block font-medium mb-2">
            Travel Idea
          </label>
          <input
            type="text"
            placeholder="e.g. beach surfing weekend, cold hiking adventure..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-400 mt-1">
            Describe what kind of trip you're looking for.
          </p>
        </div>

        {/* Price Section */}
        <div className="mb-6">
          <label className="block font-medium mb-3">
            Price Range
          </label>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Minimum Price ($)
              </label>
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                placeholder="0"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Maximum Price ($)
              </label>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                placeholder="1000"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="mb-6">
          <label className="block font-medium mb-3">
            Preferences (Tags)
          </label>

          <div className="flex flex-wrap gap-3">
            {allTags.map((tag) => (
              <label
                key={tag}
                className={`px-4 py-2 border rounded-full cursor-pointer text-sm transition
                ${
                  selectedTags.includes(tag)
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={(e) => handleTagChange(tag, e.target.checked)}
                  className="hidden"
                />
                {tag}
              </label>
            ))}
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Searching..." : "Find Experiences"}
        </button>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Results */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Results
          </h2>

          {results.length === 0 && !loading && (
            <p className="text-gray-400">
              No results yet. Try searching above.
            </p>
          )}

          <div className="space-y-4">
            {results.map((r) => (
              <div
                key={r.id}
                className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
              >
                <p className="font-semibold mb-1">
                  Experience ID: {r.id}
                </p>
                <p className="text-gray-700 text-sm">
                  {r.reason}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}