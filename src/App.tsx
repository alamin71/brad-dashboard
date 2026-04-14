import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminContentPage from "./pages/admin/AdminContentPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminPlaceholderPage from "./pages/admin/AdminPlaceholderPage";
import AuthLayout from "./components/auth/AuthLayout";
import NewPasswordPage from "./pages/auth/NewPasswordPage";
import OtpVerificationPage from "./pages/auth/OtpVerificationPage";
import SignInPage from "./pages/auth/SignInPage";
import SuccessPage from "./pages/auth/SuccessPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import { authRoutes } from "./pages/auth/authConfig";
import { otpLength } from "./pages/auth/authTypes";
import { authService } from "./services/authService";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(() =>
    Array.from({ length: otpLength }, () => ""),
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateOtp = (index: number, value: string) => {
    const nextValue = value.replace(/\D/g, "").slice(-1);

    setOtp((current) => {
      const next = [...current];
      next[index] = nextValue;
      return next;
    });
  };

  const handleOtpKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      const previousField = document.getElementById(`otp-${index - 1}`);
      previousField?.focus();
    }
  };

  const handleOtpPaste = (value: string) => {
    const pastedValue = value.replace(/\D/g, "").slice(0, otpLength);

    if (!pastedValue) {
      return;
    }

    const nextOtp = Array.from(
      { length: otpLength },
      (_, index) => pastedValue[index] ?? "",
    );
    setOtp(nextOtp);
  };

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    try {
      await authService.login({
        email: email.trim(),
        password,
      });

      toast.success("Login successful.");
      navigate(authRoutes.dashboard);
    } catch {
      // API error toast is handled centrally in axios interceptor.
    }
  };

  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully.");
    navigate(authRoutes.signIn);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={authRoutes.signIn} replace />} />
        <Route element={<AuthLayout />}>
          <Route
            path={authRoutes.signIn}
            element={
              <SignInPage
                email={email}
                onEmailChange={setEmail}
                password={password}
                onPasswordChange={setPassword}
                passwordVisible={showPassword}
                onTogglePassword={() => setShowPassword((current) => !current)}
                onForgotPassword={() => navigate(authRoutes.verifyEmail)}
                onSubmit={handleSignIn}
              />
            }
          />
          <Route
            path={authRoutes.verifyEmail}
            element={
              <VerifyEmailPage
                email={email}
                onEmailChange={setEmail}
                onGetOtp={() => navigate(authRoutes.otp)}
                onBackToSignIn={() => navigate(authRoutes.signIn)}
              />
            }
          />
          <Route
            path={authRoutes.otp}
            element={
              <OtpVerificationPage
                email={email}
                otp={otp}
                onOtpChange={updateOtp}
                onOtpKeyDown={handleOtpKeyDown}
                onOtpPaste={handleOtpPaste}
                onVerifyOtp={() => navigate(authRoutes.newPassword)}
                onChangeEmail={() => navigate(authRoutes.verifyEmail)}
                onResend={() => navigate(authRoutes.verifyEmail)}
              />
            }
          />
          <Route
            path={authRoutes.newPassword}
            element={
              <NewPasswordPage
                newPassword={newPassword}
                confirmPassword={confirmPassword}
                showNewPassword={showNewPassword}
                showConfirmPassword={showConfirmPassword}
                onNewPasswordChange={setNewPassword}
                onConfirmPasswordChange={setConfirmPassword}
                onToggleNewPassword={() =>
                  setShowNewPassword((current) => !current)
                }
                onToggleConfirmPassword={() =>
                  setShowConfirmPassword((current) => !current)
                }
                onSubmit={() => navigate(authRoutes.success)}
                onBackToOtp={() => navigate(authRoutes.otp)}
              />
            }
          />
          <Route
            path={authRoutes.success}
            element={
              <SuccessPage onSignInNow={() => navigate(authRoutes.signIn)} />
            }
          />
        </Route>
        <Route path="/admin" element={<AdminLayout onLogout={handleLogout} />}>
          <Route
            path={authRoutes.dashboard.replace("/admin/", "")}
            element={<AdminDashboardPage />}
          />
          <Route
            path={authRoutes.content.replace("/admin/", "")}
            element={<AdminContentPage />}
          />
          <Route
            path={authRoutes.userManagement.replace("/admin/", "")}
            element={
              <AdminPlaceholderPage
                title="User Management"
                description="Manage users, roles, and moderation settings from this section."
              />
            }
          />
          <Route
            path={authRoutes.policyPages.replace("/admin/", "")}
            element={
              <AdminPlaceholderPage
                title="Policy Pages"
                description="Create and update policy pages from here."
              />
            }
          />
          <Route
            path={authRoutes.accountSettings.replace("/admin/", "")}
            element={
              <AdminPlaceholderPage
                title="Account Settings"
                description="Update admin profile and account settings in this area."
              />
            }
          />
          <Route
            index
            element={
              <Navigate
                to={authRoutes.dashboard.replace("/admin/", "")}
                replace
              />
            }
          />
        </Route>
        <Route path="*" element={<Navigate to={authRoutes.signIn} replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2500} />
    </>
  );
}

export default App;
