import AuthCard from "../../components/auth/AuthCard";
import BrandMark from "../../components/auth/BrandMark";
import { BsPatchCheckFill } from "react-icons/bs";
import type { SuccessPageProps } from "./authTypes";

function SuccessPage({ onSignInNow }: SuccessPageProps) {
  return (
    <AuthCard>
      <BrandMark />
      <div className="success-card">
        <BsPatchCheckFill
          className="success-icon"
          aria-hidden="true"
          focusable="false"
        />
        <h1 className="success-title">Password Successfully Updated</h1>
        <p className="success-subtitle">
          Your new password is successfully updated
        </p>
        <button
          className="primary-button primary-button--compact"
          type="button"
          onClick={onSignInNow}
        >
          Sign In Now
        </button>
      </div>
    </AuthCard>
  );
}

export default SuccessPage;
