import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import { Save, FileText, Edit } from "lucide-react";
import axios from "axios";

const Documents: React.FC = () => {
  const URL = import.meta.env.VITE_PUBLIC_BASE_URL;
  const [activeDocument, setActiveDocument] = useState("privacy");
  const [documentContent, setDocumentContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const documents = [
    {
      id: "privacy",
      name: "Privacy Policy",
      description:
        "Legal document that details how user data is collected and processed",
    },
    {
      id: "terms",
      name: "Terms and Conditions",
      description: "Rules and guidelines for using ofmbase.com services",
    },
    {
      id: "cookies",
      name: "Cookie Policy",
      description: "Information about how cookies are used on ofmbase.com",
    },
    {
      id: "gdpr",
      name: "GDPR Compliance",
      description: "European data protection compliance documentation",
    },
  ];

  const activeDoc = documents.find((doc) => doc.id === activeDocument);

  // ✅ On component load — create doc if not exists
  useEffect(() => {
    const fetchDocumentContent = async () => {
      try {
        const res = await axios.get(
          `${URL}/api/admin/documents/fetch-documents`
        );
        const data = res.data;

        // Map the field based on activeDocument
        const fieldMap = {
          privacy: "privacyPolicy",
          terms: "termsAndConditions",
          cookies: "cookiePolicy",
          gdpr: "gdprCompliance",
        };

        const field = fieldMap[activeDocument];
        setDocumentContent(data[field] || ""); // fallback to empty if not set
      } catch (err) {
        console.error("Error loading admin document:", err);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchDocumentContent();
  }, [URL, activeDocument]); // rerun whenever active tab changes

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      const response = await fetch(
        `${URL}/api/admin/documents/update-documents`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            field:
              activeDocument === "privacy"
                ? "privacyPolicy"
                : activeDocument === "terms"
                ? "termsAndConditions"
                : activeDocument === "cookies"
                ? "cookiePolicy"
                : "gdprCompliance",
            content: documentContent,
          }),
        }
      );

      const data = await response.json();
      console.log("Updated:", data);
    } catch (err) {
      console.error("Failed to update:", err);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <h1 className="text-2xl font-bold text-gray-900">
              Legal Documents
            </h1>
            {isEditing ? (
              <div className="flex space-x-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </button>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Document
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card title="Documents">
                <div className="divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <button
                      key={doc.id}
                      className={`w-full flex items-start py-3 px-2 hover:bg-gray-50 ${
                        activeDocument === doc.id ? "bg-gray-50" : ""
                      }`}
                      onClick={() => {
                        if (!isEditing) {
                          setActiveDocument(doc.id);
                        }
                      }}
                    >
                      <FileText
                        className={`h-5 w-5 mt-0.5 ${
                          activeDocument === doc.id
                            ? "text-primary-600"
                            : "text-gray-400"
                        }`}
                      />
                      <div className="ml-3 text-left">
                        <p
                          className={`text-sm font-medium ${
                            activeDocument === doc.id
                              ? "text-primary-600"
                              : "text-gray-900"
                          }`}
                        >
                          {doc.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Card
                title={activeDoc?.name || "Document"}
                subtitle={activeDoc?.description || ""}
              >
                {isEditing ? (
                  // ✅ Editable TextArea Block (unchanged)
                  <div className="space-y-4">
                    <div className="border border-gray-300 rounded-md overflow-hidden">
                      <textarea
                        className="block w-full px-3 py-2 border-0 resize-y min-h-96 focus:ring-0"
                        value={documentContent}
                        onChange={(e) => setDocumentContent(e.target.value)}
                        placeholder="Enter document content here..."
                      ></textarea>
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>
                        Use Markdown formatting if desired. Changes will be
                        published once saved.
                      </p>
                    </div>
                  </div>
                ) : (
                  // ✅ Show saved content (even when not editing)
                  <div className="prose prose-sm sm:prose max-w-none">
                    {documentContent?.trim() ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: documentContent }}
                      />
                    ) : (
                      <div className="text-center py-12 text-gray-500">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No content yet
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Click the Edit Document button to add content to{" "}
                          {activeDoc?.name}.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Documents;
