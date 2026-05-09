import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import LandingPage from "./pages/index";
import SignupPage from "./pages/signup";
import DashboardPage from "./pages/dashboard";
import NewRunPage from "./pages/run/new";
import RunPage from "./pages/run/[run_id]";
import ReportPage from "./pages/report/[run_id]";
import BillingPage from "./pages/billing";
import SettingsPage from "./pages/settings";
import SampleReportPage from "./pages/sample";
import PricingPage from "./pages/pricing";
import ErrorPage from "./pages/_error";

export default function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/run/new" element={<NewRunPage />} />
          <Route path="/run/:run_id" element={<RunPage />} />
          <Route path="/report/:run_id" element={<ReportPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/sample" element={<SampleReportPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          {/* Error fallback */}
          <Route path="*" element={<ErrorPage errorCode={404} message="Page not found" />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}
