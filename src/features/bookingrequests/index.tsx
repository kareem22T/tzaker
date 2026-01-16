import React, { useState, useMemo } from 'react';
import { ClipboardList, Search, Eye, CheckCircle, XCircle, Clock, User, Mail, Phone } from 'lucide-react';

// Dummy data for tickets (matches with stadium levels)
const tickets = [
  {
    id: "1",
    matchId: "1",
    match: {
      firstOpponent: "Manchester United",
      secondOpponent: "Real Madrid",
      stadium: "Old Trafford",
      matchDate: "2024-03-15T18:00:00Z",
    },
    stadiumLevel: "Level A",
    price: 150,
  },
  {
    id: "2",
    matchId: "1",
    match: {
      firstOpponent: "Manchester United",
      secondOpponent: "Real Madrid",
      stadium: "Old Trafford",
      matchDate: "2024-03-15T18:00:00Z",
    },
    stadiumLevel: "Level B",
    price: 100,
  },
  {
    id: "3",
    matchId: "1",
    match: {
      firstOpponent: "Manchester United",
      secondOpponent: "Real Madrid",
      stadium: "Old Trafford",
      matchDate: "2024-03-15T18:00:00Z",
    },
    stadiumLevel: "VIP Section",
    price: 300,
  },
  {
    id: "4",
    matchId: "2",
    match: {
      firstOpponent: "FC Barcelona",
      secondOpponent: "Bayern Munich",
      stadium: "Camp Nou",
      matchDate: "2024-03-20T20:00:00Z",
    },
    stadiumLevel: "Lower Tier",
    price: 120,
  },
  {
    id: "5",
    matchId: "3",
    match: {
      firstOpponent: "Liverpool FC",
      secondOpponent: "Manchester United",
      stadium: "Anfield",
      matchDate: "2024-04-01T19:00:00Z",
    },
    stadiumLevel: "The Kop",
    price: 140,
  },
];

// Dummy data for users
const users = [
  {
    id: "1",
    fullName: "Ahmed Hassan Mohamed",
    email: "ahmed.hassan@example.com",
    phone: "+20-100-1234567",
    country: "Egypt",
    city: "Cairo",
  },
  {
    id: "2",
    fullName: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "+1-555-0102",
    country: "United States",
    city: "Los Angeles",
  },
  {
    id: "3",
    fullName: "Mohammed Al-Rashid",
    email: "mohammed.rashid@example.com",
    phone: "+971-50-1234567",
    country: "United Arab Emirates",
    city: "Dubai",
  },
  {
    id: "4",
    fullName: "Elena Rodriguez",
    email: "elena.rodriguez@example.com",
    phone: "+34-612-345678",
    country: "Spain",
    city: "Barcelona",
  },
  {
    id: "5",
    fullName: "Yuki Tanaka",
    email: "yuki.tanaka@example.com",
    phone: "+81-90-1234-5678",
    country: "Japan",
    city: "Tokyo",
  },
];

