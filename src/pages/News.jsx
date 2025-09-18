import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import { FaCalendarAlt, FaUniversity, FaTimes } from "react-icons/fa";

const News = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Manage totalPages from backend
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("date:-1"); // Default: latest first
  const [loading, setLoading] = useState(false); // To show loading state
  const [error, setError] = useState(null); // To show error state
  const [selectedNews, setSelectedNews] = useState(null);

  const itemsPerPage = 3; // Frontend still defines this for the backend limit

  // Use useCallback to memoize the fetch function, preventing unnecessary re-renders
  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/news?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}&sort=${sortOrder}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNewsItems(data.news); // 'news' array is inside the data object from backend
      setTotalPages(data.totalPages); // Get totalPages from backend
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch news:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, sortOrder, itemsPerPage]); // Dependencies for useCallback

  useEffect(() => {
    fetchNews();
  }, [fetchNews]); // Rerun effect when fetchNews changes (due to its dependencies)

  // Handle pagination clicks
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle sort order change
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1); // Reset to first page on sort change
  };


  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <FaUniversity className="text-[#1C3AA9] text-5xl mx-auto mb-3" />
        <h1 className="text-5xl font-extrabold">
          <span className="text-[#0A174E]">University </span>
          <span className="text-[#1C3AA9]">News</span>
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Stay updated with the latest highlights and achievements from our campus
        </p>
      </div>

      {/* Search and Sort Bars */}
      <div className="mb-8 max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search news by title or content..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full md:w-2/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="w-full md:w-1/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="date:-1">Latest First</option>
          <option value="date:1">Oldest First</option>
          <option value="title:1">Title (A-Z)</option>
          <option value="title:-1">Title (Z-A)</option>
        </select>
      </div>

      {/* News Cards */}
      {loading ? (
        <p className="text-center text-gray-500 text-lg col-span-3">Loading news...</p>
      ) : error ? (
        <p className="text-center text-red-600 text-lg col-span-3">Error: {error}</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {newsItems.length === 0 ? (
            <p className="text-center text-gray-500 col-span-3">
              No news items match your criteria.
            </p>
          ) : (
            newsItems.map((news) => (
              <div
                key={news._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition cursor-pointer"
                onClick={() => setSelectedNews(news)}
              >
                <img
                  // Changed from news.image to news.imageURL
                  src={news.imageURL}
                  alt={news.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-5">
                  <div className="flex items-center text-sm text-orange-500 font-semibold mb-2">
                    <FaCalendarAlt className="mr-2" />
                    {new Date(news.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <h3 className="text-xl font-semibold text-[#1C3AA9] mb-2">
                    {news.title}
                  </h3>
                  {/* Display a summary (first 100-150 chars of content) */}
                  <p className="text-gray-700 text-sm">
                    {news.content.substring(0, 150)}{news.content.length > 150 ? '...' : ''}
                  </p>
                  <button
                    className="mt-4 text-sm text-white bg-[#1C3AA9] hover:bg-blue-900 px-4 py-2 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNews(news);
                    }}
                  >
                    Read More
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}


      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 space-x-3">
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)} // Use handlePageChange
                className={`px-4 py-2 rounded ${
                  currentPage === pageNum
                    ? "bg-blue-900 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      )}

      {/* Modal for full news content */}
      {selectedNews && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedNews(null)}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-3 right-3 text-gray-700 hover:text-red-600 text-3xl font-bold"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>

            <img
              src={selectedNews.imageURL} // Changed to news.imageURL
              alt={selectedNews.title}
              className="w-full h-64 object-cover rounded-t-lg"
            />

            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <FaCalendarAlt className="mr-2" />
                {new Date(selectedNews.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <h2 className="text-3xl font-bold text-blue-900 mb-4">
                {selectedNews.title}
              </h2>
              <p className="text-gray-800 whitespace-pre-line">
                {selectedNews.content} {/* Full content here */}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;