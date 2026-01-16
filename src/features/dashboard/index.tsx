import React from 'react';
import {
  Users,
  Ticket,
  ClipboardList,
  Building2,
  Trophy,
  MapPin,
  Shield,
  TrendingUp,
  User,
  Globe,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

// Static data for the dashboard
const dashboardStats = {
  totalUsers: 2847,
  newUsersThisMonth: 245,
  usersByGender: [
    { gender: 'Male', count: 1698, percentage: 59.6 },
    { gender: 'Female', count: 1032, percentage: 36.3 },
    { gender: 'Other', count: 117, percentage: 4.1 },
  ],
  usersByCountry: [
    { country: 'Egypt', count: 1523, flag: '🇪🇬' },
    { country: 'Saudi Arabia', count: 542, flag: '🇸🇦' },
    { country: 'UAE', count: 387, flag: '🇦🇪' },
    { country: 'Qatar', count: 245, flag: '🇶🇦' },
    { country: 'Kuwait', count: 150, flag: '🇰🇼' },
  ],
  totalSuppliers: 48,
  totalSports: 12,
  totalStadiums: 25,
  totalClubs: 64,
  totalTickets: 8547,
  availableTickets: 3421,
  soldTickets: 5126,
  totalRequests: 1842,
  pendingRequests: 284,
  approvedRequests: 1398,
  rejectedRequests: 160,
};

const recentRequests = [
  {
    id: '1',
    userName: 'Ahmed Hassan',
    userEmail: 'ahmed.hassan@example.com',
    match: 'Manchester United vs Real Madrid',
    ticketCount: 2,
    totalAmount: 300,
    status: 'pending',
    requestedAt: '2024-01-22T15:30:00Z',
  },
  {
    id: '2',
    userName: 'Sarah Johnson',
    userEmail: 'sarah.j@example.com',
    match: 'FC Barcelona vs Bayern Munich',
    ticketCount: 4,
    totalAmount: 480,
    status: 'approved',
    requestedAt: '2024-01-22T14:15:00Z',
  },
  {
    id: '3',
    userName: 'Mohammed Al-Rashid',
    userEmail: 'mohammed.rashid@example.com',
    match: 'Liverpool FC vs Manchester United',
    ticketCount: 1,
    totalAmount: 150,
    status: 'pending',
    requestedAt: '2024-01-22T13:45:00Z',
  },
  {
    id: '4',
    userName: 'Elena Rodriguez',
    userEmail: 'elena.r@example.com',
    match: 'Real Madrid vs FC Barcelona',
    ticketCount: 3,
    totalAmount: 450,
    status: 'rejected',
    requestedAt: '2024-01-22T12:20:00Z',
  },
  {
    id: '5',
    userName: 'Yuki Tanaka',
    userEmail: 'yuki.t@example.com',
    match: 'Bayern Munich vs Liverpool FC',
    ticketCount: 2,
    totalAmount: 280,
    status: 'approved',
    requestedAt: '2024-01-22T11:00:00Z',
  },
];

const monthlyTicketSales = [
  { month: 'Jan', sold: 456, revenue: 68400 },
  { month: 'Feb', sold: 523, revenue: 78450 },
  { month: 'Mar', sold: 612, revenue: 91800 },
  { month: 'Apr', sold: 589, revenue: 88350 },
  { month: 'May', sold: 678, revenue: 101700 },
  { month: 'Jun', sold: 734, revenue: 110100 },
];

const topMatches = [
  { match: 'Man United vs Real Madrid', tickets: 487, revenue: 73050 },
  { match: 'Barcelona vs Bayern Munich', tickets: 456, revenue: 68400 },
  { match: 'Liverpool vs Man United', tickets: 423, revenue: 63450 },
  { match: 'Real Madrid vs Barcelona', tickets: 398, revenue: 59700 },
  { match: 'Bayern vs Liverpool', tickets: 367, revenue: 55050 },
];

const COLORS = ['#00ff88', '#0ea5e9', '#a855f7'];

const StatsCard = ({ title, value, subtitle, icon: Icon, trend, variant }) => {
  const variantClasses = {
    blue: 'bg-blue-600/10 text-blue-400',
    green: 'bg-[#00ff88]/10 text-[#00ff88]',
    purple: 'bg-purple-600/10 text-purple-400',
    yellow: 'bg-yellow-600/10 text-yellow-400',
    red: 'bg-red-600/10 text-red-400',
    cyan: 'bg-cyan-600/10 text-cyan-400',
  };

  return (
    <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6 hover:border-[#00ff88]/50 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
          {trend && <p className="text-xs font-medium text-[#00ff88] mt-1">{trend}</p>}
        </div>
        <div className={`p-3 rounded-lg ${variantClasses[variant]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-600/20 text-green-400 border border-green-600/30';
      case 'rejected':
        return 'bg-red-600/20 text-red-400 border border-red-600/30';
      case 'pending':
        return 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30';
      default:
        return 'bg-gray-600/20 text-gray-400 border border-gray-600/30';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1929] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your platform overview.</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Users"
            value={dashboardStats.totalUsers.toLocaleString()}
            subtitle={`${dashboardStats.newUsersThisMonth} new this month`}
            icon={Users}
            trend="↑ 12% from last month"
            variant="blue"
          />
          <StatsCard
            title="Total Tickets"
            value={dashboardStats.totalTickets.toLocaleString()}
            subtitle={`${dashboardStats.availableTickets} available`}
            icon={Ticket}
            trend={`${dashboardStats.soldTickets} sold`}
            variant="green"
          />
          <StatsCard
            title="Booking Requests"
            value={dashboardStats.totalRequests.toLocaleString()}
            subtitle={`${dashboardStats.pendingRequests} pending`}
            icon={ClipboardList}
            trend="↑ 8% from last month"
            variant="purple"
          />
          <StatsCard
            title="Total Stadiums"
            value={dashboardStats.totalStadiums}
            subtitle={`${dashboardStats.totalClubs} clubs registered`}
            icon={Building2}
            variant="cyan"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatsCard
            title="Suppliers"
            value={dashboardStats.totalSuppliers}
            subtitle="Active suppliers"
            icon={Shield}
            variant="yellow"
          />
          <StatsCard
            title="Sports"
            value={dashboardStats.totalSports}
            subtitle="Available sports"
            icon={Trophy}
            variant="purple"
          />
          <StatsCard
            title="Clubs"
            value={dashboardStats.totalClubs}
            subtitle="Registered clubs"
            icon={MapPin}
            variant="blue"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users by Gender */}
          <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Users by Gender</h3>
              <p className="text-sm text-gray-400 mt-1">Distribution of registered users</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardStats.usersByGender}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ gender, percentage }) => `${gender}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {dashboardStats.usersByGender.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111d2d',
                    border: '1px solid #1e3a52',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {dashboardStats.usersByGender.map((item, index) => (
                <div key={item.gender} className="text-center p-2 bg-[#0a1929] rounded-lg border border-[#1e3a52]">
                  <p className="text-xs text-gray-400">{item.gender}</p>
                  <p className="text-lg font-bold" style={{ color: COLORS[index] }}>
                    {item.count}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Users by Country */}
          <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Users by Country</h3>
              <p className="text-sm text-gray-400 mt-1">Top 5 countries</p>
            </div>
            <div className="space-y-4">
              {dashboardStats.usersByCountry.map((item, index) => {
                const percentage = ((item.count / dashboardStats.totalUsers) * 100).toFixed(1);
                return (
                  <div key={item.country}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.flag}</span>
                        <span className="text-sm font-medium text-white">{item.country}</span>
                      </div>
                      <span className="text-sm font-bold text-[#00ff88]">{item.count}</span>
                    </div>
                    <div className="w-full bg-[#0a1929] rounded-full h-2">
                      <div
                        className="bg-[#00ff88] h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{percentage}% of total users</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Monthly Ticket Sales Chart */}
        <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Monthly Ticket Sales</h3>
            <p className="text-sm text-gray-400 mt-1">Tickets sold and revenue over time</p>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyTicketSales} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a52" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis yAxisId="left" stroke="#9ca3af" />
              <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111d2d',
                  border: '1px solid #1e3a52',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="sold" fill="#00ff88" radius={[8, 8, 0, 0]} name="Tickets Sold" />
              <Bar yAxisId="right" dataKey="revenue" fill="#0ea5e9" radius={[8, 8, 0, 0]} name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Request Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400">Pending Requests</h3>
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <p className="text-3xl font-bold text-white">{dashboardStats.pendingRequests}</p>
            <p className="text-xs text-gray-500 mt-2">Awaiting review</p>
          </div>
          <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400">Approved Requests</h3>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-3xl font-bold text-white">{dashboardStats.approvedRequests}</p>
            <p className="text-xs text-gray-500 mt-2">
              {((dashboardStats.approvedRequests / dashboardStats.totalRequests) * 100).toFixed(1)}% approval rate
            </p>
          </div>
          <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400">Rejected Requests</h3>
              <XCircle className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-3xl font-bold text-white">{dashboardStats.rejectedRequests}</p>
            <p className="text-xs text-gray-500 mt-2">
              {((dashboardStats.rejectedRequests / dashboardStats.totalRequests) * 100).toFixed(1)}% rejection rate
            </p>
          </div>
        </div>

        {/* Bottom Section - Recent Requests and Top Matches */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Booking Requests */}
          <div className="lg:col-span-2 bg-[#111d2d] border border-[#1e3a52] rounded-lg overflow-hidden">
            <div className="p-6 border-b border-[#1e3a52]">
              <h3 className="text-lg font-semibold text-white">Recent Booking Requests</h3>
              <p className="text-sm text-gray-400 mt-1">Latest ticket booking requests</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0a1929] border-b border-[#1e3a52]">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#00ff88] uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#00ff88] uppercase tracking-wider">
                      Match
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#00ff88] uppercase tracking-wider">
                      Tickets
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#00ff88] uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#00ff88] uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map((request) => (
                    <tr key={request.id} className="border-b border-[#1e3a52] hover:bg-[#0a1929] transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-white">{request.userName}</p>
                          <p className="text-xs text-gray-400">{request.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-xs">
                        <div className="line-clamp-2">{request.match}</div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-white">{request.ticketCount}</td>
                      <td className="px-6 py-4 text-sm font-bold text-[#00ff88]">${request.totalAmount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Matches by Sales */}
          <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Matches</h3>
            <p className="text-sm text-gray-400 mb-4">By ticket sales</p>
            <div className="space-y-3">
              {topMatches.map((match, index) => (
                <div
                  key={index}
                  className="p-3 bg-[#0a1929] rounded-lg border border-[#1e3a52] hover:border-[#00ff88]/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-white line-clamp-2 flex-1">{match.match}</p>
                    <span className="text-xs font-bold text-[#00ff88] ml-2">#{index + 1}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">{match.tickets} tickets</span>
                    <span className="text-[#00ff88] font-semibold">${match.revenue.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}