// Mock Redux-like state management
const useBookingRequestsStore = () => {
  const [bookingRequests, setBookingRequests] = useState([
    {
      id: "1",
      ticketId: "1",
      userId: "1",
      numberOfTickets: 2,
      totalAmount: 300,
      status: "pending",
      requestedAt: "2024-01-20T10:30:00Z",
      processedAt: null,
    },
    {
      id: "2",
      ticketId: "4",
      userId: "2",
      numberOfTickets: 4,
      totalAmount: 480,
      status: "approved",
      requestedAt: "2024-01-19T14:15:00Z",
      processedAt: "2024-01-19T16:45:00Z",
    },
    {
      id: "3",
      ticketId: "3",
      userId: "3",
      numberOfTickets: 1,
      totalAmount: 300,
      status: "pending",
      requestedAt: "2024-01-21T09:00:00Z",
      processedAt: null,
    },
    {
      id: "4",
      ticketId: "2",
      userId: "4",
      numberOfTickets: 3,
      totalAmount: 300,
      status: "rejected",
      requestedAt: "2024-01-18T11:20:00Z",
      processedAt: "2024-01-18T13:30:00Z",
      rejectionReason: "Insufficient ticket availability",
    },
    {
      id: "5",
      ticketId: "5",
      userId: "5",
      numberOfTickets: 2,
      totalAmount: 280,
      status: "pending",
      requestedAt: "2024-01-22T15:45:00Z",
      processedAt: null,
    },
    {
      id: "6",
      ticketId: "1",
      userId: "2",
      numberOfTickets: 5,
      totalAmount: 750,
      status: "approved",
      requestedAt: "2024-01-17T08:30:00Z",
      processedAt: "2024-01-17T10:15:00Z",
    },
    {
      id: "7",
      ticketId: "4",
      userId: "1",
      numberOfTickets: 2,
      totalAmount: 240,
      status: "pending",
      requestedAt: "2024-01-23T12:00:00Z",
      processedAt: null,
    },
  ]);

  const updateBookingStatus = (id, status, rejectionReason = null) => {
    setBookingRequests(bookingRequests.map(br => 
      br.id === id 
        ? { 
            ...br, 
            status, 
            processedAt: new Date().toISOString(),
            rejectionReason: status === 'rejected' ? rejectionReason : null 
          } 
        : br
    ));
  };

  return { bookingRequests, updateBookingStatus };
};

