import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Key, ExternalLink } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

/**
 * API Quota Exceeded Modal
 *
 * Simple modal that appears when API quota is exceeded.
 * Guides users to contribute their own API keys to continue using the service.
 */

interface ApiQuotaModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to close the modal */
  onClose: () => void;
  /** Type of API that exceeded quota */
  apiType: 'text' | 'image';
}

const ApiQuotaModal: React.FC<ApiQuotaModalProps> = ({ isOpen, onClose, apiType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              API Quota Exceeded
            </h2>
            <p className="text-sm text-gray-600">
              {apiType === 'text' ? 'Text generation' : 'Image generation'} limit reached
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Our default API quota has been exceeded. To continue using AI features, 
            you can contribute your own API keys to help the community.
          </p>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-2">How it helps:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your keys help everyone access AI features</li>
              <li>• Keys are used fairly across all users</li>
              <li>• You can remove them anytime</li>
              <li>• Keeps the service free for everyone</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/api-settings" className="flex-1">
            <Button className="w-full flex items-center justify-center gap-2">
              <Key className="w-4 h-4" />
              Add API Keys
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1"
          >
            Maybe Later
          </Button>
        </div>

        {/* Help Links */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Need API keys?</p>
          <div className="flex flex-col sm:flex-row gap-2 text-xs">
            <a 
              href="https://openrouter.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="w-3 h-3" />
              Get OpenRouter Key
            </a>
            <a 
              href="https://stability.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="w-3 h-3" />
              Get Stability AI Key
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ApiQuotaModal;