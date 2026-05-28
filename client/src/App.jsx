import React, { useState } from "react";
import DynamicChart from "./components/DynamicChart";
import DataExplorer from "./components/DataExplorer";

function App() {
  const [activeTab, setActiveTab] = useState("analytics");
  const [query, setQuery] = useState("");
  const [uiSchema, setUiSchema] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:3000/api/dashboard/query",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setUiSchema(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch dashboard component.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header with Integrated Tab Switcher */}
      <header className="bg-white border-b border-gray-200 py-4 px-8 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-black tracking-tight text-blue-600">
          Generative <span className="text-gray-800">UI Analytics</span>
        </h1>

        {/* The Navigation Control */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              activeTab === "analytics"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            AI Workspace
          </button>
          <button
            onClick={() => setActiveTab("explorer")}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              activeTab === "explorer"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Data Explorer
          </button>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {activeTab === "analytics" ? (
          <>
            {/* Input Form */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <form onSubmit={handleSubmit} className="flex gap-4">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., Show me sales by region"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-sm"
                >
                  {loading ? "Generating..." : "Analyze"}
                </button>
              </form>
              {error && (
                <p className="text-red-500 text-sm mt-3 font-medium">
                  ⚠️ {error}
                </p>
              )}
            </div>

            {/* Dynamic Canvas Area */}
            <section className="min-h-100 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center p-4 bg-gray-100/50">
              {loading ? (
                <div className="text-center space-y-2">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-gray-500 font-medium">
                    AI is thinking and assembling your UI...
                  </p>
                </div>
              ) : uiSchema ? (
                <div className="w-full">
                  <DynamicChart schema={uiSchema} />
                </div>
              ) : (
                <p className="text-gray-400 font-medium text-center max-w-sm">
                  Type an analytical query above to generate an interface on the
                  fly.
                </p>
              )}
            </section>
          </>
        ) : (
          /* Fallback View: Displays the Data Explorer directly inside your main container width */
          <DataExplorer />
        )}
      </main>
    </div>
  );
}

export default App;
