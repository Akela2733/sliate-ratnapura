// src/pages/Results.jsx
import React, { useState } from 'react';
import { Award, Search, User, KeyRound } from 'lucide-react'; // Icons for better visuals
import { toast } from 'react-toastify'; // For notifications

const Results = () => {
  const [studentId, setStudentId] = useState('');
  const [examType, setExamType] = useState('');
  const [results, setResults] = useState(null); // State to hold mock results

  const handleSearch = (e) => {
    e.preventDefault();
    if (!studentId || !examType) {
      toast.error("Please enter both Student ID and Exam Type.");
      return;
    }

    // Mock data for demonstration
    const mockResults = {
      'SLIATE123': {
        'Mid-Term': [
          { subject: 'Programming I', grade: 'A', marks: 85 },
          { subject: 'Database Systems', grade: 'B+', marks: 78 },
        ],
        'Final Exam': [
          { subject: 'Programming I', grade: 'A-', marks: 82 },
          { subject: 'Database Systems', grade: 'A', marks: 90 },
        ]
      },
      'SLIATE456': {
        'Mid-Term': [
          { subject: 'Web Technologies', grade: 'B', marks: 72 },
          { subject: 'Networking', grade: 'C+', marks: 65 },
        ],
        'Final Exam': [
          { subject: 'Web Technologies', grade: 'A-', marks: 80 },
          { subject: 'Networking', grade: 'B+', marks: 75 },
        ]
      }
    };

    const studentData = mockResults[studentId];
    if (studentData && studentData[examType]) {
      setResults(studentData[examType]);
      toast.success("Results fetched successfully!");
    } else {
      setResults(null);
      toast.warn("No results found for the provided details.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Hero Section */}
        <div className="relative bg-[#1C3AA9] text-white p-8 sm:p-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
            <Award className="inline-block w-10 h-10 sm:w-12 sm:h-12 mr-3 align-middle" />
            Check Your Results
          </h1>
          <p className="text-lg sm:text-xl font-light max-w-2xl mx-auto opacity-90">
            Securely access your academic performance and examination grades.
          </p>
          <div className="absolute inset-0 bg-pattern-lines opacity-10"></div> {/* Decorative pattern */}
        </div>

        {/* Search Form Section */}
        <section className="p-8 sm:p-10 lg:p-12">
          <h2 className="text-3xl font-bold text-[#0A174E] mb-8 text-center sm:text-left">
            Find Your Grades
          </h2>
          <form onSubmit={handleSearch} className="max-w-xl mx-auto bg-gray-50 p-8 rounded-xl shadow-inner space-y-6">
            <div>
              <label htmlFor="studentId" className="block text-lg font-medium text-gray-700 mb-2">
                <User className="inline-block w-5 h-5 mr-2 text-gray-500" /> Student ID
              </label>
              <input
                type="text"
                id="studentId"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.toUpperCase())}
                placeholder="e.g., SLIATE123"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="examType" className="block text-lg font-medium text-gray-700 mb-2">
                <KeyRound className="inline-block w-5 h-5 mr-2 text-gray-500" /> Exam Type
              </label>
              <select
                id="examType"
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg bg-white"
                required
              >
                <option value="">Select Exam Type</option>
                <option value="Mid-Term">Mid-Term Exam</option>
                <option value="Final Exam">Final Exam</option>
                <option value="Repeat Exam">Repeat Exam</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center px-8 py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700 transition-colors duration-300 transform hover:scale-105"
            >
              <Search className="w-5 h-5 mr-2" />
              Get Results
            </button>
          </form>

          {/* Results Display */}
          {results && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-[#0A174E] mb-6 text-center">Your Performance</h3>
              <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Subject</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Grade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Marks</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {results.map((res, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{res.subject}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{res.grade}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{res.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Results;
