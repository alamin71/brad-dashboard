import AuthCard from "../../components/auth/AuthCard";
import BrandMark from "../../components/auth/BrandMark";
import type { NewPasswordPageProps } from "./authTypes";

function NewPasswordPage({
  newPassword,
  confirmPassword,
  showNewPassword,
  showConfirmPassword,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onToggleNewPassword,
  onToggleConfirmPassword,
  onSubmit,
  onBackToOtp,
}: NewPasswordPageProps) {
  return (
    <AuthCard>
      <BrandMark />
      <h1 className="auth-title">Set New Password</h1>
      <p className="auth-subtitle">
        Set a strong password to protect your account
      </p>

      <label className="field">
        <span className="field__label">New Password</span>
        <div className="field__control-wrap">
          <input
            className="field__control field__control--password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(event) => onNewPasswordChange(event.target.value)}
            placeholder="Enter new password"
          />
          <button
            className="field__toggle"
            type="button"
            aria-label={
              showNewPassword ? "Hide new password" : "Show new password"
            }
            onClick={onToggleNewPassword}
          >
            {showNewPassword ? "◔" : "◉"}
          </button>
        </div>
      </label>

      <label className="field">
        <span className="field__label">Confirm New Password</span>
        <div className="field__control-wrap">
          <input
            className="field__control field__control--password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(event) => onConfirmPasswordChange(event.target.value)}
            placeholder="Re-type new password"
          />
          <button
            className="field__toggle"
            type="button"
            aria-label={
              showConfirmPassword
                ? "Hide confirmation password"
                : "Show confirmation password"
            }
            onClick={onToggleConfirmPassword}
          >
            {showConfirmPassword ? "◔" : "◉"}
          </button>
        </div>
      </label>

      <button className="primary-button" type="button" onClick={onSubmit}>
        Set New Password
      </button>
      <button className="text-button" type="button" onClick={onBackToOtp}>
        Back to OTP
      </button>
    </AuthCard>
  );
}

export default NewPasswordPage;
