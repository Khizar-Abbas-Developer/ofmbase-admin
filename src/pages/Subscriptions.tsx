import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit,
  X,
  Users,
  HardDrive,
  UserCheck,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface PlanCardProps {
  onEdit: (_id: string, plan: any) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onEdit }) => {
  return (
    <div
      className={`border rounded-lg ${
        plan.active ? "border-gray-200" : "border-gray-200 bg-gray-50"
      } overflow-hidden`}
    >
      <div
        className={`px-6 py-4 border-b ${
          plan.active ? "border-gray-200" : "border-gray-200 opacity-60"
        }`}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
          <div className="flex space-x-1">
            <button
              className="p-1 text-gray-400 hover:text-primary-500"
              onClick={() => onEdit(plan._id, plan)}
            >
              <Edit className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="mt-1">
          <span className="text-2xl font-bold">${plan.price}</span>
          <span className="text-gray-500 ml-1">/month</span>
        </div>
      </div>
      <div className="px-6 py-4">
        <ul className="space-y-3">
          <li className="flex items-center">
            <Users className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0" />
            <span className="text-gray-600 text-sm">
              <span className="font-medium">{plan.creators}</span> creators
              allowed
            </span>
          </li>
          <li className="flex items-center">
            <UserCheck className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
            <span className="text-gray-600 text-sm">
              <span className="font-medium">{plan.employees}</span> employees
              allowed
            </span>
          </li>
          <li className="flex items-center">
            <HardDrive className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
            <span className="text-gray-600 text-sm">
              <span className="font-medium">{plan.storage} GB</span> storage
            </span>
          </li>
        </ul>
      </div>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span
            className={`text-sm font-medium ${
              plan.active ? "text-green-600" : "text-gray-500"
            }`}
          >
            {plan.active ? "Active" : "Inactive"}
          </span>
          <button
            className="btn btn-secondary text-sm"
            onClick={() => onEdit(plan._id)}
          >
            {plan.active ? "Deactivate" : "Activate"}
          </button>
        </div>
      </div>
    </div>
  );
};

interface NewPlanFormData {
  name: string;
  price: string;
  creators: string;
  employees: string;
  storage: string;
  active: boolean;
}

const initialFormData: NewPlanFormData = {
  name: "",
  price: "",
  creators: "",
  employees: "",
  storage: "",
  active: true,
};

const Subscriptions: React.FC = () => {
  const [fetchedPackages, setFetchedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const URL = import.meta.env.VITE_PUBLIC_BASE_URL;
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [formData, setFormData] = useState<NewPlanFormData>(initialFormData);

  const handleEditPlan = async (id: string, plan: any) => {
    try {
      if (!plan) {
        setLoading(true);
        await axios.put(
          `${URL}/api/subscriptions/update-subscription-status/${id}`
        );

        fetchSubscriptionPlans();
      } else {
        setEditingPlanId(id);
        // // In a real app, you'd load the plan data here
        // const plan = subscriptionPlans.find((p) => p.id === id);
        if (plan) {
          setFormData({
            name: plan.name,
            price: plan.price.toString(),
            creators: plan.creators.toString(),
            employees: plan.employees.toString(),
            storage: plan.storage.toString(),
            active: plan.active,
          });
          setShowNewPlanForm(true);
        }
      }
    } catch (error) {
      console.error("Error updating plan status:", error);
      toast.error("Failed to update plan status.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (
        !formData.name ||
        !formData.price ||
        !formData.creators ||
        !formData.employees ||
        !formData.storage
      ) {
        toast.error("Please fill in all fields.");
        return;
      }
      if (!editingPlanId) {
        await axios.post(
          `${URL}/api/subscriptions/add-new-subscriptions`,
          formData
        );
      } else {
        await axios.put(
          `${URL}/api/subscriptions/update-subscription/${editingPlanId}`,
          formData
        );
      }
      fetchSubscriptionPlans();
      // Handle form submission here
    } catch (error) {
    } finally {
      setShowNewPlanForm(false);
      setFormData(initialFormData);
      setEditingPlanId(null);

      setLoading(false);
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await axios.get(
        `${URL}/api/subscriptions/fetch-subscriptions`
      );
      setFetchedPackages(response.data.packages || []); // assuming your backend returns { packages: [...] }
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      toast.error("Failed to load subscription plans.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchSubscriptionPlans();
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
              Subscription Plans
            </h1>
            <div className="flex space-x-3">
              <button
                className="btn btn-primary"
                onClick={() => setShowNewPlanForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Plan
              </button>
            </div>
          </div>

          {/* New Plan Dialog */}
          {showNewPlanForm && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                  <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {editingPlanId ? "Edit Plan" : "Add New Plan"}
                      </h3>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => {
                          setShowNewPlanForm(false);
                          setFormData(initialFormData);
                          setEditingPlanId(null);
                        }}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="px-6 py-4 space-y-6">
                    <div>
                      <label
                        htmlFor="plan-name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Plan Name
                      </label>
                      <input
                        type="text"
                        id="plan-name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        required
                        placeholder="Professional"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="plan-price"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Monthly Price ($)
                        </label>
                        <input
                          type="number"
                          id="plan-price"
                          min="0"
                          step="0.01"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              price: e.target.value,
                            }))
                          }
                          required
                          placeholder="99"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="plan-storage"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Storage (GB)
                        </label>
                        <input
                          type="number"
                          id="plan-storage"
                          min="1"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          value={formData.storage}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              storage: e.target.value,
                            }))
                          }
                          required
                          placeholder="500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="plan-creators"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Creators Allowed
                        </label>
                        <input
                          type="number"
                          id="plan-creators"
                          min="1"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          value={formData.creators}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              creators: e.target.value,
                            }))
                          }
                          required
                          placeholder="25"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="plan-employees"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Employees Allowed
                        </label>
                        <input
                          type="number"
                          id="plan-employees"
                          min="1"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          value={formData.employees}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              employees: e.target.value,
                            }))
                          }
                          required
                          placeholder="100"
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="plan-active"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={formData.active}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            active: e.target.checked,
                          }))
                        }
                      />
                      <label
                        htmlFor="plan-active"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Make this plan active immediately
                      </label>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setShowNewPlanForm(false);
                        setFormData(initialFormData);
                        setEditingPlanId(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {editingPlanId
                        ? "Update Plan"
                        : loading
                        ? "Creating..."
                        : "Create Plan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fetchedPackages &&
              fetchedPackages.length > 0 &&
              fetchedPackages.map((plan) => (
                <PlanCard key={plan._id} plan={plan} onEdit={handleEditPlan} />
              ))}

            {/* Add new plan card */}
            <div
              className="border border-dashed border-gray-300 rounded-lg overflow-hidden hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => setShowNewPlanForm(true)}
            >
              <div className="px-6 py-16 flex flex-col items-center justify-center text-gray-500">
                <Plus className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">Add New Plan</p>
                <p className="text-sm mt-1">Create a new subscription tier</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Subscriptions;
