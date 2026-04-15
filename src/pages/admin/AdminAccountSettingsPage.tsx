import { useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  FiCamera,
  FiCheck,
  FiEdit2,
  FiEye,
  FiEyeOff,
  FiMail,
  FiTrash2,
  FiX,
} from "react-icons/fi";

type SettingsTab = "basic" | "password";
type EmailModalStep = "enter" | "verify" | "otp" | "success";

const otpLength = 6;

function AdminAccountSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("basic");
  const [fullName, setFullName] = useState("Christopher Nesscrance");
  const [emailAddress, setEmailAddress] = useState("superadmin@whatyoueat.com");

  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState(fullName);

  const [emailModalStep, setEmailModalStep] = useState<EmailModalStep | null>(
    null,
  );
  const [emailDraft, setEmailDraft] = useState("");
  const [otp, setOtp] = useState(() =>
    Array.from({ length: otpLength }, () => ""),
  );
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailForVerification = useMemo(() => {
    return emailDraft.trim() || emailAddress;
  }, [emailAddress, emailDraft]);

  const openNameModal = () => {
    setNameDraft(fullName);
    setNameModalOpen(true);
  };

  const closeNameModal = () => {
    setNameModalOpen(false);
    setNameDraft(fullName);
  };

  const saveName = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!nameDraft.trim()) {
      return;
    }

    setFullName(nameDraft.trim());
    setNameModalOpen(false);
  };

  const openEmailModal = () => {
    setEmailDraft("");
    setOtp(Array.from({ length: otpLength }, () => ""));
    setEmailModalStep("enter");
  };

  const closeEmailModal = () => {
    setEmailModalStep(null);
    setEmailDraft("");
    setOtp(Array.from({ length: otpLength }, () => ""));
  };

  const goToEmailVerify = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailDraft.trim()) {
      return;
    }

    setEmailModalStep("verify");
  };

  const handleOtpChange = (index: number, rawValue: string) => {
    const value = rawValue.replace(/\D/g, "").slice(-1);

    setOtp((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });

    if (value && index < otpLength - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, key: string) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (otp.join("").length !== otpLength) {
      return;
    }

    setEmailAddress(emailForVerification);
    setEmailModalStep("success");
  };

  const handleSetPassword = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return;
    }

    if (newPassword !== confirmPassword) {
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <section className="dashboard-hero dashboard-hero--wide account-settings">
      <h1 className="account-settings__title">Account Settings</h1>

      <div className="account-settings__profile-card">
        <img
          className="account-settings__avatar"
          src="/admin-avatar.svg"
          alt="Christopher Nesscrance"
        />

        <div className="account-settings__profile-meta">
          <strong>{fullName}</strong>
          <span>Super Admin</span>

          <div className="account-settings__profile-actions">
            <button type="button" className="account-settings__outline-action">
              <FiCamera aria-hidden="true" focusable="false" />
              <span>Change Profile Photo</span>
            </button>
            <button type="button" className="account-settings__danger-action">
              <FiTrash2 aria-hidden="true" focusable="false" />
              <span>Remove Profile Photo</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className="account-settings__tabs"
        role="tablist"
        aria-label="Account settings tabs"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "basic"}
          className={`account-settings__tab ${activeTab === "basic" ? "account-settings__tab--active" : ""}`}
          onClick={() => setActiveTab("basic")}
        >
          Basic Information
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "password"}
          className={`account-settings__tab ${activeTab === "password" ? "account-settings__tab--active" : ""}`}
          onClick={() => setActiveTab("password")}
        >
          Change Password
        </button>
      </div>

      {activeTab === "basic" ? (
        <div className="account-settings__panel" role="tabpanel">
          <label
            className="account-settings__field"
            htmlFor="account-settings-name"
          >
            <span>Full Name</span>
            <div className="account-settings__field-control">
              <input id="account-settings-name" value={fullName} readOnly />
              <button
                type="button"
                aria-label="Change name"
                onClick={openNameModal}
              >
                <FiEdit2 aria-hidden="true" focusable="false" />
              </button>
            </div>
          </label>

          <label
            className="account-settings__field"
            htmlFor="account-settings-email"
          >
            <span>Email Address</span>
            <div className="account-settings__field-control">
              <input
                id="account-settings-email"
                value={emailAddress}
                readOnly
              />
              <button
                type="button"
                aria-label="Change email address"
                onClick={openEmailModal}
              >
                <FiEdit2 aria-hidden="true" focusable="false" />
              </button>
            </div>
          </label>
        </div>
      ) : (
        <form
          className="account-settings__password-panel"
          onSubmit={handleSetPassword}
        >
          <label className="account-settings__field" htmlFor="current-password">
            <span>Current Password</span>
            <div className="account-settings__field-control">
              <input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Enter current password"
              />
              <button
                type="button"
                aria-label={
                  showCurrentPassword ? "Hide password" : "Show password"
                }
                onClick={() => setShowCurrentPassword((current) => !current)}
              >
                {showCurrentPassword ? (
                  <FiEyeOff aria-hidden="true" focusable="false" />
                ) : (
                  <FiEye aria-hidden="true" focusable="false" />
                )}
              </button>
            </div>
          </label>

          <label className="account-settings__field" htmlFor="new-password">
            <span>New Password</span>
            <div className="account-settings__field-control">
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Enter new password"
              />
              <button
                type="button"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                onClick={() => setShowNewPassword((current) => !current)}
              >
                {showNewPassword ? (
                  <FiEyeOff aria-hidden="true" focusable="false" />
                ) : (
                  <FiEye aria-hidden="true" focusable="false" />
                )}
              </button>
            </div>
          </label>

          <label className="account-settings__field" htmlFor="confirm-password">
            <span>Confirm New Password</span>
            <div className="account-settings__field-control">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Re-type new password"
              />
              <button
                type="button"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                onClick={() => setShowConfirmPassword((current) => !current)}
              >
                {showConfirmPassword ? (
                  <FiEyeOff aria-hidden="true" focusable="false" />
                ) : (
                  <FiEye aria-hidden="true" focusable="false" />
                )}
              </button>
            </div>
          </label>

          <button className="account-settings__submit" type="submit">
            Set New Password
          </button>
        </form>
      )}

      {nameModalOpen ? (
        <div
          className="account-settings-modal"
          role="presentation"
          onClick={closeNameModal}
        >
          <form
            className="account-settings-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-name-title"
            onClick={(event) => event.stopPropagation()}
            onSubmit={saveName}
          >
            <h2 id="change-name-title">Change Name</h2>
            <div className="account-settings-modal__divider" />
            <label htmlFor="modal-name-input">Full Name</label>
            <input
              id="modal-name-input"
              value={nameDraft}
              onChange={(event) => setNameDraft(event.target.value)}
              placeholder="Enter full name"
            />

            <div className="account-settings-modal__actions">
              <button
                type="button"
                className="account-settings-modal__cancel"
                onClick={closeNameModal}
              >
                Cancel
              </button>
              <button type="submit" className="account-settings-modal__confirm">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {emailModalStep ? (
        <div
          className="account-settings-modal"
          role="presentation"
          onClick={closeEmailModal}
        >
          <div
            className="account-settings-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-email-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="account-settings-modal__close"
              onClick={closeEmailModal}
              aria-label="Close"
            >
              <FiX aria-hidden="true" focusable="false" />
            </button>

            <h2 id="change-email-title">Change Email Address</h2>
            <div className="account-settings-modal__divider" />

            {emailModalStep === "enter" ? (
              <form onSubmit={goToEmailVerify}>
                <label htmlFor="change-email-input">New Email Address</label>
                <input
                  id="change-email-input"
                  type="email"
                  value={emailDraft}
                  onChange={(event) => setEmailDraft(event.target.value)}
                  placeholder="Enter new email address"
                />

                <div className="account-settings-modal__actions">
                  <button
                    type="button"
                    className="account-settings-modal__cancel"
                    onClick={closeEmailModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="account-settings-modal__confirm"
                  >
                    Continue
                  </button>
                </div>
              </form>
            ) : null}

            {emailModalStep === "verify" ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  setEmailModalStep("otp");
                }}
              >
                <h3>Verify Your Email</h3>
                <p>Enter your email address to get an OTP code.</p>
                <label htmlFor="verify-email-input">New Email Address</label>
                <input
                  id="verify-email-input"
                  type="email"
                  value={emailForVerification}
                  onChange={(event) => setEmailDraft(event.target.value)}
                />

                <div className="account-settings-modal__actions">
                  <button
                    type="button"
                    className="account-settings-modal__cancel"
                    onClick={() => setEmailModalStep("enter")}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="account-settings-modal__confirm"
                  >
                    Get OTP
                  </button>
                </div>
              </form>
            ) : null}

            {emailModalStep === "otp" ? (
              <form onSubmit={verifyOtp}>
                <h3>OTP Verification</h3>
                <p>Enter the verification code we sent to your email.</p>
                <div className="account-settings-modal__mail-row">
                  <FiMail aria-hidden="true" focusable="false" />
                  <span>{emailForVerification}</span>
                </div>

                <div className="account-settings-modal__otp-grid">
                  {otp.map((digit, index) => (
                    <input
                      key={`settings-otp-${index}`}
                      ref={(element) => {
                        otpRefs.current[index] = element;
                      }}
                      value={digit}
                      onChange={(event) =>
                        handleOtpChange(index, event.target.value)
                      }
                      onKeyDown={(event) => handleOtpKeyDown(index, event.key)}
                      inputMode="numeric"
                      maxLength={1}
                      aria-label={`OTP digit ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="account-settings-modal__resend">
                  <span>Did not get OTP?</span>
                  <button
                    type="button"
                    onClick={() =>
                      setOtp(Array.from({ length: otpLength }, () => ""))
                    }
                  >
                    Resend
                  </button>
                </div>

                <div className="account-settings-modal__actions">
                  <button
                    type="button"
                    className="account-settings-modal__cancel"
                    onClick={() => setEmailModalStep("verify")}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="account-settings-modal__confirm"
                  >
                    Verify OTP
                  </button>
                </div>
              </form>
            ) : null}

            {emailModalStep === "success" ? (
              <div className="account-settings-modal__success">
                <span
                  className="account-settings-modal__success-icon"
                  aria-hidden="true"
                >
                  <FiCheck />
                </span>
                <h3>Successfully Verified &amp; Updated</h3>
                <p>Your email address is successfully verified and updated.</p>
                <button
                  type="button"
                  className="account-settings-modal__confirm account-settings-modal__confirm--wide"
                  onClick={closeEmailModal}
                >
                  Sign In
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default AdminAccountSettingsPage;
