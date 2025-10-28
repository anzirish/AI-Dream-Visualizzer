import React, { useState, useEffect } from "react";
import { backendAPI } from "@/services/api/backend";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Alert, AlertDescription } from "@/shared/components/ui/alert";
import { Key, Plus, Trash2, AlertCircle, CheckCircle } from "lucide-react";

/**
 * API Key Settings Page
 *
 * Simple interface for users to contribute their API keys to the community pool.
 * Helps maintain service availability when default quotas are exceeded.
 */
const ApiKeySettings: React.FC = () => {
  // State management
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [newKey, setNewKey] = useState({
    keyType: "openrouter" as "openrouter" | "stable_diffusion",
    apiKey: "",
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Load user's API keys and community stats
   */
  const loadData = async () => {
    try {
      setLoading(true);
      const [userKeys, communityStats] = await Promise.all([
        backendAPI.getMyApiKeys(),
        backendAPI.getApiKeyStats(),
      ]);

      setApiKeys(userKeys);
      setStats(communityStats);
    } catch (error) {
      setError("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add new API key to the community pool
   */
  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newKey.apiKey.trim()) {
      setError("Please enter an API key");
      return;
    }

    try {
      setAdding(true);
      setError("");

      await backendAPI.addApiKey(newKey.keyType, newKey.apiKey.trim());

      setSuccess("API key added successfully!");
      setNewKey({ keyType: "openrouter", apiKey: "" });

      // Reload data
      await loadData();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.message || "Failed to add API key");
    } finally {
      setAdding(false);
    }
  };

  /**
   * Delete user's API key
   */
  const handleDeleteKey = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this API key?")) {
      return;
    }

    try {
      await backendAPI.deleteApiKey(id);
      setSuccess("API key removed successfully");
      await loadData();
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(error.message || "Failed to delete API key");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading API settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-lg">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                API Key Settings
              </h1>
              <p className="text-gray-600">
                Contribute your API keys to help the community
              </p>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Community Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Community Pool Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map((stat: any) => (
              <div key={stat._id} className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 capitalize mb-2">
                  {stat._id.replace("_", " ")} Keys
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    Active: {stat.activeKeys} / {stat.totalKeys}
                  </p>
                  <p>Total Usage: {stat.totalUsage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New API Key */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Add API Key
          </h2>

          <form onSubmit={handleAddKey} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Type
              </label>
              <select
                value={newKey.keyType}
                onChange={(e) =>
                  setNewKey((prev) => ({
                    ...prev,
                    keyType: e.target.value as
                      | "openrouter"
                      | "stable_diffusion",
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="openrouter">OpenRouter (Text Generation)</option>
                <option value="stable_diffusion">
                  Stable Diffusion (Image Generation)
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                API Key
              </label>
              <Input
                type="password"
                value={newKey.apiKey}
                onChange={(e) =>
                  setNewKey((prev) => ({ ...prev, apiKey: e.target.value }))
                }
                placeholder="Enter your API key..."
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={adding || !newKey.apiKey.trim()}
              className="flex items-center gap-2"
            >
              {adding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add API Key
                </>
              )}
            </Button>
          </form>
        </div>

        {/* User's API Keys */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Contributed Keys
          </h2>

          {apiKeys.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              You haven't contributed any API keys yet.
            </p>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((key: any) => (
                <div
                  key={key._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {key.keyType.replace("_", " ")}
                    </p>
                    <p className="text-sm text-gray-500">
                      Used {key.usageCount} times • Status:{" "}
                      {key.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDeleteKey(key._id)}
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>
              • Your API keys help keep the service running when default quotas
              are exceeded
            </li>
            <li>• Keys are stored securely and used fairly across all users</li>
            <li>• You can remove your keys anytime</li>
            <li>
              • Contributing helps the entire community access AI features
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApiKeySettings;
