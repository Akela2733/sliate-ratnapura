import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import { FaCalendarAlt, FaUniversity, FaTimes } from "react-icons/fa";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Manage totalPages from backend
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("upcoming"); // Default filter: upcoming
  const [sortOrder, setSortOrder] = useState("date:1"); // Default sort: oldest first (for upcoming)
  const [loading, setLoading] = useState(false); // To show loading state
  const [error, setError] = useState(null); // To show error state
  const [selectedEvent, setSelectedEvent] = useState(null);

  const itemsPerPage = 3; // Frontend still defines this for the backend limit

  // Use useCallback to memoize the fetch function, preventing unnecessary re-renders
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/events?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}&filter=${filterType}&sort=${sortOrder}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEvents(data.events); // 'events' array is inside the data object from backend
      setTotalPages(data.totalPages); // Get totalPages from backend
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterType, sortOrder, itemsPerPage]); // Dependencies for useCallback

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]); // Rerun effect when fetchEvents changes (due to its dependencies)

  // Handle pagination clicks
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle filter change (Upcoming/Past)
  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
    // Adjust default sort based on filter if needed, e.g., latest for past events
    setSortOrder(e.target.value === 'past' ? 'date:-1' : 'date:1');
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
          <span className="text-[#1C3AA9]">Events</span>
        </h1>
        <p className="text-gray-600 mt-3 text-lg">
          Explore upcoming events happening around campus
        </p>
      </div>

      {/* Search, Filter, and Sort Bars */}
      <div className="mb-8 max-w-4xl mx-auto flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search events by title, description or location..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full md:w-1/2 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <select
          value={filterType}
          onChange={handleFilterChange}
          className="w-full md:w-1/4 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="upcoming">Upcoming Events</option>
          <option value="past">Past Events</option>
          <option value="">All Events</option> {/* No filter */}
        </select>
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="w-full md:w-1/4 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="date:1">Date (Oldest First)</option>
          <option value="date:-1">Date (Latest First)</option>
          <option value="title:1">Title (A-Z)</option>
          <option value="title:-1">Title (Z-A)</option>
        </select>
      </div>

      {/* Event Cards */}
      {loading ? (
        <p className="text-center text-gray-500 text-lg col-span-3">Loading events...</p>
      ) : error ? (
        <p className="text-center text-red-600 text-lg col-span-3">Error: {error}</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {events.length === 0 ? (
            <p className="text-center text-gray-500 col-span-3">
              No events match your criteria.
            </p>
          ) : (
            events.map((event) => (
              <div
                key={event._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <img
                  // Changed from event.image to event.imageURL
                  src={event.imageURL}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-5">
                  <div className="flex items-center text-sm text-orange-500 font-semibold mb-2">
                    <FaCalendarAlt className="mr-2" />
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                  <h3 className="text-xl font-semibold text-[#1C3AA9] mb-2">
                    {event.title}
                  </h3>
                  {/* Display a summary (first 100-150 chars of description) */}
                  <p className="text-gray-700 text-sm">
                    {event.description.substring(0, 150)}{event.description.length > 150 ? '...' : ''}
                  </p>
                  <button
                    className="mt-4 text-sm text-white bg-[#1C3AA9] hover:bg-blue-900 px-4 py-2 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                    }}
                  >
                    View Details
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
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-2 rounded ${
                  currentPage === pageNum
                    ? "bg-[#1C3AA9] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-3 right-3 text-gray-700 hover:text-red-600 text-3xl font-bold"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>

            {/* Changed to event.imageURL */}
            <img
              src={selectedEvent.imageURL}
              alt={selectedEvent.title}
              className="w-full h-64 object-cover rounded-t-lg"
            />

            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-4">
                <FaCalendarAlt className="mr-2" />
                {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                {selectedEvent.location && ( // Display location only if available
                  <span className="ml-4 text-gray-600">
                    <FaUniversity className="inline mr-1" /> {selectedEvent.location}
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-bold text-[#1C3AA9] mb-4">
                {selectedEvent.title}
              </h2>
              <p className="text-gray-800 whitespace-pre-line">
                {selectedEvent.description} {/* Full description here */}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;