import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import { StatCard, StatsRow } from "../components/ui/Stats";
import AreaChart from "../components/charts/AreaChart";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Calendar,
  ChevronDown,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

// Empty data placeholders
const monthlyRevenueData = [
  { label: "Jan", value: 0 },
  { label: "Feb", value: 0 },
  { label: "Mar", value: 0 },
  { label: "Apr", value: 0 },
  { label: "May", value: 0 },
  { label: "Jun", value: 0 },
];

const revenueByPlanData = [
  { plan: "Basic", revenue: 0 },
  { plan: "Professional", revenue: 0 },
  { plan: "Enterprise", revenue: 0 },
];

const Finance: React.FC = () => {
  const [averageRevenuePerUser, setAverageRevenuePerUser] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);
  const [monthlyRevenueData, setMonthlyRevenueData] = React.useState([]);
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const [totalSubscriptions, setTotalSubscriptions] = React.useState(0);
  const [packagesCount, setPackagesCount] = React.useState([]);
  const [agencyOwners, setAgencyOwners] = React.useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const URL = import.meta.env.VITE_PUBLIC_BASE_URL;
  const periodOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
  ];

  // Placeholder for fetching data based on selected period
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
      const now = new Date();

      // Filter owners based on selected period
      const filteredOwners = agencyOwners.filter((owner) => {
        if (!owner.subscriptionStart) return false;
        const startDate = new Date(owner.subscriptionStart);

        switch (selectedPeriod) {
          case "daily":
            return startDate.toDateString() === now.toDateString();

          case "weekly": {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday

            return startDate >= startOfWeek && startDate <= endOfWeek;
          }

          case "monthly":
            return (
              startDate.getMonth() === now.getMonth() &&
              startDate.getFullYear() === now.getFullYear()
            );

          case "quarterly": {
            const currentQuarter = Math.floor(now.getMonth() / 3);
            const startMonth = currentQuarter * 3;

            const startOfQuarter = new Date(now.getFullYear(), startMonth, 1);
            const endOfQuarter = new Date(now.getFullYear(), startMonth + 3, 0);

            return startDate >= startOfQuarter && startDate <= endOfQuarter;
          }

          case "yearly":
            return startDate.getFullYear() === now.getFullYear();

          default:
            return true;
        }
      });

      // Now use `filteredOwners` instead of all `agencyOwners`
      const result = subscriptionPlans.map((plan) => {
        const count = filteredOwners.filter(
          (owner) => owner.subscribedPackage === plan.name
        ).length;

        return {
          packageName: plan.name,
          ownerCount: count,
          revenue: count * plan.price,
        };
      });

      setPackagesCount(result);

      const total = result.reduce((acc, plan) => acc + plan.ownerCount, 0);
      setTotalSubscriptions(total);

      const revenueSum = result.reduce((acc, plan) => acc + plan.revenue, 0);
      setTotalRevenue(revenueSum);

      const revenueByMonth = Array(12).fill(0);
      filteredOwners.forEach((owner) => {
        const plan = subscriptionPlans.find(
          (p) => p.name === owner.subscribedPackage
        );
        if (plan && owner.subscriptionStart) {
          const date = new Date(owner.subscriptionStart);
          const monthIndex = date.getMonth(); // 0-11
          revenueByMonth[monthIndex] += plan.price;
        }
      });

      setAverageRevenuePerUser(
        filteredOwners.length ? revenueSum / filteredOwners.length : 0
      );

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

      const monthlyData = months.map((label, index) => ({
        label,
        value: revenueByMonth[index],
      }));

      setMonthlyRevenueData(monthlyData);
    }
  }, [subscriptionPlans, agencyOwners, selectedPeriod]);

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <h1 className="text-2xl font-bold text-gray-900">Finance</h1>

            <div className="flex space-x-3">
              <div className="relative">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  {periodOptions.find((opt) => opt.value === selectedPeriod)
                    ?.label || "Monthly"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>

                {showPeriodDropdown && (
                  <div className="absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      {periodOptions.map((option) => (
                        <button
                          key={option.value}
                          className={`
                        w-full text-left px-4 py-2 text-sm ${
                          selectedPeriod === option.value
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700"
                        } hover:bg-gray-100 hover:text-gray-900
                      `}
                          role="menuitem"
                          onClick={() => {
                            setSelectedPeriod(option.value);
                            setShowPeriodDropdown(false);
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <StatsRow>
            <StatCard
              title="Total Revenue"
              value={totalRevenue > 0 ? `$${totalRevenue.toFixed(2)}` : "$0.00"}
              icon={<DollarSign size={24} />}
            />

            <StatCard
              title="Active Subscriptions"
              value={totalSubscriptions.toString()}
              icon={<CreditCard size={24} />}
            />

            <StatCard
              title="Average Revenue Per User"
              value={
                averageRevenuePerUser > 0
                  ? `$${averageRevenuePerUser.toFixed(2)}`
                  : "$0.00"
              }
              icon={<TrendingUp size={24} />}
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
                <></>
              )}
            </div>
            <div>
              <Card
                title="Revenue by Plan"
                subtitle="Revenue distribution across subscription tiers"
              >
                <div className="space-y-4">
                  {packagesCount.map((item, index) => (
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
                        ${item.revenue.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  {monthlyRevenueData.every((item) => item.revenue === 0) && (
                    <div className="text-center py-6 text-gray-500">
                      <p className="text-sm">No revenue data available yet</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Finance;
