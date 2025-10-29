import React from "react";
import { Key, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";

/**
 * API Key Settings Page - Currently Disabled
 */
const ApiKeySettings: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gray-400 rounded-lg">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                API Key Settings
              </h1>
              <p className="text-gray-600">
                Feature temporarily disabled
              </p>
            </div>
          </div>
        </div>

        {/* Disabled Notice */}
        <Alert className="mb-8 border-amber-200 bg-amber-50">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Feature Temporarily Disabled</strong>
            <br />
            We're working on security improvements. This feature will be available soon.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default ApiKeySettings;