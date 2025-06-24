import React, { useEffect } from "react";
import Card from "../components/ui/Card";
import { StatCard, StatsRow } from "../components/ui/Stats";
import AreaChart from "../components/charts/AreaChart";
import { Users, DollarSign, Zap } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

// Empty data placeholders
const revenueData = [
  { label: "Jan", value: 0 },
  { label: "Feb", value: 0 },
  { label: "Mar", value: 0 },
  { label: "Apr", value: 0 },
  { label: "May", value: 0 },
  { label: "Jun", value: 0 },
  { label: "Jul", value: 0 },
];

const usersByPlanData = [
  { plan: "Basic", users: 0 },
  { plan: "Professional", users: 0 },
  { plan: "Enterprise", users: 0 },
];

const Dashboard: React.FC = () => {
  const [monthlyRevenueData, setMonthlyRevenueData] = React.useState([]);
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const [totalSubscriptions, setTotalSubscriptions] = React.useState(0);
  const [packagesCount, setPackagesCount] = React.useState([]);
  const [agencyOwners, setAgencyOwners] = React.useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const URL = import.meta.env.VITE_PUBLIC_BASE_URL;
  const fetchAgencyOwners = async () => {
    try {
      const response = await axios.get(`${URL}/api/admin/fetch-all-users`);
      setAgencyOwners(response.data.users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const fetchSubscriptionPlans = async () => {
    try {
      const response = await axios.get(
        `${URL}/api/subscriptions/fetch-subscriptions`
      );
      setSubscriptionPlans(response.data.packages);
    } catch (error) {
      console.error("Error fetching subscription plans:", error);
      toast.error("Failed to load subscription plans.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAgencyOwners();
    fetchSubscriptionPlans();
  }, []);

  useEffect(() => {
    if (subscriptionPlans.length && agencyOwners.length) {
      const result = subscriptionPlans.map((plan) => {
        const count = agencyOwners.filter(
          (owner) => owner.subscribedPackage === plan.name
        ).length;

        return {
          packageName: plan.name,
          ownerCount: count,
          revenue: count * plan.price, // ✅ Revenue for each package
        };
      });

      setPackagesCount(result);

      // ✅ Total subscriptions
      const total = result.reduce((acc, plan) => acc + plan.ownerCount, 0);
      setTotalSubscriptions(total);

      // ✅ Total revenue
      const revenueSum = result.reduce((acc, plan) => acc + plan.revenue, 0);
      setTotalRevenue(revenueSum); // 👈 Create this state using useState if needed

      // ✅ Monthly revenue overview
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const revenueByMonth = Array(12).fill(0);

      agencyOwners.forEach((owner) => {
        const plan = subscriptionPlans.find(
          (p) => p.name === owner.subscribedPackage
        );
        if (plan && owner.subscriptionStart) {
          const date = new Date(owner.subscriptionStart);
          const monthIndex = date.getMonth(); // 0-11
          revenueByMonth[monthIndex] += plan.price;
        }
      });

      const monthlyData = months.map((label, index) => ({
        label,
        value: revenueByMonth[index],
      }));

      setMonthlyRevenueData(monthlyData);
    }
  }, [subscriptionPlans, agencyOwners]);

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          </div>

          <StatsRow>
            <StatCard
              title="Total Users"
              value={agencyOwners.length.toString()}
              icon={<Users size={24} />}
            />

            <StatCard
              title="Monthly Revenue"
              value={totalRevenue > 0 ? `$${totalRevenue.toFixed(2)}` : "$0.00"}
              icon={<DollarSign size={24} />}
            />

            <StatCard
              title="Active Subscriptions"
              value={
                totalSubscriptions > 0 ? totalSubscriptions.toString() : "0"
              }
              icon={<Zap size={24} />}
            />
          </StatsRow>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {monthlyRevenueData.length > 0 ? (
                <AreaChart
                  data={monthlyRevenueData}
                  title="Revenue Overview"
                  height={300}
                />
              ) : (
                <>
                
                </>
              )}
            </div>
            <div>
              <Card
                title="Users by Plan"
                subtitle="Distribution across subscription tiers"
              >
                <div className="space-y-4">
                  {packagesCount &&
                    packagesCount.length > 0 &&
                    packagesCount.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-3 ${
                              index === 0
                                ? "bg-indigo-200"
                                : index === 1
                                ? "bg-indigo-500"
                                : "bg-indigo-800"
                            }`}
                          ></div>
                          <span className="text-sm font-medium text-gray-700">
                            {item.packageName}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {item.ownerCount}
                        </span>
                      </div>
                    ))}
                  {/* {usersByPlanData.every((item) => item.users === 0) && (
                    <div className="text-center py-6 text-gray-500">
                      <p className="text-sm">No users assigned to plans yet</p>
                    </div>
                  )} */}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