const BookingRequestModal = ({ bookingRequest, onClose, onApprove, onReject }) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const ticket = tickets.find(t => t.id === bookingRequest.ticketId);
  const user = users.find(u => u.id === bookingRequest.userId);

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    onReject(bookingRequest.id, rejectionReason);
    onClose();
  };

  const handleApprove = () => {
    if (confirm(`Are you sure you want to approve this booking request for ${bookingRequest.numberOfTickets} ticket(s)?`)) {
      onApprove(bookingRequest.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-9999999 p-4">
      <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#111d2d] border-b border-[#1e3a52] p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Booking Request Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status Banner */}
          <div className={`p-4 rounded-lg border ${
            bookingRequest.status === 'approved' 
              ? 'bg-green-600/10 border-green-600/30' 
              : bookingRequest.status === 'rejected'
              ? 'bg-red-600/10 border-red-600/30'
              : 'bg-yellow-600/10 border-yellow-600/30'
          }`}>
            <div className="flex items-center gap-3">
              {bookingRequest.status === 'approved' && <CheckCircle className="w-6 h-6 text-green-400" />}
              {bookingRequest.status === 'rejected' && <XCircle className="w-6 h-6 text-red-400" />}
              {bookingRequest.status === 'pending' && <Clock className="w-6 h-6 text-yellow-400" />}
              <div className="flex-1">
                <p className="text-white font-semibold capitalize">{bookingRequest.status}</p>
                <p className="text-sm text-gray-400">
                  Requested on {new Date(bookingRequest.requestedAt).toLocaleString()}
                </p>
                {bookingRequest.processedAt && (
                  <p className="text-sm text-gray-400">
                    Processed on {new Date(bookingRequest.processedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            {bookingRequest.status === 'rejected' && bookingRequest.rejectionReason && (
              <div className="mt-3 pt-3 border-t border-red-600/30">
                <p className="text-sm text-gray-400 mb-1">Rejection Reason:</p>
                <p className="text-red-400">{bookingRequest.rejectionReason}</p>
              </div>
            )}
          </div>

          {/* User Information */}
          <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#00ff88] mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h3>
            {user && (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Full Name</p>
                    <p className="text-white font-medium text-lg">{user.fullName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Email Address</p>
                    <a href={`mailto:${user.email}`} className="text-[#00ff88] hover:underline">
                      {user.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Phone Number</p>
                    <a href={`tel:${user.phone}`} className="text-[#00ff88] hover:underline">
                      {user.phone}
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#1e3a52]">
                  <div>
                    <p className="text-sm text-gray-400">Country</p>
                    <p className="text-white font-medium">{user.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">City</p>
                    <p className="text-white font-medium">{user.city}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ticket Information */}
          <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Ticket Information</h3>
            {ticket && (
              <div className="space-y-4">
                <div className="p-4 bg-[#111d2d] rounded-lg">
                  <p className="text-white font-bold text-xl mb-2">
                    {ticket.match.firstOpponent} vs {ticket.match.secondOpponent}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">Stadium</p>
                      <p className="text-white">{ticket.match.stadium}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Level</p>
                      <p className="text-white">{ticket.stadiumLevel}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Match Date</p>
                      <p className="text-white">{new Date(ticket.match.matchDate).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Price per Ticket</p>
                      <p className="text-[#00ff88] font-bold text-lg">${ticket.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Details */}
          <div className="bg-[#0a1929] border border-[#1e3a52] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-[#00ff88] mb-4">Booking Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Number of Tickets</p>
                <p className="text-white font-bold text-3xl">{bookingRequest.numberOfTickets}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Amount</p>
                <p className="text-[#00ff88] font-bold text-3xl">${bookingRequest.totalAmount}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {bookingRequest.status === 'pending' && (
            <div className="space-y-3">
              {showRejectForm ? (
                <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rejection Reason *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white focus:outline-none focus:border-red-600 transition-colors resize-none"
                    placeholder="Please provide a reason for rejection..."
                  />
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => {
                        setShowRejectForm(false);
                        setRejectionReason('');
                      }}
                      className="flex-1 px-4 py-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReject}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Confirm Rejection
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 pt-4 border-t border-[#1e3a52]">
                  <button
                    onClick={() => setShowRejectForm(true)}
                    className="flex-1 px-6 py-3 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/10 transition-colors inline-flex items-center justify-center gap-2 font-semibold"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject Request
                  </button>
                  <button
                    onClick={handleApprove}
                    className="flex-1 px-6 py-3 bg-[#00ff88] text-[#0a1929] rounded-lg hover:bg-[#00dd77] transition-colors inline-flex items-center justify-center gap-2 font-semibold"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve Request
                  </button>
                </div>
              )}
            </div>
          )}

          {bookingRequest.status !== 'pending' && (
            <div className="pt-4 border-t border-[#1e3a52]">
              <button
                onClick={onClose}
                className="w-full px-6 py-3 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function BookingRequestsManagement() {
  const { bookingRequests, updateBookingStatus } = useBookingRequestsStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalState, setModalState] = useState({ open: false, bookingRequest: null });

  const filteredBookingRequests = useMemo(() => {
    return bookingRequests.filter(br => {
      const ticket = tickets.find(t => t.id === br.ticketId);
      const user = users.find(u => u.id === br.userId);
      const searchLower = searchTerm.toLowerCase();
      
      const matchesSearch = 
        user?.fullName.toLowerCase().includes(searchLower) ||
        user?.email.toLowerCase().includes(searchLower) ||
        ticket?.match.firstOpponent.toLowerCase().includes(searchLower) ||
        ticket?.match.secondOpponent.toLowerCase().includes(searchLower) ||
        ticket?.stadiumLevel.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'all' || br.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookingRequests, searchTerm, statusFilter]);

  const handleApprove = (id) => {
    updateBookingStatus(id, 'approved');
  };

  const handleReject = (id, reason) => {
    updateBookingStatus(id, 'rejected', reason);
  };

  const getStatusCounts = () => {
    return {
      all: bookingRequests.length,
      pending: bookingRequests.filter(br => br.status === 'pending').length,
      approved: bookingRequests.filter(br => br.status === 'approved').length,
      rejected: bookingRequests.filter(br => br.status === 'rejected').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-[#0a1929] p-6">
      <div>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="w-10 h-10 text-[#00ff88]" />
            <h1 className="text-4xl font-bold text-white">Booking Requests</h1>
          </div>
          <p className="text-gray-400">Review and manage ticket booking requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-1">Total Requests</p>
            <p className="text-white text-3xl font-bold">{statusCounts.all}</p>
          </div>
          <div className="bg-[#111d2d] border border-yellow-600/30 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-1">Pending</p>
            <p className="text-yellow-400 text-3xl font-bold">{statusCounts.pending}</p>
          </div>
          <div className="bg-[#111d2d] border border-green-600/30 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-1">Approved</p>
            <p className="text-green-400 text-3xl font-bold">{statusCounts.approved}</p>
          </div>
          <div className="bg-[#111d2d] border border-red-600/30 rounded-lg p-6">
            <p className="text-gray-400 text-sm mb-1">Rejected</p>
            <p className="text-red-400 text-3xl font-bold">{statusCounts.rejected}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer name, email, or match..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#0a1929] border border-[#1e3a52] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-colors capitalize ${
                    statusFilter === status
                      ? 'bg-[#00ff88] text-[#0a1929]'
                      : 'border border-[#1e3a52] text-gray-300 hover:bg-[#0a1929]'
                  }`}
                >
                  {status} ({statusCounts[status]})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Requests Table */}
        <div className="bg-[#111d2d] border border-[#1e3a52] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0a1929] border-b border-[#1e3a52]">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Match</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Tickets</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#00ff88]">Requested</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#00ff88]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookingRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No booking requests found
                    </td>
                  </tr>
                ) : (
                  filteredBookingRequests.map((bookingRequest) => {
                    const ticket = tickets.find(t => t.id === bookingRequest.ticketId);
                    const user = users.find(u => u.id === bookingRequest.userId);
                    
                    return (
                      <tr key={bookingRequest.id} className="border-b border-[#1e3a52] hover:bg-[#0a1929] transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white font-medium">{user?.fullName}</p>
                            <p className="text-xs text-gray-400">{user?.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-white font-medium text-sm">
                              {ticket?.match.firstOpponent} vs {ticket?.match.secondOpponent}
                            </p>
                            <p className="text-xs text-gray-400">{ticket?.stadiumLevel}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-white font-bold text-lg">{bookingRequest.numberOfTickets}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[#00ff88] font-bold">${bookingRequest.totalAmount}</span>
                        </td>
                        <td className="px-6 py-4">
                          {bookingRequest.status === 'approved' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-600/20 text-green-400 border border-green-600/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approved
                            </span>
                          )}
                          {bookingRequest.status === 'rejected' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-600/20 text-red-400 border border-red-600/30">
                              <XCircle className="w-3 h-3 mr-1" />
                              Rejected
                            </span>
                          )}
                          {bookingRequest.status === 'pending' && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-600/20 text-yellow-400 border border-yellow-600/30">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-white text-sm">
                            {new Date(bookingRequest.requestedAt).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(bookingRequest.requestedAt).toLocaleTimeString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setModalState({ open: true, bookingRequest })}
                              className="p-2 border border-[#1e3a52] text-gray-300 rounded-lg hover:bg-[#0a1929] hover:text-[#00ff88] transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {bookingRequest.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => {
                                    if (confirm(`Approve booking request for ${bookingRequest.numberOfTickets} ticket(s)?`)) {
                                      handleApprove(bookingRequest.id);
                                    }
                                  }}
                                  className="p-2 border border-green-600/50 text-green-400 rounded-lg hover:bg-green-600/10 transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setModalState({ open: true, bookingRequest })}
                                  className="p-2 border border-red-600/50 text-red-400 rounded-lg hover:bg-red-600/10 transition-colors"
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-gray-400 text-sm">
          Showing {filteredBookingRequests.length} of {bookingRequests.length} booking requests
        </div>
      </div>

      {modalState.open && (
        <BookingRequestModal
          bookingRequest={modalState.bookingRequest}
          onClose={() => setModalState({ open: false, bookingRequest: null })}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}