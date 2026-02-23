import React from 'react';
import {
  Users,
  Ticket,
  ClipboardList,
  Building2,
  Trophy,
  MapPin,
  Shield,
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
} from 'recharts';

import { useGetDashboardQuery } from '../../store/api/dashboardApi';

// Dashboard is fully dynamic — static fixtures removed; UI shows empty/no-data states when API returns nothing.

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

  // --- Dashboard API (dynamic data)
  const { data: dashboardResp, isLoading, isError, refetch } = useGetDashboardQuery();
  const api = dashboardResp?.data;

  // Derived dashboard values (API-driven; default to 0 / empty arrays when missing)
  const dashboardStats = {
    totalUsers: Number(api?.overview_stats?.total_users?.value) || 0,
    newUsersThisMonth: 0,
    totalTickets: Number(api?.overview_stats?.total_tickets?.value) || 0,
    availableTickets: 0,
    soldTickets: 0,
    totalRequests: api?.requests_statistics
      ? Number(api.requests_statistics.pending_requests?.count || 0) + Number(api.requests_statistics.approved_requests?.count || 0) + Number(api.requests_statistics.registered_engagements?.count || 0)
      : 0,
    pendingRequests: Number(api?.requests_statistics?.pending_requests?.count) || 0,
    approvedRequests: Number(api?.requests_statistics?.approved_requests?.count) || 0,
    rejectedRequests: 0,
    totalStadiums: Number(api?.overview_stats?.total_stadiums?.value) || 0,
    totalClubs: Number(api?.metadata?.clubs) || 0,
    totalSuppliers: Number(api?.metadata?.suppliers) || 0,
    totalSports: Number(api?.metadata?.sports) || 0,
    usersByGender: api?.users_by_gender?.distribution?.map((d) => ({ gender: String(d.gender).charAt(0).toUpperCase() + String(d.gender).slice(1), count: Number(d.count) || 0, percentage: Number(d.percentage) || 0 })) || [],
    usersByCountry: api?.users_by_country?.countries?.map((c) => ({ country: c.name, count: Number(c.count) || 0, flag: '' })) || [],
  };

  const monthlyTicketSales = api?.monthly_ticket_sales?.data?.map((m) => ({ month: m.month, sold: Number(m.tickets_sold) || 0, revenue: Number(m.revenue) || 0 })) || [];

  const recentRequests = api?.recent_booking_requests?.bookings?.map((b, idx) => ({
    id: b.id || `api-${idx}`,
    userName: b.user_name || b.customer_name || b.customer || '',
    userEmail: b.user_email || b.email || '',
    match: b.match || b.event || '',
    ticketCount: Number(b.tickets || b.ticket_count) || 0,
    totalAmount: Number(b.total_amount || b.amount) || 0,
    status: b.status || 'pending',
    requestedAt: b.requested_at || b.created_at || '',
  })) || [];

  const topMatches = api?.top_matches?.matches?.map((m) => ({ match: m.match || m.title || m.name || '', tickets: Number(m.tickets || m.total_tickets) || 0, revenue: Number(m.revenue || m.total_revenue) || 0 })) || []; 

  return (
    <div className="min-h-screen bg-[#0a1929] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">{api?.welcome_message || "Welcome back! Here's your platform overview."}</p>
          {isLoading && <div className="text-sm text-gray-400 mt-2">Loading dashboard...</div>}
          {isError && (
            <div className="text-sm text-red-400 mt-2 flex items-center gap-2">
              <span>Failed to load dashboard data.</span>
              <button onClick={() => refetch()} className="underline">Retry</button>
            </div>
          )}
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
            trend
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
            trend
            variant="yellow"
          />
          <StatsCard
            title="Sports"
            value={dashboardStats.totalSports}
            subtitle="Available sports"
            icon={Trophy}
            trend
            variant="purple"
          />
          <StatsCard
            title="Clubs"
            value={dashboardStats.totalClubs}
            subtitle="Registered clubs"
            icon={MapPin}
            trend
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
            {dashboardStats.usersByGender.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardStats.usersByGender}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ payload, percent }) => `${payload.gender}: ${(percent * 100).toFixed(0)}%`}
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
              </>
            ) : (
              <div className="min-h-[300px] flex items-center justify-center text-gray-400">No gender distribution data</div>
            )} 
          </div>

          {/* Users by Country */}
          <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Users by Country</h3>
              <p className="text-sm text-gray-400 mt-1">Top 5 countries</p>
            </div>
            <div className="space-y-4">
              {dashboardStats.usersByCountry.length > 0 ? (
                dashboardStats.usersByCountry.map((item) => {
                  const percentage = dashboardStats.totalUsers > 0 ? ((item.count / dashboardStats.totalUsers) * 100).toFixed(1) : '0.0';
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
                })
              ) : (
                <div className="text-center text-gray-400 py-6">No country data</div>
              )}
            </div> 
          </div>
        </div>

        {/* Monthly Ticket Sales Chart */}
        <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Monthly Ticket Sales</h3>
            <p className="text-sm text-gray-400 mt-1">Tickets sold and revenue over time</p>
          </div>
          {monthlyTicketSales.length > 0 ? (
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
          ) : (
            <div className="min-h-[200px] flex items-center justify-center text-gray-400">No sales data</div>
          )} 
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
                  {recentRequests.length > 0 ? (
                    recentRequests.map((request) => (
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-gray-400">No recent booking requests</td>
                    </tr>
                  )}
                </tbody> 
              </table>
            </div>
          </div>

          {/* Top Matches by Sales */}
          <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Matches</h3>
            <p className="text-sm text-gray-400 mb-4">By ticket sales</p>
            <div className="space-y-3">
              {topMatches.length > 0 ? (
                topMatches.map((match, index) => (
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
                ))
              ) : (
                <div className="py-8 text-center text-gray-400">No top matches</div>
              )}
            </div> 
          </div>
        </div>
      </div>
    </div>
  );
}