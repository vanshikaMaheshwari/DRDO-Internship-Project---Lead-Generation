import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import LeadsPage from '@/components/pages/LeadsPage';
import LeadDetailPage from '@/components/pages/LeadDetailPage';
import DashboardPage from '@/components/pages/DashboardPage';
import SourcesPage from '@/components/pages/SourcesPage';
import StatesPage from '@/components/pages/StatesPage';
import CreateLeadPage from '@/components/pages/CreateLeadPage';
import FeedbackManagementPage from '@/components/pages/FeedbackManagementPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "leads", element: <LeadsPage /> },
      { path: "leads/:id", element: <LeadDetailPage /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "sources", element: <SourcesPage /> },
      { path: "states", element: <StatesPage /> },
      { path: "create-lead", element: <CreateLeadPage /> },
      { path: "feedback", element: <FeedbackManagementPage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
