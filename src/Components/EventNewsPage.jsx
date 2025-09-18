import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaRegNewspaper, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const EventsNewsPage = () => {
  const navigate = useNavigate();
  const [latestNews, setLatestNews] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [errorNews, setErrorNews] = useState(null);
  const [errorEvents, setErrorEvents] = useState(null);

  // Fetch Latest News
  useEffect(() => {
    const fetchNews = async () => {
      setLoadingNews(true);
      setErrorNews(null);
      try {
        // Fetch 3 latest news items, sorted by creation date descending
        const response = await fetch("http://localhost:5000/api/news?limit=3&sort=createdAt:-1");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLatestNews(data.news);
      } catch (error) {
        console.error("Failed to fetch latest news:", error);
        setErrorNews(error.message);
      } finally {
        setLoadingNews(false);
      }
    };
    fetchNews();
  }, []);

  // Fetch Upcoming Events
  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      setErrorEvents(null);
      try {
        // Fetch 3 upcoming events, filtered to upcoming, sorted by date ascending
        const response = await fetch("http://localhost:5000/api/events?limit=3&filter=upcoming&sort=date:1");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUpcomingEvents(data.events);
      } catch (error) {
        console.error("Failed to fetch upcoming events:", error);
        setErrorEvents(error.message);
      } finally {
        setLoadingEvents(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-center text-primary mb-12">University News & Events</h1>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        {/* News Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaRegNewspaper className="text-[#1C3AA9]" /> Latest News
          </h2>
          {loadingNews ? (
            <p className="text-gray-500">Loading latest news...</p>
          ) : errorNews ? (
            <p className="text-red-600">Error: {errorNews}</p>
          ) : latestNews.length === 0 ? (
            <p className="text-gray-500">No latest news available.</p>
          ) : (
            <ul className="space-y-4">
              {latestNews.map((item) => (
                <li
                  key={item._id}
                  className="bg-gray-50 p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate("/news")} 
                >
                  <p className="text-sm text-gray-500 mb-1">
                    {new Date(item.date).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                  <h3 className="text-lg text-[#1C3AA9] font-medium">{item.title}</h3>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Events Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaCalendarAlt className="text-orange-500" /> Upcoming Events
          </h2>
          {loadingEvents ? (
            <p className="text-gray-500">Loading upcoming events...</p>
          ) : errorEvents ? (
            <p className="text-red-600">Error: {errorEvents}</p>
          ) : upcomingEvents.length === 0 ? (
            <p className="text-gray-500">No upcoming events available.</p>
          ) : (
            <ul className="space-y-4">
              {upcomingEvents.map((event) => {
                const eventDate = new Date(event.date);
                const month = eventDate.toLocaleString("default", { month: "short" }).toUpperCase();
                const day = eventDate.getDate();

                return (
                  <li
                    key={event._id}
                    onClick={() => navigate("/events")} 
                    className="bg-white border-l-4 border-primary p-4 rounded-lg shadow hover:bg-blue-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-blue-900 text-white flex flex-col items-center justify-center rounded">
                        <span className="text-xs">{month}</span>
                        <span className="text-xl font-bold">{day}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-800">{event.title}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <FaMapMarkerAlt className="text-xs" /> {event.location}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsNewsPage;