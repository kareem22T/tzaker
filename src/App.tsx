import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import DepartmentsPage from "./features/departments";
import AddDepartmentPage from "./features/departments/AddDepartment";
import EditDepartmentPage from "./features/departments/EditDepartment";
import ApplicationsPage from "./features/applications";
import ApplicationDetailPage from "./features/applications/ViewApplication";
import AddCategoryPage from "./features/faqs/categories/components/AddCategory";
import EditCategoryPage from "./features/faqs/categories/components/EditCategory";
import CreateFaqPage from "./features/faqs/CreateFaq";
import EditFaqPage from "./features/faqs/EditFaq";
import UsersPage from "./features/users";
import UserProfilePage from "./features/users/UserProfile";
import EditProfilePage from "./pages/Profile/EditProfile";
import ChangePasswordPage from "./pages/Profile/ChangePassword";
import ContactMessagesPage from "./components/contactMessages";
import DashboardHome from "./features/dashboard";
import SuppliersManagement from "./features/suppliers";
import SportsManagement from "./features/sports";
import StadiumsManagement from "./features/stadiums";
import TournamentsManagement from "./features/tournaments";
import ClubsManagement from "./features/clubs";
import MatchesManagement from "./features/matches";
import TicketsManagement from "./features/tickets";
import BookingRequestsManagement from "./features/bookingrequests";
import SiteContentManagement from "./features/siteContent";
import FaqCategoriesManagement from "./features/faqs";
import FaqsManagement from "./features/faqs/FaqsList";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<DashboardHome />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/departments/add" element={<AddDepartmentPage />} />
            <Route path="/departments/edit/:id" element={<EditDepartmentPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/applications/:id" element={<ApplicationDetailPage />} />

            <Route path="/faqs" element={<FaqCategoriesManagement />} />
            <Route path="/faqs/categories/add" element={<AddCategoryPage />} />
            <Route path="/faqs/categories/edit/:id" element={<EditCategoryPage />} />
            <Route path="/faqs/faqs-list" element={<FaqsManagement />} />
            <Route path="/faqs/create" element={<CreateFaqPage />} />
            <Route path="/faqs/edit/:id" element={<EditFaqPage />} />

            <Route path="/users" element={<UsersPage />} /> 
            <Route path="/suppliers" element={<SuppliersManagement />} /> 
            <Route path="/matches" element={<MatchesManagement />} /> 
            <Route path="/sports" element={<SportsManagement />} /> 
            <Route path="/stadiums" element={<StadiumsManagement />} /> 
            <Route path="/tournaments" element={<TournamentsManagement />} /> 
            <Route path="/clubs" element={<ClubsManagement />} /> 
            <Route path="/tickets" element={<TicketsManagement />} /> 
            <Route path="/booking-requests" element={<BookingRequestsManagement />} /> 
            <Route path="/users/profile/:id" element={<UserProfilePage />} /> 
            <Route path="/profile/edit" element={<EditProfilePage />} />
            <Route path="/profile/change-password" element={<ChangePasswordPage />} />

            <Route path="/site-content" element={<SiteContentManagement />} /> 
            <Route path="/contact-us-messages" element={<ContactMessagesPage />} /> 
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />


          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}
