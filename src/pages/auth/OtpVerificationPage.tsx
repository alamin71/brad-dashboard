import AuthCard from "../../components/auth/AuthCard";
import BrandMark from "../../components/auth/BrandMark";
import { otpLength, type OtpVerificationPageProps } from "./authTypes";

function OtpVerificationPage({
  email,
  otp,
  onOtpChange,
  onOtpKeyDown,
  onOtpPaste,
  onVerifyOtp,
  onChangeEmail,
  onResend,
}: OtpVerificationPageProps) {
  return (
    <AuthCard>
      <BrandMark />
      <h1 className="auth-title">OTP Verification</h1>
      <p className="auth-subtitle">
        Enter the verification code we sent to your email
      </p>
      <p className="otp-email">{email}</p>

      <div
        className="otp-grid"
        onPaste={(event) => {
          event.preventDefault();
          onOtpPaste(event.clipboardData.getData("text"));
        }}
      >
        {otp.slice(0, otpLength).map((value, index) => (
          <input
            key={`otp-${index}`}
            id={`otp-${index}`}
            className={`otp-input ${value ? "otp-input--filled" : ""}`}
            inputMode="numeric"
            maxLength={1}
            value={value}
            onChange={(event) => onOtpChange(index, event.target.value)}
            onKeyDown={(event) => onOtpKeyDown(index, event.key)}
            onFocus={(event) => event.currentTarget.select()}
          />
        ))}
      </div>

      <p className="otp-help">
        Didn’t get OTP?{" "}
        <button
          className="link-button link-button--inline"
          type="button"
          onClick={onResend}
        >
          Resend
        </button>
      </p>

      <button className="primary-button" type="button" onClick={onVerifyOtp}>
        Verify OTP
      </button>
      <button className="text-button" type="button" onClick={onChangeEmail}>
        Change Email
      </button>
    </AuthCard>
  );
}

export default OtpVerificationPage;
