import AuthCard from "../../components/auth/AuthCard";
import BrandMark from "../../components/auth/BrandMark";
import { FiEye, FiEyeOff } from "react-icons/fi";
import type { SignInPageProps } from "./authTypes";

function SignInPage({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  passwordVisible,
  onTogglePassword,
  onForgotPassword,
  onSubmit,
}: SignInPageProps) {
  return (
    <AuthCard>
      <BrandMark />
      <h1 className="auth-title">Sign In</h1>
      <p className="auth-subtitle">
        Please enter email address &amp; password to sign in
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

      <label className="field">
        <span className="field__label">Password</span>
        <div className="field__control-wrap">
          <input
            className="field__control field__control--password"
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="Enter valid password"
          />
          <button
            className="field__toggle"
            type="button"
            aria-label={passwordVisible ? "Hide password" : "Show password"}
            onClick={onTogglePassword}
          >
            {passwordVisible ? (
              <FiEyeOff aria-hidden="true" focusable="false" />
            ) : (
              <FiEye aria-hidden="true" focusable="false" />
            )}
          </button>
        </div>
      </label>

      <div className="auth-row">
        <label className="remember-me">
          <input type="checkbox" defaultChecked />
          <span>Remember Me</span>
        </label>

        <button
          className="link-button"
          type="button"
          onClick={onForgotPassword}
        >
          Forgot Password?
        </button>
      </div>

      <button className="primary-button" type="button" onClick={onSubmit}>
        Sign In
      </button>
    </AuthCard>
  );
}

export default SignInPage;
