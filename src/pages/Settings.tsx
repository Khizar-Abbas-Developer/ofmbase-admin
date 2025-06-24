import React from 'react';
import Card from '../components/ui/Card';
import { Save } from 'lucide-react';

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <Card title="General Settings">
        <div className="space-y-6">
          <div>
            <label htmlFor="site-name" className="block text-sm font-medium text-gray-700">
              Site Name
            </label>
            <input
              type="text"
              name="site-name"
              id="site-name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="ofmbase"
            />
            <p className="mt-1 text-sm text-gray-500">
              This will be displayed in the browser tab and emails.
            </p>
          </div>

          <div>
            <label htmlFor="site-url" className="block text-sm font-medium text-gray-700">
              Site URL
            </label>
            <input
              type="text"
              name="site-url"
              id="site-url"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              placeholder="https://ofmbase.com"
            />
          </div>

          <div>
            <label htmlFor="company-logo" className="block text-sm font-medium text-gray-700">
              Company Logo
            </label>
            <div className="mt-1 flex items-center">
              <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center text-gray-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <button
                type="button"
                className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Change
              </button>
            </div>
          </div>

          <div className="pt-5">
            <div className="flex justify-end">
              <button
                type="button"
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;