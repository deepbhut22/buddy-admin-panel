import { useState, useEffect } from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer, Cell
} from 'recharts';
import {
    CalendarDays,
    Users,
    Ticket,
    Percent,
    ClipboardList,
    AlertCircle,
    TrendingUp,
    Clock,
    BarChart2,
    PieChart as PieChartIcon,
    RefreshCcw,
    Filter
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    const [dashboardData, setDashboardData] = useState(null);
    const [redemptionAnalytics, setRedemptionAnalytics] = useState(null);
    const [userAnalytics, setUserAnalytics] = useState(null);
    const [summaryReports, setSummaryReports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('month');
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                // In a real implementation, these would be actual API calls
                const dashboardResponse = await fetch(`/api/dashboard?period=${period}`);
                const redemptionResponse = await fetch(`/api/redemption-analytics?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`);
                const userResponse = await fetch('/api/user-analytics');
                const summaryResponse = await fetch('/api/summary');

                const dashboardData = await dashboardResponse.json();
                const redemptionData = await redemptionResponse.json();
                const userData = await userResponse.json();
                const summaryData = await summaryResponse.json();

                setDashboardData(dashboardData.data);
                setRedemptionAnalytics(redemptionData.data);
                setUserAnalytics(userData.data);
                setSummaryReports(summaryData.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [period, dateRange]);

    // Mock data for display purposes
    const mockDashboardData = {
        summary: {
            totalCoupons: 1250,
            totalDiscounts: 780,
            totalUsers: 3456,
            activeUsers: 2903,
            pendingRequests: 27,
            totalRedemptions: 8754,
            availableCoupons: 482,
            availableDiscounts: 296,
            averageDiscount: 25.8
        },
        charts: {
            redemptionsOverTime: {
                "2025-04-01": 42,
                "2025-04-02": 38,
                "2025-04-03": 55,
                "2025-04-04": 61,
                "2025-04-05": 34
            },
            redemptionsByCategory: [
                { category: "Electronics", count: 350 },
                { category: "Clothing", count: 280 },
                { category: "Food & Beverages", count: 210 },
                { category: "Home & Garden", count: 150 },
                { category: "Beauty", count: 120 }
            ],
            redemptionsByCompany: [
                { company: "TechGadgets Inc.", count: 180 },
                { company: "Fashion Forward", count: 150 },
                { company: "Gourmet Foods", count: 120 },
                { company: "Home Essentials", count: 100 },
                { company: "Beauty Basics", count: 90 }
            ],
            redemptionsByType: [
                { type: "coupon", count: 580 },
                { type: "discount", count: 420 }
            ],
            userRegistrationsOverTime: {
                "2025-04-01": 15,
                "2025-04-02": 12,
                "2025-04-03": 18,
                "2025-04-04": 10,
                "2025-04-05": 16
            },
            usersByCategory: [
                { category: "Premium", count: 820 },
                { category: "Standard", count: 1560 },
                { category: "Basic", count: 1076 }
            ],
            usersByService: [
                { service: "Mobile App", count: 1820 },
                { service: "Website", count: 1236 },
                { service: "In-Store", count: 400 }
            ],
            redemptionStatusDistribution: [
                { status: "completed", count: 7590 },
                { status: "pending", count: 854 },
                { status: "failed", count: 310 }
            ],
            monthlyRedemptionData: [
                { month: "2024-11", count: 580 },
                { month: "2024-12", count: 620 },
                { month: "2025-01", count: 780 },
                { month: "2025-02", count: 720 },
                { month: "2025-03", count: 850 },
                { month: "2025-04", count: 910 }
            ]
        },
        recentData: {
            recentRedemptions: [
                { _id: "1", couponCode: "SPRING25", company: "TechGadgets Inc.", user: "john@example.com", redeemedAt: "2025-04-28T12:45:00Z", status: "completed" },
                { _id: "2", couponCode: "SAVE20", company: "Fashion Forward", user: "sarah@example.com", redeemedAt: "2025-04-28T10:30:00Z", status: "completed" },
                { _id: "3", couponCode: "MEAL15", company: "Gourmet Foods", user: "mike@example.com", redeemedAt: "2025-04-27T18:15:00Z", status: "completed" },
                { _id: "4", couponCode: "HOME10", company: "Home Essentials", user: "lisa@example.com", redeemedAt: "2025-04-27T14:20:00Z", status: "pending" },
                { _id: "5", couponCode: "BEAUTY30", company: "Beauty Basics", user: "alex@example.com", redeemedAt: "2025-04-27T09:00:00Z", status: "completed" }
            ],
            expiringSoonCoupons: [
                { _id: "1", code: "SPRING25", company: "TechGadgets Inc.", endDate: "2025-05-05T23:59:59Z", remainingCoupons: 45 },
                { _id: "2", code: "SAVE20", company: "Fashion Forward", endDate: "2025-05-03T23:59:59Z", remainingCoupons: 28 },
                { _id: "3", code: "MEAL15", company: "Gourmet Foods", endDate: "2025-05-04T23:59:59Z", remainingCoupons: 36 },
                { _id: "4", code: "HOME10", company: "Home Essentials", endDate: "2025-05-02T23:59:59Z", remainingCoupons: 19 },
                { _id: "5", code: "BEAUTY30", company: "Beauty Basics", endDate: "2025-05-06T23:59:59Z", remainingCoupons: 22 }
            ]
        }
    };

    const mockRedemptionAnalytics = {
        timeSeriesData: [
            { date: "2025-02-01", redemptions: 25 },
            { date: "2025-02-15", redemptions: 30 },
            { date: "2025-03-01", redemptions: 28 },
            { date: "2025-03-15", redemptions: 35 },
            { date: "2025-04-01", redemptions: 42 },
            { date: "2025-04-15", redemptions: 38 }
        ],
        conversionRate: 4.2
    };

    const mockUserAnalytics = {
        userGrowth: [
            { month: "2024-11", newUsers: 120 },
            { month: "2024-12", newUsers: 135 },
            { month: "2025-01", newUsers: 180 },
            { month: "2025-02", newUsers: 165 },
            { month: "2025-03", newUsers: 210 },
            { month: "2025-04", newUsers: 190 }
        ],
        activeUsers: [
            { _id: "1", count: 45, userEmail: "john@example.com", userName: "John Doe" },
            { _id: "2", count: 38, userEmail: "sarah@example.com", userName: "Sarah Smith" },
            { _id: "3", count: 32, userEmail: "mike@example.com", userName: "Mike Johnson" },
            { _id: "4", count: 28, userEmail: "lisa@example.com", userName: "Lisa Brown" },
            { _id: "5", count: 25, userEmail: "alex@example.com", userName: "Alex Wilson" }
        ]
    };

    const mockSummaryReports = {
        couponStats: {
            totalCoupons: 1250,
            remainingCoupons: 482,
            redemptionRate: 0.614
        },
        discountStats: {
            totalDiscounts: 780,
            remainingDiscounts: 296,
            redemptionRate: 0.621
        },
        userStatusCount: [
            { status: "active", count: 2903 },
            { status: "inactive", count: 453 },
            { status: "pending", count: 100 }
        ],
        pendingRequestsCount: 27
    };

    const data = dashboardData || mockDashboardData;
    const redemptionData = redemptionAnalytics || mockRedemptionAnalytics;
    const userData = userAnalytics || mockUserAnalytics;
    const summaryData = summaryReports || mockSummaryReports;

    // Transform data for charts
    const redemptionsOverTimeData = Object.keys(data.charts.redemptionsOverTime).map(date => ({
        date,
        redemptions: data.charts.redemptionsOverTime[date]
    }));

    const userRegistrationsOverTimeData = Object.keys(data.charts.userRegistrationsOverTime).map(date => ({
        date,
        registrations: data.charts.userRegistrationsOverTime[date]
    }));

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatStatus = (status) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    // Format month name
    const formatMonth = (monthString) => {
        const [year, month] = monthString.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const formatPercentage = (value) => {
        return (value * 100).toFixed(1) + '%';
    };

    return (
        <div className= "flex flex-col min-h-screen bg-gray-50" >
        {/* Header */ }
        < header className = "bg-white shadow" >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" >
                <div className="flex justify-between items-center" >
                    <h1 className="text-3xl font-bold text-gray-900" > Admin Dashboard </h1>
                        < div className = "flex items-center space-x-4" >
                            <div className="relative" >
                                <select 
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
    value = { period }
    onChange = {(e) => setPeriod(e.target.value)
}
                >
    <option value="today" > Today </option>
        < option value = "week" > Last 7 days </option>
            < option value = "month" > Last 30 days </option>
                < option value = "quarter" > Last 3 months </option>
                    < option value = "year" > Last 12 months </option>
                        </select>
                        </div>
                        < button className = "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
                            <RefreshCcw className="w-4 h-4 mr-2" />
                                Refresh
                                </button>
                                </div>
                                </div>
                                </div>
                                </header>

{/* Tabs */ }
<div className="bg-white border-b border-gray-200" >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" >
        <nav className="flex space-x-8" aria - label="Tabs" >
            <button
              className={
    `${activeTab === 'overview'
        ? 'border-indigo-500 text-indigo-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`
}
onClick = {() => setActiveTab('overview')}
            >
    Overview
    </button>
    < button
className = {`${activeTab === 'redemptions'
        ? 'border-indigo-500 text-indigo-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
onClick = {() => setActiveTab('redemptions')}
            >
    Redemption Analytics
        </button>
        < button
className = {`${activeTab === 'users'
        ? 'border-indigo-500 text-indigo-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
onClick = {() => setActiveTab('users')}
            >
    User Analytics
        </button>
        < button
className = {`${activeTab === 'summary'
        ? 'border-indigo-500 text-indigo-600'
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
onClick = {() => setActiveTab('summary')}
            >
    Summary Reports
        </button>
        </nav>
        </div>
        </div>

{/* Main content */ }
<main className="flex-grow" >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" >
    {
        loading?(
            <div className = "flex items-center justify-center h-64" >
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"> </div>
        </div>
          ) : (
    <>
    {/* Overview Tab */ }
              {
    activeTab === 'overview' && (
        <div className="space-y-6" >
            {/* Stats Cards */ }
            < div className = "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" >
                <div className="bg-white overflow-hidden shadow rounded-lg" >
                    <div className="px-4 py-5 sm:p-6" >
                        <div className="flex items-center" >
                            <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3" >
                                <Ticket className="h-6 w-6 text-white" aria - hidden="true" />
                                    </div>
                                    < div className = "ml-5 w-0 flex-1" >
                                        <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate" > Total Coupons </dt>
                                            < dd className = "flex items-baseline" >
                                                <div className="text-2xl font-semibold text-gray-900" > { data.summary.totalCoupons } </div>
                                                    < div className = "ml-2 flex items-baseline text-sm font-semibold text-green-600" >
                                                        <span className="text-xs text-gray-500" > ({ data.summary.availableCoupons } Available)</span>
                                                            </div>
                                                            </dd>
                                                            </dl>
                                                            </div>
                                                            </div>
                                                            </div>
                                                            </div>

                                                            < div className = "bg-white overflow-hidden shadow rounded-lg" >
                                                                <div className="px-4 py-5 sm:p-6" >
                                                                    <div className="flex items-center" >
                                                                        <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3" >
                                                                            <Percent className="h-6 w-6 text-white" aria - hidden="true" />
                                                                                </div>
                                                                                < div className = "ml-5 w-0 flex-1" >
                                                                                    <dl>
                                                                                    <dt className="text-sm font-medium text-gray-500 truncate" > Total Discounts </dt>
                                                                                        < dd className = "flex items-baseline" >
                                                                                            <div className="text-2xl font-semibold text-gray-900" > { data.summary.totalDiscounts } </div>
                                                                                                < div className = "ml-2 flex items-baseline text-sm font-semibold text-green-600" >
                                                                                                    <span className="text-xs text-gray-500" > ({ data.summary.availableDiscounts } Available)</span>
                                                                                                        </div>
                                                                                                        </dd>
                                                                                                        </dl>
                                                                                                        </div>
                                                                                                        </div>
                                                                                                        </div>
                                                                                                        </div>

                                                                                                        < div className = "bg-white overflow-hidden shadow rounded-lg" >
                                                                                                            <div className="px-4 py-5 sm:p-6" >
                                                                                                                <div className="flex items-center" >
                                                                                                                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3" >
                                                                                                                        <Users className="h-6 w-6 text-white" aria - hidden="true" />
                                                                                                                            </div>
                                                                                                                            < div className = "ml-5 w-0 flex-1" >
                                                                                                                                <dl>
                                                                                                                                <dt className="text-sm font-medium text-gray-500 truncate" > Total Users </dt>
                                                                                                                                    < dd className = "flex items-baseline" >
                                                                                                                                        <div className="text-2xl font-semibold text-gray-900" > { data.summary.totalUsers } </div>
                                                                                                                                            < div className = "ml-2 flex items-baseline text-sm font-semibold text-green-600" >
                                                                                                                                                <span className="text-xs text-gray-500" > ({ data.summary.activeUsers } Active)</span>
                                                                                                                                                    </div>
                                                                                                                                                    </dd>
                                                                                                                                                    </dl>
                                                                                                                                                    </div>
                                                                                                                                                    </div>
                                                                                                                                                    </div>
                                                                                                                                                    </div>

                                                                                                                                                    < div className = "bg-white overflow-hidden shadow rounded-lg" >
                                                                                                                                                        <div className="px-4 py-5 sm:p-6" >
                                                                                                                                                            <div className="flex items-center" >
                                                                                                                                                                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3" >
                                                                                                                                                                    <ClipboardList className="h-6 w-6 text-white" aria - hidden="true" />
                                                                                                                                                                        </div>
                                                                                                                                                                        < div className = "ml-5 w-0 flex-1" >
                                                                                                                                                                            <dl>
                                                                                                                                                                            <dt className="text-sm font-medium text-gray-500 truncate" > Total Redemptions </dt>
                                                                                                                                                                                < dd className = "flex items-baseline" >
                                                                                                                                                                                    <div className="text-2xl font-semibold text-gray-900" > { data.summary.totalRedemptions } </div>
                                                                                                                                                                                        </dd>
                                                                                                                                                                                        </dl>
                                                                                                                                                                                        </div>
                                                                                                                                                                                        </div>
                                                                                                                                                                                        </div>
                                                                                                                                                                                        </div>

                                                                                                                                                                                        < div className = "bg-white overflow-hidden shadow rounded-lg" >
                                                                                                                                                                                            <div className="px-4 py-5 sm:p-6" >
                                                                                                                                                                                                <div className="flex items-center" >
                                                                                                                                                                                                    <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3" >
                                                                                                                                                                                                        <AlertCircle className="h-6 w-6 text-white" aria - hidden="true" />
                                                                                                                                                                                                            </div>
                                                                                                                                                                                                            < div className = "ml-5 w-0 flex-1" >
                                                                                                                                                                                                                <dl>
                                                                                                                                                                                                                <dt className="text-sm font-medium text-gray-500 truncate" > Pending Requests </dt>
                                                                                                                                                                                                                    < dd className = "flex items-baseline" >
                                                                                                                                                                                                                        <div className="text-2xl font-semibold text-gray-900" > { data.summary.pendingRequests } </div>
                                                                                                                                                                                                                            </dd>
                                                                                                                                                                                                                            </dl>
                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                            </div>
                                                                                                                                                                                                                            </div>

                                                                                                                                                                                                                            < div className = "bg-white overflow-hidden shadow rounded-lg" >
                                                                                                                                                                                                                                <div className="px-4 py-5 sm:p-6" >
                                                                                                                                                                                                                                    <div className="flex items-center" >
                                                                                                                                                                                                                                        <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3" >
                                                                                                                                                                                                                                            <Percent className="h-6 w-6 text-white" aria - hidden="true" />
                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                < div className = "ml-5 w-0 flex-1" >
                                                                                                                                                                                                                                                    <dl>
                                                                                                                                                                                                                                                    <dt className="text-sm font-medium text-gray-500 truncate" > Average Discount </dt>
                                                                                                                                                                                                                                                        < dd className = "flex items-baseline" >
                                                                                                                                                                                                                                                            <div className="text-2xl font-semibold text-gray-900" > { data.summary.averageDiscount.toFixed(1) } % </div>
                                                                                                                                                                                                                                                                </dd>
                                                                                                                                                                                                                                                                </dl>
                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                </div>
                                                                                                                                                                                                                                                                </div>

    {/* Charts Row 1 */ }
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2" >
        <div className="bg-white overflow-hidden shadow rounded-lg" >
            <div className="px-4 py-5 sm:p-6" >
                <h3 className="text-lg font-medium text-gray-900" > Redemptions Over Time </h3>
                    < div className = "mt-5" style = {{ height: 300 }
}>
    <ResponsiveContainer width="100%" height = "100%" >
        <LineChart
                              data={ redemptionsOverTimeData }
margin = {{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
    <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter = { formatDate } />
            <YAxis />
            < Tooltip labelFormatter = { formatDate } />
                <Legend />
                < Line type = "monotone" dataKey = "redemptions" stroke = "#8884d8" activeDot = {{ r: 8 }} />
                    </LineChart>
                    </ResponsiveContainer>
                    </div>
                    </div>
                    </div>

                    < div className = "bg-white overflow-hidden shadow rounded-lg" >
                        <div className="px-4 py-5 sm:p-6" >
                            <h3 className="text-lg font-medium text-gray-900" > User Registrations </h3>
                                < div className = "mt-5" style = {{ height: 300 }}>
                                    <ResponsiveContainer width="100%" height = "100%" >
                                        <LineChart
                              data={ userRegistrationsOverTimeData }
margin = {{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
    <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter = { formatDate } />
            <YAxis />
            < Tooltip labelFormatter = { formatDate } />
                <Legend />
                < Line type = "monotone" dataKey = "registrations" stroke = "#82ca9d" activeDot = {{ r: 8 }} />
                    </LineChart>
                    </ResponsiveContainer>
                    </div>
                    </div>
                    </div>
                    </div>

{/* Charts Row 2 */ }
<div className="grid grid-cols-1 gap-5 lg:grid-cols-2" >
    <div className="bg-white overflow-hidden shadow rounded-lg" >
        <div className="px-4 py-5 sm:p-6" >
            <h3 className="text-lg font-medium text-gray-900" > Redemptions by Category </h3>
                < div className = "mt-5" style = {{ height: 300 }}>
                    <ResponsiveContainer width="100%" height = "100%" >
                        <BarChart
                              data={ data.charts.redemptionsByCategory }
margin = {{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
    <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
            <YAxis />
            < Tooltip />
            <Legend />
            < Bar dataKey = "count" name = "Redemptions" fill = "#8884d8" >
            {
                data.charts.redemptionsByCategory.map((entry, index) => (
                    <Cell key= {`cell-${index}`} fill = { COLORS[index % COLORS.length]} />
                                ))}
</Bar>
    </BarChart>
    </ResponsiveContainer>
    </div>
    </div>
    </div>

    < div className = "bg-white overflow-hidden shadow rounded-lg" >
        <div className="px-4 py-5 sm:p-6" >
            <h3 className="text-lg font-medium text-gray-900" > Monthly Redemption Trends </h3>
                < div className = "mt-5" style = {{ height: 300 }}>
                    <ResponsiveContainer width="100%" height = "100%" >
                        <LineChart
                              data={ data.charts.monthlyRedemptionData }
margin = {{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
    <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tickFormatter = { formatMonth } />
            <YAxis />
            < Tooltip labelFormatter = { formatMonth } />
                <Legend />
                < Line type = "monotone" dataKey = "count" name = "Redemptions" stroke = "#8884d8" activeDot = {{ r: 8 }} />
                    </LineChart>
                    </ResponsiveContainer>
                    </div>
                    </div>
                    </div>
                    </div>

{/* Charts Row 3 */ }
<div className="grid grid-cols-1 gap-5 lg:grid-cols-3" >
    <div className="bg-white overflow-hidden shadow rounded-lg" >
        <div className="px-4 py-5 sm:p-6" >
            <h3 className="text-lg font-medium text-gray-900" > Redemptions by Type </h3>
                < div className = "mt-5" style = {{ height: 250 }}>
                    <ResponsiveContainer width="100%" height = "100%" >
                        <PieChart>
                        <Pie
                                data={ data.charts.redemptionsByType }
cx = "50%"
cy = "50%"
labelLine = { false}
outerRadius = { 80}
fill = "#8884d8"
dataKey = "count"
nameKey = "type"
label = {({ type, percent }) => `${type}: ${(percent * 100).toFixed(0)}%`}
                              >
{
    data.charts.redemptionsByType.map((entry, index) => (
        <Cell key= {`cell-${index}`} fill = { COLORS[index % COLORS.length]} />
                                ))}
</Pie>
    < Tooltip formatter = {(value) => [value, 'Count']} />
        < Legend />
        </PieChart>
        </ResponsiveContainer>
        </div>
        </div>
        </div>

        < div className = "bg-white overflow-hidden shadow rounded-lg" >
            <div className="px-4 py-5 sm:p-6" >
                <h3 className="text-lg font-medium text-gray-900" > Users by Category </h3>
                    < div className = "mt-5" style = {{ height: 250 }}>
                        <ResponsiveContainer width="100%" height = "100%" >
                            <PieChart>
                            <Pie
                                data={ data.charts.usersByCategory }
cx = "50%"
cy = "50%"
labelLine = { false}
outerRadius = { 80}
fill = "#8884d8"
dataKey = "count"
nameKey = "category"
label = {({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                              >
{
    data.charts.usersByCategory.map((entry, index) => (
        <Cell key= {`cell-${index}`} fill = { COLORS[index % COLORS.length]} />
                                ))}
</Pie>
    < Tooltip formatter = {(value) => [value, 'Count']} />
        < Legend />
        </PieChart>
        </ResponsiveContainer>
        </div>
        </div>
        </div>

        < div className = "bg-white overflow-hidden shadow rounded-lg" >
            <div className="px-4 py-5 sm:p-6" >
                <h3 className="text-lg font-medium text-gray-900" > Redemption Status </h3>
                    < div className = "mt-5" style = {{ height: 250 }}>
                        <ResponsiveContainer width="100%" height = "100%" >
                            <PieChart>
                            <Pie
                                data={ data.charts.redemptionStatusDistribution }
cx = "50%"
cy = "50%"
labelLine = { false}
outerRadius = { 80}
fill = "#8884d8"
dataKey = "count"
nameKey = "status"
label = {({ status, percent }) => `${formatStatus(status)}: ${(percent * 100).toFixed(0)}%`}
                              >
{
    data.charts.redemptionStatusDistribution.map((entry, index) => (
        <Cell key= {`cell-${index}`} fill = { COLORS[index % COLORS.length]} />
                                ))}
</Pie>
    < Tooltip formatter = {(value) => [value, 'Count']} />
        < Legend />
        </PieChart>
        </ResponsiveContainer>
        </div>
        </div>
        </div>
        </div>

{/* Recent Data */ }
<div className="grid grid-cols-1 gap-5 lg:grid-cols-2" >
    <div className="bg-white overflow-hidden shadow rounded-lg" >
        <div className="px-4 py-5 sm:p-6" >
            <h3 className="text-lg font-medium text-gray-900" > Recent Redemptions </h3>
                < div className = "mt-5" >
                    <div className="flex flex-col" >
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8" >
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8" >
                                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg" >
                                    <table className="min-w-full divide-y divide-gray-200" >
                                        <thead className="bg-gray-50" >
                                            <tr>
                                            <th scope="col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                                                Code
                                                </th>
                                                < th scope = "col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                                                    Company
                                                    </th>
                                                    < th scope = "col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                                                        User
                                                        </th>
                                                        < th scope = "col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                                                            Date
                                                            </th>
                                                            < th scope = "col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                                                                Status
                                                                </th>
                                                                </tr>
                                                                </thead>
                                                                < tbody className = "bg-white divide-y divide-gray-200" >
                                                                {
                                                                    data.recentData.recentRedemptions.map((redemption) => (
                                                                        <tr key= { redemption._id } >
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" >
                                                                        { redemption.couponCode }
                                                                        </td>
                                                                    < td className = "px-6 py-4 whitespace-nowrap text-sm text-gray-500" >
                                                                    { redemption.company }
                                                                    </td>
                                                                    < td className = "px-6 py-4 whitespace-nowrap text-sm text-gray-500" >
                                                                    { redemption.user }
                                                                    </td>
                                                                    < td className = "px-6 py-4 whitespace-nowrap text-sm text-gray-500" >
                                                                    { new Date(redemption.redeemedAt).toLocaleDateString() }
                                                                    </td>
                                                                    < td className = "px-6 py-4 whitespace-nowrap" >
                                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                              ${redemption.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                            redemption.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`} >
                                                                    { formatStatus(redemption.status) }
                                                                    </span>
                                                                    </td>
                                                                    </tr>
                                      ))}
</tbody>
    </table>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>
    </div>

    < div className = "bg-white overflow-hidden shadow rounded-lg" >
        <div className="px-4 py-5 sm:p-6" >
            <h3 className="text-lg font-medium text-gray-900" > Expiring Soon Coupons </h3>
                < div className = "mt-5" >
                    <div className="flex flex-col" >
                        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8" >
                            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8" >
                                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg" >
                                    <table className="min-w-full divide-y divide-gray-200" >
                                        <thead className="bg-gray-50" >
                                            <tr>
                                            <th scope="col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                                                Code
                                                </th>
                                                < th scope = "col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                                                    Company
                                                    </th>
                                                    < th scope = "col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                                                        Expiry Date
                                                            </th>
                                                            < th scope = "col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                                                                Remaining
                                                                </th>
                                                                </tr>
                                                                </thead>
                                                                < tbody className = "bg-white divide-y divide-gray-200" >
                                                                {
                                                                    data.recentData.expiringSoonCoupons.map((coupon) => (
                                                                        <tr key= { coupon._id } >
                                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" >
                                                                        { coupon.code }
                                                                        </td>
                                                                    < td className = "px-6 py-4 whitespace-nowrap text-sm text-gray-500" >
                                                                    { coupon.company }
                                                                    </td>
                                                                    < td className = "px-6 py-4 whitespace-nowrap text-sm text-gray-500" >
                                                                    { new Date(coupon.endDate).toLocaleDateString() }
                                                                    </td>
                                                                    < td className = "px-6 py-4 whitespace-nowrap text-sm text-gray-500" >
                                                                    { coupon.remainingCoupons }
                                                                    </td>
                                                                    </tr>
                                                                    ))
                                                                }
                                                                    </tbody>
                                                                    </table>
                                                                    </div>
                                                                    </div>
                                                                    </div>
                                                                    </div>
                                                                    </div>
                                                                    </div>
                                                                    </div>
                                                                    </div>
                                                                    </div>
              )}

{/* Redemption Analytics Tab */ }
{
    activeTab === 'redemptions' && (
        <div className="space-y-6" >
            {/* Date Range Filter */ }
            < div className = "bg-white overflow-hidden shadow rounded-lg" >
                <div className="px-4 py-5 sm:p-6" >
                    <h3 className="text-lg font-medium text-gray-900" > Redemption Analytics </h3>
                        < div className = "mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3" >
                            <div>
                            <label htmlFor="start-date" className = "block text-sm font-medium text-gray-700" > Start Date </label>
                                < input
    type = "date"
    id = "start-date"
    className = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    value = { dateRange.startDate }
    onChange = {(e) => setDateRange({ ...dateRange, startDate: e.target.value })
}
                          />
    </div>
    < div >
    <label htmlFor="end-date" className = "block text-sm font-medium text-gray-700" > End Date </label>
        < input
type = "date"
id = "end-date"
className = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
value = { dateRange.endDate }
onChange = {(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                          />
    </div>
    < div >
    <label htmlFor="filter" className = "block text-sm font-medium text-gray-700" > Additional Filters </label>
        < div className = "mt-1 relative rounded-md shadow-sm" >
            <select
                              id="filter"
className = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    >
    <option value="" > All Categories </option>
{
    data.charts.redemptionsByCategory.map((category) => (
        <option key= { category.category } value = { category.category } > { category.category } </option>
    ))
}
</select>
    < div className = "absolute inset-y-0 right-0 flex items-center" >
        <button className="h-full py-0 pl-2 pr-3 text-gray-500" >
            <Filter className="h-4 w-4" />
                </button>
                </div>
                </div>
                </div>
                </div>
                </div>
                </div>

{/* Redemption Time Series */ }
<div className="bg-white overflow-hidden shadow rounded-lg" >
    <div className="px-4 py-5 sm:p-6" >
        <h3 className="text-lg font-medium text-gray-900" > Redemption Time Series </h3>
            < div className = "mt-5" style = {{ height: 400 }}>
                <ResponsiveContainer width="100%" height = "100%" >
                    <LineChart
                            data={ redemptionData.timeSeriesData }
margin = {{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
    <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter = { formatDate } />
            <YAxis />
            < Tooltip labelFormatter = { formatDate } />
                <Legend />
                < Line type = "monotone" dataKey = "redemptions" stroke = "#8884d8" activeDot = {{ r: 8 }} />
                    </LineChart>
                    </ResponsiveContainer>
                    </div>
                    </div>
                    </div>

{/* Redemption Stats */ }
<div className="grid grid-cols-1 gap-5 sm:grid-cols-2" >
    <div className="bg-white overflow-hidden shadow rounded-lg" >
        <div className="px-4 py-5 sm:p-6" >
            <h3 className="text-lg font-medium text-gray-900" > Conversion Rate </h3>
                < div className = "mt-5" >
                    <div className="flex items-baseline" >
                        <div className="text-5xl font-semibold text-indigo-600" > { redemptionData.conversionRate } % </div>
                            < div className = "ml-2 text-sm text-gray-500" > of viewed offers are redeemed </div>
                                </div>
                                < div className = "mt-4" >
                                    <div className="relative pt-1" >
                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200" >
                                            <div style={ { width: `${redemptionData.conversionRate}%` } } className = "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500" > </div>
                                                </div>
                                                </div>
                                                </div>
                                                </div>
                                                </div>
                                                </div>

                                                < div className = "bg-white overflow-hidden shadow rounded-lg" >
                                                    <div className="px-4 py-5 sm:p-6" >
                                                        <h3 className="text-lg font-medium text-gray-900" > Redemptions By Company </h3>
                                                            < div className = "mt-5" style = {{ height: 300 }}>
                                                                <ResponsiveContainer width="100%" height = "100%" >
                                                                    <BarChart
                              data={ data.charts.redemptionsByCompany }
layout = "vertical"
margin = {{ top: 5, right: 30, left: 100, bottom: 5 }}
                            >
    <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
            <YAxis dataKey="company" type = "category" scale = "band" />
                <Tooltip />
                < Legend />
                <Bar dataKey="count" name = "Redemptions" fill = "#8884d8" >
                {
                    data.charts.redemptionsByCompany.map((entry, index) => (
                        <Cell key= {`cell-${index}`} fill = { COLORS[index % COLORS.length]} />
                                ))}
</Bar>
    </BarChart>
    </ResponsiveContainer>
    </div>
    </div>
    </div>
    </div>
    </div>
              )}

{/* User Analytics Tab */ }
{
    activeTab === 'users' && (
        <div className="space-y-6" >
            {/* User Growth Chart */ }
            < div className = "bg-white overflow-hidden shadow rounded-lg" >
                <div className="px-4 py-5 sm:p-6" >
                    <h3 className="text-lg font-medium text-gray-900" > User Growth </h3>
                        < div className = "mt-5" style = {{ height: 400 }
}>
    <ResponsiveContainer width="100%" height = "100%" >
        <BarChart
                            data={ userData.userGrowth }
margin = {{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
    <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tickFormatter = { formatMonth } />
            <YAxis />
            < Tooltip labelFormatter = { formatMonth } />
                <Legend />
                < Bar dataKey = "newUsers" name = "New Users" fill = "#82ca9d" />
                    </BarChart>
                    </ResponsiveContainer>
                    </div>
                    </div>
                    </div>

{/* User Distribution */ }
<div className="grid grid-cols-1 gap-5 sm:grid-cols-2" >
    <div className="bg-white overflow-hidden shadow rounded-lg" >
        <div className="px-4 py-5 sm:p-6" >
            <h3 className="text-lg font-medium text-gray-900" > Users by Category </h3>
                < div className = "mt-5" style = {{ height: 300 }}>
                    <ResponsiveContainer width="100%" height = "100%" >
                        <PieChart>
                        <Pie
                                data={ data.charts.usersByCategory }
cx = "50%"
cy = "50%"
labelLine = { false}
outerRadius = { 80}
fill = "#8884d8"
dataKey = "count"
nameKey = "category"
label = {({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
                              >
{
    data.charts.usersByCategory.map((entry, index) => (
        <Cell key= {`cell-${index}`} fill = { COLORS[index % COLORS.length]} />
                                ))}
</Pie>
    < Tooltip formatter = {(value) => [value, 'Count']} />
        < Legend />
        </PieChart>
        </ResponsiveContainer>
        </div>
        </div>
        </div>

        < div className = "bg-white overflow-hidden shadow rounded-lg" >
            <div className="px-4 py-5 sm:p-6" >
                <h3 className="text-lg font-medium text-gray-900" > Users by Service </h3>
                    < div className = "mt-5" style = {{ height: 300 }}>
                        <ResponsiveContainer width="100%" height = "100%" >
                            <PieChart>
                            <Pie
                                data={ data.charts.usersByService }
cx = "50%"
cy = "50%"
labelLine = { false}
outerRadius = { 80}
fill = "#8884d8"
dataKey = "count"
nameKey = "service"
label = {({ service, percent }) => `${service}: ${(percent * 100).toFixed(0)}%`}
                              >
{
    data.charts.usersByService.map((entry, index) => (
        <Cell key= {`cell-${index}`} fill = { COLORS[index % COLORS.length]} />
                                ))}
</Pie>
    < Tooltip formatter = {(value) => [value, 'Count']} />
        < Legend />
        </PieChart>
        </ResponsiveContainer>
        </div>
        </div>
        </div>
        </div>

{/* Most Active Users */ }
<div className="bg-white overflow-hidden shadow rounded-lg" >
    <div className="px-4 py-5 sm:p-6" >
        <h3 className="text-lg font-medium text-gray-900" > Most Active Users </h3>
            < div className = "mt-5" >
                <div className="flex flex-col" >
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8" >
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8" >
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg" >
                                <table className="min-w-full divide-y divide-gray-200" >
                                    <thead className="bg-gray-50" >
                                        <tr>
                                        <th scope="col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                                            User
                                            </th>
                                            < th scope = "col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                                                Email
                                                </th>
                                                < th scope = "col" className = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" >
                                                    Redemptions
                                                    </th>
                                                    </tr>
                                                    </thead>
                                                    < tbody className = "bg-white divide-y divide-gray-200" >
                                                    {
                                                        userData.activeUsers.map((user) => (
                                                            <tr key= { user._id } >
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" >
                                                            { user.userName }
                                                            </td>
                                                        < td className = "px-6 py-4 whitespace-nowrap text-sm text-gray-500" >
                                                        { user.userEmail }
                                                        </td>
                                                        < td className = "px-6 py-4 whitespace-nowrap" >
                                                        <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800" >
                                                        { user.count }
                                                        </span>
                                                        </td>
                                                        </tr>
                                                        ))
                                                    }
                                                        </tbody>
                                                        </table>
                                                        </div>
                                                        </div>
                                                        </div>
                                                        </div>
                                                        </div>
                                                        </div>
                                                        </div>
                                                        </div>
              )}

{/* Summary Reports Tab */ }
{
    activeTab === 'summary' && (
        <div className="space-y-6" >
            {/* Coupon and Discount Stats */ }
            < div className = "grid grid-cols-1 gap-5 sm:grid-cols-2" >
                <div className="bg-white overflow-hidden shadow rounded-lg" >
                    <div className="px-4 py-5 sm:p-6" >
                        <h3 className="text-lg font-medium text-gray-900" > Coupon Statistics </h3>
                            < dl className = "mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2" >
                                <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6" >
                                    <dt className="text-sm font-medium text-gray-500 truncate" > Total Coupons </dt>
                                        < dd className = "mt-1 text-3xl font-semibold text-gray-900" > { summaryData.couponStats.totalCoupons } </dd>
                                            </div>
                                            < div className = "px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6" >
                                                <dt className="text-sm font-medium text-gray-500 truncate" > Remaining </dt>
                                                    < dd className = "mt-1 text-3xl font-semibold text-gray-900" > { summaryData.couponStats.remainingCoupons } </dd>
                                                        </div>
                                                        < div className = "px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6 col-span-2" >
                                                            <dt className="text-sm font-medium text-gray-500 truncate" > Redemption Rate </dt>
                                                                < dd className = "mt-1 text-3xl font-semibold text-gray-900" > { formatPercentage(summaryData.couponStats.redemptionRate) } </dd>
                                                                    < div className = "mt-2 relative pt-1" >
                                                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200" >
                                                                            <div style={ { width: formatPercentage(summaryData.couponStats.redemptionRate) } } className = "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500" > </div>
                                                                                </div>
                                                                                </div>
                                                                                </div>
                                                                                </dl>
                                                                                </div>
                                                                                </div>

                                                                                < div className = "bg-white overflow-hidden shadow rounded-lg" >
                                                                                    <div className="px-4 py-5 sm:p-6" >
                                                                                        <h3 className="text-lg font-medium text-gray-900" > Discount Statistics </h3>
                                                                                            < dl className = "mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2" >
                                                                                                <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6" >
                                                                                                    <dt className="text-sm font-medium text-gray-500 truncate" > Total Discounts </dt>
                                                                                                        < dd className = "mt-1 text-3xl font-semibold text-gray-900" > { summaryData.discountStats.totalDiscounts } </dd>
                                                                                                            </div>
                                                                                                            < div className = "px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6" >
                                                                                                                <dt className="text-sm font-medium text-gray-500 truncate" > Remaining </dt>
                                                                                                                    < dd className = "mt-1 text-3xl font-semibold text-gray-900" > { summaryData.discountStats.remainingDiscounts } </dd>
                                                                                                                        </div>
                                                                                                                        < div className = "px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6 col-span-2" >
                                                                                                                            <dt className="text-sm font-medium text-gray-500 truncate" > Redemption Rate </dt>
                                                                                                                                < dd className = "mt-1 text-3xl font-semibold text-gray-900" > { formatPercentage(summaryData.discountStats.redemptionRate) } </dd>
                                                                                                                                    < div className = "mt-2 relative pt-1" >
                                                                                                                                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200" >
                                                                                                                                            <div style={ { width: formatPercentage(summaryData.discountStats.redemptionRate) } } className = "shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500" > </div>
                                                                                                                                                </div>
                                                                                                                                                </div>
                                                                                                                                                </div>
                                                                                                                                                </dl>
                                                                                                                                                </div>
                                                                                                                                                </div>
                                                                                                                                                </div>

    {/* User Status and Pending Requests */ }
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-3" >
        <div className="bg-white overflow-hidden shadow rounded-lg sm:col-span-2" >
            <div className="px-4 py-5 sm:p-6" >
                <h3 className="text-lg font-medium text-gray-900" > User Status Distribution </h3>
                    < div className = "mt-5" style = {{ height: 300 }
}>
    <ResponsiveContainer width="100%" height = "100%" >
        <BarChart
                              data={ summaryData.userStatusCount }
margin = {{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
    <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="status" />
            <YAxis />
            < Tooltip />
            <Legend />
            < Bar dataKey = "count" name = "Users" fill = "#8884d8" >
            {
                summaryData.userStatusCount.map((entry, index) => (
                    <Cell key= {`cell-${index}`} fill = { COLORS[index % COLORS.length]} />
                                ))}
</Bar>
    </BarChart>
    </ResponsiveContainer>
    </div>
    </div>
    </div>

    < div className = "bg-white overflow-hidden shadow rounded-lg" >
        <div className="px-4 py-5 sm:p-6" >
            <h3 className="text-lg font-medium text-gray-900" > Pending Requests </h3>
                < div className = "mt-5 flex flex-col items-center justify-center h-full" >
                    <div className="text-5xl font-bold text-indigo-600" > { summaryData.pendingRequestsCount } </div>
                        < div className = "mt-3 text-sm text-gray-500" > requests need attention </div>
                            < button className = "mt-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" >
                                View All Requests
                                    </button>
                                    </div>
                                    </div>
                                    </div>
                                    </div>
                                    </div>
              )}