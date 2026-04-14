import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
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
import { authRoutes, adminCredentials } from "./pages/auth/authConfig";
import { otpLength } from "./pages/auth/authTypes";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
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

  const handleSignIn = () => {
    if (
      email.trim() === adminCredentials.email &&
      password === adminCredentials.password
    ) {
      setLoginError("");
      navigate(authRoutes.dashboard);
      return;
    }

    setLoginError("Invalid admin email or password.");
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to={authRoutes.signIn} replace />} />
      <Route element={<AuthLayout />}>
        <Route
          path={authRoutes.signIn}
          element={
            <SignInPage
              email={email}
              onEmailChange={(value) => {
                setEmail(value);
                if (loginError) {
                  setLoginError("");
                }
              }}
              password={password}
              onPasswordChange={(value) => {
                setPassword(value);
                if (loginError) {
                  setLoginError("");
                }
              }}
              passwordVisible={showPassword}
              onTogglePassword={() => setShowPassword((current) => !current)}
              onForgotPassword={() => navigate(authRoutes.verifyEmail)}
              onSubmit={handleSignIn}
              errorMessage={loginError}
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
      <Route
        path="/admin"
        element={<AdminLayout onLogout={() => navigate(authRoutes.signIn)} />}
      >
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
  );
}

export default App;
