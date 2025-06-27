import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import {
  Mail,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Code,
  X,
  Save,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

// Empty data placeholders
const emailTemplates: any[] = [];

interface NewTemplateFormData {
  name: string;
  subject: string;
  content: string;
  htmlContent: string;
  useHtml: boolean;
}

const initialFormData: NewTemplateFormData = {
  name: "",
  subject: "",
  content: "",
  htmlContent: "",
  useHtml: false,
};

const Messaging: React.FC = () => {
  const [fetchedEmailTemplates, setFetchedEmailTemplates] =
    useState<any[]>(emailTemplates);
  const [loading, setLoading] = useState(true);
  const URL = import.meta.env.VITE_PUBLIC_BASE_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewTemplateDialog, setShowNewTemplateDialog] = useState(false);
  const [formData, setFormData] =
    useState<NewTemplateFormData>(initialFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${URL}/api/admin/templates/create-templates`, formData);
      setShowNewTemplateDialog(false);
      setFormData(initialFormData);
      fetchAllEmailTemplates();
      toast.success("Email template created successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (
    field: keyof NewTemplateFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const fetchAllEmailTemplates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${URL}/api/admin/templates/fetch-templates`
      );
      setFetchedEmailTemplates(response.data);
    } catch (error) {
      console.error("Error fetching email templates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEmailTemplates();
  }, []);

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <h1 className="text-2xl font-bold text-gray-900">
              Email Templates
            </h1>
            <div className="flex space-x-3">
              <button
                className="btn btn-primary"
                onClick={() => setShowNewTemplateDialog(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Email Template
              </button>
            </div>
          </div>

          {/* New Template Dialog */}
          {showNewTemplateDialog && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        Create New Email Template
                      </h3>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => {
                          setShowNewTemplateDialog(false);
                          setFormData(initialFormData);
                        }}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-4 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="template-name"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Template Name
                        </label>
                        <input
                          type="text"
                          id="template-name"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          required
                          placeholder="Welcome Email"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="template-subject"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email Subject
                        </label>
                        <input
                          type="text"
                          id="template-subject"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          value={formData.subject}
                          onChange={(e) =>
                            handleInputChange("subject", e.target.value)
                          }
                          required
                          placeholder="Welcome to ofmbase!"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700">
                          Email Content
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="use-html"
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              checked={formData.useHtml}
                              onChange={(e) =>
                                handleInputChange("useHtml", e.target.checked)
                              }
                            />
                            <label
                              htmlFor="use-html"
                              className="ml-2 block text-sm text-gray-700"
                            >
                              <Code className="h-4 w-4 inline mr-1" />
                              Use HTML Editor
                            </label>
                          </div>
                        </div>
                      </div>

                      {formData.useHtml ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              HTML Code
                            </label>
                            <textarea
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm font-mono text-sm"
                              rows={12}
                              value={formData.htmlContent}
                              onChange={(e) =>
                                handleInputChange("htmlContent", e.target.value)
                              }
                              placeholder={`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9fafb; }
        .button { background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to ofmbase!</h1>
        </div>
        <div class="content">
            <p>Hello {{name}},</p>
            <p>Thank you for joining ofmbase. We're excited to have you on board!</p>
            <p><a href="{{login_url}}" class="button">Get Started</a></p>
            <p>Best regards,<br>The ofmbase Team</p>
        </div>
    </div>
</body>
</html>`}
                            />
                            <p className="mt-2 text-sm text-gray-500">
                              Use variables like{" "}
                              <code className="bg-gray-100 px-1 rounded">
                                {"{{name}}"}
                              </code>
                              ,{" "}
                              <code className="bg-gray-100 px-1 rounded">
                                {"{{email}}"}
                              </code>
                              ,{" "}
                              <code className="bg-gray-100 px-1 rounded">
                                {"{{login_url}}"}
                              </code>{" "}
                              for dynamic content.
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Preview
                            </label>
                            <div className="border border-gray-300 rounded-md overflow-hidden h-64 w-full">
                              <iframe
                                title="Email Preview"
                                className="w-full h-full"
                                style={{ border: "none" }}
                                srcDoc={formData.htmlContent.replace(
                                  /\{\{(\w+)\}\}/g,
                                  (_, key) => {
                                    return `<span style="background-color: #FEF3C7; padding: 2px 4px; border-radius: 4px; font-size: 0.875rem;">${key}</span>`;
                                  }
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <textarea
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            rows={8}
                            value={formData.content}
                            onChange={(e) =>
                              handleInputChange("content", e.target.value)
                            }
                            required={!formData.useHtml}
                            placeholder={`Hello {{name}},

Thank you for joining ofmbase. We're excited to have you on board!

You can get started by visiting: {{login_url}}

Best regards,
The ofmbase Team`}
                          />
                          <p className="mt-2 text-sm text-gray-500">
                            Use variables like{" "}
                            <code className="bg-gray-100 px-1 rounded">
                              {"{{name}}"}
                            </code>
                            ,{" "}
                            <code className="bg-gray-100 px-1 rounded">
                              {"{{email}}"}
                            </code>
                            ,{" "}
                            <code className="bg-gray-100 px-1 rounded">
                              {"{{login_url}}"}
                            </code>{" "}
                            for dynamic content.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">
                        Available Variables
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                        <code className="bg-white px-2 py-1 rounded text-blue-800">
                          {"{{name}}"}
                        </code>
                        <code className="bg-white px-2 py-1 rounded text-blue-800">
                          {"{{email}}"}
                        </code>
                        <code className="bg-white px-2 py-1 rounded text-blue-800">
                          {"{{login_url}}"}
                        </code>
                        <code className="bg-white px-2 py-1 rounded text-blue-800">
                          {"{{company_name}}"}
                        </code>
                        <code className="bg-white px-2 py-1 rounded text-blue-800">
                          {"{{support_email}}"}
                        </code>
                        <code className="bg-white px-2 py-1 rounded text-blue-800">
                          {"{{unsubscribe_url}}"}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowNewTemplateDialog(false);
                        setFormData(initialFormData);
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <Save className="h-4 w-4 mr-2" />
                      Create Template
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Email Templates
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Create and manage custom email templates for your campaigns
                    and automated messaging
                  </p>
                </div>

                {/* Search input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Search email templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {fetchedEmailTemplates.length > 0 ? (
                  fetchedEmailTemplates.map((template) => (
                    <div
                      key={template._id}
                      className="p-4 border rounded shadow bg-white space-y-2"
                    >
                      <h2 className="text-lg font-semibold">{template.name}</h2>
                      <p className="text-sm text-gray-600">
                        <strong>Subject:</strong> {template.subject}
                      </p>
                      <p className="text-sm text-gray-800">
                        <strong>Content:</strong> {template.content}
                      </p>
                      <p className="text-sm text-gray-800">
                        <strong>HTML Content:</strong> {template.htmlContent}
                      </p>
                      <p className="text-xs text-gray-500">
                        Created: {new Date(template.createdAt).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        Updated: {new Date(template.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Mail className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No email templates
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by creating your first email template with
                      custom HTML design or plain text content.
                    </p>
                    <div className="mt-6">
                      <button
                        className="btn btn-primary"
                        onClick={() => setShowNewTemplateDialog(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Email Template
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Messaging;
