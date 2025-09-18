import React, { useState, useEffect } from "react"; // Added useEffect
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { Dialog, DialogContent, IconButton, CircularProgress } from "@mui/material"; // Added CircularProgress
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const Calendar = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [allItems, setAllItems] = useState([]); // State to hold fetched and combined news/events
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all news items
        const newsResponse = await fetch("http://localhost:5000/api/news?limit=all");
        if (!newsResponse.ok) {
          throw new Error(`HTTP error fetching news! status: ${newsResponse.status}`);
        }
        const newsData = await newsResponse.json();
        const formattedNews = newsData.news.map(item => ({
          date: new Date(item.date).toISOString().split("T")[0], // Ensure YYYY-MM-DD format
          slug: item.slug,
          type: "news",
        }));

        // Fetch all event items
        const eventsResponse = await fetch("http://localhost:5000/api/events?limit=all");
        if (!eventsResponse.ok) {
          throw new Error(`HTTP error fetching events! status: ${eventsResponse.status}`);
        }
        const eventsData = await eventsResponse.json();
        const formattedEvents = eventsData.events.map(item => ({
          date: new Date(item.date).toISOString().split("T")[0], // Ensure YYYY-MM-DD format
          slug: item.slug,
          type: "events",
        }));

        // Combine and set the state
        setAllItems([...formattedNews, ...formattedEvents]);
      } catch (err) {
        console.error("Failed to fetch calendar data:", err);
        setError("Failed to load calendar data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (open) { // Only fetch data when the calendar dialog is opened
      fetchAllData();
    }
  }, [open]); // Rerun effect when 'open' prop changes

  const handleDateSelect = (date) => {
    // Ensure the date is formatted as YYYY-MM-DD for comparison
    const dateStr = date.toISOString().split("T")[0];

    // Find all items for the selected date
    const itemsOnDate = allItems.filter((item) => item.date === dateStr);

    if (itemsOnDate.length > 0) {
      // For simplicity, if multiple items exist on the same date,
      // we'll just navigate to the first one found.
      // A more advanced solution might involve a modal listing all items for the day.
      const firstItem = itemsOnDate[0];
      navigate(`/${firstItem.type}/${firstItem.slug}`);
      onClose(); // Close the calendar after navigation
    } else {
      alert("No news or events on this date.");
    }
  };

  // Optional: Highlight dates with events/news
  const isDateHighlighted = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return allItems.some(item => item.date === dateStr);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="relative p-6"> {/* Added padding */}
        <IconButton
          onClick={onClose}
          className="absolute right-2 top-2"
          aria-label="close"
          sx={{ color: 'text.secondary' }} // Apply color from theme
        >
          <CloseIcon />
        </IconButton>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-10 min-w-[300px] min-h-[300px]">
            <CircularProgress color="primary" />
            <p className="mt-4 text-gray-600">Loading calendar data...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-10 min-w-[300px] min-h-[300px] text-red-600">
            <p>{error}</p>
            <p className="mt-2 text-sm">Please ensure your backend server is running.</p>
          </div>
        ) : (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <StaticDatePicker
              displayStaticWrapperAs="desktop"
              onChange={handleDateSelect}
              slotProps={{
                actionBar: { actions: [] }, // Hides default action buttons (OK/Cancel)
                day: { // Optional: Highlight dates with content
                  sx: (ownerState) => ({
                    // Check if the day is highlighted based on your logic
                    // This relies on isDateHighlighted function
                    ...(ownerState.selected && {
                      backgroundColor: 'primary.main', // Example: highlight selected day
                      color: 'primary.contrastText',
                    }),
                    ...(!ownerState.disabled && isDateHighlighted(ownerState.day) && {
                      border: '2px solid #1C3AA9', // Example: add a border for dates with items
                      // backgroundColor: 'rgba(28, 58, 169, 0.1)', // Light blue background
                    }),
                  }),
                },
              }}
              // You can uncomment this if you want to explicitly mark highlighted dates
              // shouldDisableDate={(date) => !isDateHighlighted(date)} // To disable dates without items (use with caution)
            />
          </LocalizationProvider>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Calendar;