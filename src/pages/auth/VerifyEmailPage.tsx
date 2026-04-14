import AuthCard from "../../components/auth/AuthCard";
import BrandMark from "../../components/auth/BrandMark";
import type { VerifyEmailPageProps } from "./authTypes";

function VerifyEmailPage({
  email,
  onEmailChange,
  onGetOtp,
  onBackToSignIn,
}: VerifyEmailPageProps) {
  return (
    <AuthCard>
      <BrandMark />
      <h1 className="auth-title">Verify Your Email</h1>
      <p className="auth-subtitle">
        Enter your email address to get an OTP code
      </p>

      <label className="field">
        <span className="field__label">Email Address</span>
        <input
          className="field__control"
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder="Enter email address"
        />
      </label>

      <button className="primary-button" type="button" onClick={onGetOtp}>
        Get OTP
      </button>
      <button className="text-button" type="button" onClick={onBackToSignIn}>
        Back to Sign In
      </button>
    </AuthCard>
  );
}

export default VerifyEmailPage;
