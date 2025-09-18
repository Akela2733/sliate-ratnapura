import React, { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Message sent successfully! We'll get back to you soon.");
        setFormData({ fullName: "", email: "", message: "" });
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to send message. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrorMessage("An unexpected error occurred. Please check your network and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-800">
      {/* Header */}
      <div className="bg-[#090d54] py-16 text-white text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
        <p className="mt-2 text-lg text-gray-300">
          We're here to help you. Get in touch with us anytime!
        </p>
      </div>

      {/* Contact Info + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 py-16 max-w-7xl mx-auto">
        {/* Contact Details & Map */}
        <div>
          <h2 className="text-3xl font-bold mb-6 text-[#090d54]">Get in Touch</h2>
          <p className="mb-6 text-gray-600">
            Feel free to reach out to us through the following contact methods or fill the form to send a message.
          </p>

          <div className="space-y-6 text-base mb-10">
            <div className="flex items-start gap-4">
              <MapPin className="text-[#090d54]" />
              <div>
                <p className="font-semibold">SLIATE - Ratnapura Campus</p>
                <p>New Town, Ratnapura, Sri Lanka</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Phone className="text-[#090d54]" />
              <p>+94 45 222 3344</p>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="text-[#090d54]" />
              <p>info@sliate-ratnapura.edu.lk</p>
            </div>
          </div>

          {/* Google Map Embed */}
          <div className="w-full h-80 rounded-lg overflow-hidden shadow-lg border border-gray-200">
            {/* The iframe code you provided, with width/height set to 100% for responsiveness */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.4966333072052!2d80.37734667589496!3d6.709079993286649!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3bec5207d4d47%3A0x256c69dfa91d52be!2sAdvanced%20Technological%20Institute%20Ratnapura!5e0!3m2!1sen!2slk!4v1753160794900!5m2!1sen!2slk" // **IMPORTANT: Replace this with your actual Google Maps embed URL if this is a placeholder.**
              width="100%" // Set to 100% to fill the parent div
              height="100%" // Set to 100% to fill the parent div
              style={{ border: 0 }} // Correct JSX style object
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SLIATE Ratnapura Campus Location" // Good for accessibility
            >
            </iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#090d54] focus:outline-none"
                placeholder="Your full name"
                required
              />
            </div>

            {/* Email Address Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#090d54] focus:outline-none"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="mt-1 w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-[#090d54] focus:outline-none"
                placeholder="Write your message here..."
                required
              ></textarea>
            </div>

            {/* Submission Status Messages */}
            {loading && (
              <p className="text-center text-blue-600">Sending message...</p>
            )}
            {successMessage && (
              <p className="text-center text-green-600 font-semibold">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="text-center text-red-600 font-semibold">{errorMessage}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-[#090d54] text-white font-semibold py-2 px-6 rounded-md transition ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#0d126f]"
              }`}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;