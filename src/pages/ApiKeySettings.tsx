import React from "react";

// API Key Settings page - currently disabled
const ApiKeySettings: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            API Key Settings
          </h1>
          <p className="text-gray-600">
            Feature temporarily disabled
          </p>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded">
          <p className="text-amber-800">
            <strong>Feature Temporarily Disabled</strong>
            <br />
            We're working on security improvements. This feature will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySettings;