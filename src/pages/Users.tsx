import React, { useEffect, useRef, useState } from "react";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import {
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  X,
  Check,
  Eye,
  EyeOff,
  Trash,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

// Empty data placeholders
const usersData: any[] = [];

interface AddUserFormData {
  email: string;
  name: string;
  password: string;
}

const initialFormData: AddUserFormData = {
  email: "",
  name: "",
  password: "",
};

const Users: React.FC = () => {
  const [dropdownOpenRow, setDropdownOpenRow] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpenRow(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const URL = import.meta.env.VITE_PUBLIC_BASE_URL;
  const [users, setUsers] = useState<any[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<AddUserFormData>(initialFormData);
  const [showPassword, setShowPassword] = useState(false);

  const fetchAgencyUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${URL}/api/admin/fetch-all-users`);
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencyUsers();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = [...users];

    // Apply subscription/status filter
    if (selectedFilter !== "all") {
      result = result.filter((user) => {
        if (["active", "pending", "suspended"].includes(selectedFilter)) {
          return user.status === selectedFilter; // Replace with actual user status key if different
        }
        if (
          ["basic", "professional", "enterprise", "free"].includes(
            selectedFilter
          )
        ) {
          return user.subscribedPackage?.toLowerCase() === selectedFilter;
        }
        return true;
      });
    }

    // Apply search filter
    if (searchTerm.trim() !== "") {
      result = result.filter(
        (user) =>
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(result);
  }, [users, selectedFilter, searchTerm]);
  const deleteUserByAdmin = async (id: string) => {
    try {
      setLoading(true);
      const response = await axios.delete(`${URL}/api/admin/delete-user/${id}`);
      console.log(response);
      fetchAgencyUsers(); // Refresh user list after deletion
      setDropdownOpenRow(null); // Close dropdown after action
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  const columns = [
    {
      header: "User",
      accessor: (user: any) => (
        <div className="flex items-start">
          <div className="ml-4">
            <div className="font-medium text-gray-900">
              {user.fullName || ""}
            </div>
            <div className="text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (user: any) => (
        <StatusBadge status={user.isVerified ? "active" : "pending"} />
      ),
    },
    {
      header: "Subscription",
      accessor: (user: any) => (
        <span className="text-gray-500">
          {user.subscribedPackage || "Free"}
        </span>
      ),
    },
    {
      header: "",
      accessor: (user: any) => (
        <div
          className="relative"
          ref={dropdownOpenRow === user._id ? dropdownRef : null}
        >
          <button
            onClick={() =>
              setDropdownOpenRow(dropdownOpenRow === user._id ? null : user._id)
            }
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Actions</span>
            <MoreVertical className="h-5 w-5" />
          </button>
          {dropdownOpenRow === user._id && (
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50">
              <button
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={() => {
                  deleteUserByAdmin(user._id);
                  setDropdownOpenRow(null);
                }}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete User
              </button>
            </div>
          )}
        </div>
      ),
      className: "w-10",
    },
  ];
  const filterOptions = [
    { value: "all", label: "All Users", category: "status" },
    { value: "active", label: "Active Users", category: "status" },
    { value: "pending", label: "Pending Users", category: "status" },
    { value: "suspended", label: "Suspended Users", category: "status" },
    { value: "basic", label: "Basic Plan", category: "subscription" },
    {
      value: "professional",
      label: "Professional Plan",
      category: "subscription",
    },
    { value: "enterprise", label: "Enterprise Plan", category: "subscription" },
    { value: "free", label: "Free Users", category: "subscription" },
  ];
  const statusOptions = filterOptions.filter(
    (opt) => opt.category === "status"
  );
  const subscriptionOptions = filterOptions.filter(
    (opt) => opt.category === "subscription"
  );

  //add user
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      console.log("Creating user:", formData);
      const response = await axios.post(
        `${URL}/api/admin/add-user-by-admin`,
        formData
      );
      console.log(response);
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user. Please try again.");
    } finally {
      setSubmitting(false);
      setShowAddUserDialog(false);
      fetchAgencyUsers(); // Refresh user list after adding
    }
  };

  const handleInputChange = (field: keyof AddUserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  return (
    <>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            <div className="flex space-x-3">
              <button
                className="btn btn-primary"
                onClick={() => setShowAddUserDialog(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </button>
            </div>
          </div>

          {/* Add User Dialog */}
          {showAddUserDialog && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                <form onSubmit={handleSubmit}>
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        Add New User
                      </h3>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => {
                          setShowAddUserDialog(false);
                          setFormData(initialFormData);
                        }}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-4 space-y-4">
                    <div>
                      <label
                        htmlFor="user-email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="user-email"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                        placeholder="user@example.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="user-name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="user-name"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="user-password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="user-password"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm pr-10"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          required
                          placeholder="Enter password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowAddUserDialog(false);
                        setFormData(initialFormData);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary"
                    >
                      {submitting ? (
                        <div className="flex justify-center items-center gap-2">
                          <p>
                            <ClipLoader size={14} color="white" />
                          </p>
                          <p className="text-xs">Creating</p>
                        </div>
                      ) : (
                        <p>Create User</p>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                {/* Filter dropdown */}
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      <span>
                        {filterOptions.find(
                          (opt) => opt.value === selectedFilter
                        )?.label || "All Users"}
                      </span>
                    </button>
                    {selectedFilter !== "all" && (
                      <button
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => setSelectedFilter("all")}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  {showFilterDropdown && (
                    <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20 max-h-80 overflow-y-auto">
                      <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        {/* Status Section */}
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200">
                          Status
                        </div>
                        {statusOptions.map((option) => (
                          <button
                            key={option.value}
                            className={`
                          w-full text-left px-4 py-2 text-sm ${
                            selectedFilter === option.value
                              ? "bg-primary-50 text-primary-700"
                              : "text-gray-700"
                          } hover:bg-gray-100 hover:text-gray-900
                        `}
                            role="menuitem"
                            onClick={() => {
                              setSelectedFilter(option.value);
                              setShowFilterDropdown(false);
                            }}
                          >
                            <div className="flex items-center">
                              {selectedFilter === option.value && (
                                <Check className="h-4 w-4 mr-2 text-primary-600" />
                              )}
                              <span
                                className={
                                  selectedFilter === option.value ? "" : "ml-6"
                                }
                              >
                                {option.label}
                              </span>
                            </div>
                          </button>
                        ))}

                        {/* Subscription Section */}
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200 border-t border-gray-200">
                          Subscription Plans
                        </div>
                        {subscriptionOptions.map((option) => (
                          <button
                            key={option.value}
                            className={`
                          w-full text-left px-4 py-2 text-sm ${
                            selectedFilter === option.value
                              ? "bg-primary-50 text-primary-700"
                              : "text-gray-700"
                          } hover:bg-gray-100 hover:text-gray-900
                        `}
                            role="menuitem"
                            onClick={() => {
                              setSelectedFilter(option.value);
                              setShowFilterDropdown(false);
                            }}
                          >
                            <div className="flex items-center">
                              {selectedFilter === option.value && (
                                <Check className="h-4 w-4 mr-2 text-primary-600" />
                              )}
                              <span
                                className={
                                  selectedFilter === option.value ? "" : "ml-6"
                                }
                              >
                                {option.label}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Search input */}
                <div className="relative">
                  <input
                    type="text"
                    className="block w-full pl-16 pr-8 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="🔍 Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DataTable
              columns={columns}
              data={filteredUsers}
              rowKey={(user) => user._id}
              emptyMessage="No users found"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Users;
