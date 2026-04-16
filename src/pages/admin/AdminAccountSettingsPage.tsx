import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
import BrandMark from "../../components/auth/BrandMark";
import { authRoutes } from "../auth/authConfig";
import { authService, tokenStorage } from "../../services/authService";

type SettingsTab = "basic" | "password";
type EmailModalStep = "enter" | "otp" | "success";
type AdminAccountSettingsPageProps = {
  onEmailChangeSuccess?: (updatedEmail: string) => void;
};

const otpLength = 6;
const defaultProfilePhoto = "/admin-avatar.svg";

const getStoredProfilePhoto = () => {
  const admin = tokenStorage.getAdmin();

  if (!admin) {
    return defaultProfilePhoto;
  }

  const possiblePhoto =
    (typeof admin.profileImage === "string" && admin.profileImage.trim()) ||
    (typeof admin.image === "string" && admin.image.trim()) ||
    (typeof admin.avatar === "string" && admin.avatar.trim()) ||
    (typeof admin.photo === "string" && admin.photo.trim());

  return possiblePhoto || defaultProfilePhoto;
};

function AdminAccountSettingsPage({
  onEmailChangeSuccess,
}: AdminAccountSettingsPageProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SettingsTab>("basic");
  const [fullName, setFullName] = useState(() => {
    const admin = tokenStorage.getAdmin();
    return (
      (typeof admin?.name === "string" && admin.name.trim()) ||
      "Christopher Nesscrance"
    );
  });
  const [emailAddress, setEmailAddress] = useState(() => {
    const admin = tokenStorage.getAdmin();
    return (
      (typeof admin?.email === "string" && admin.email.trim()) ||
      "superadmin@whatyoueat.com"
    );
  });
  const [profilePhotoSrc, setProfilePhotoSrc] = useState(getStoredProfilePhoto);

  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [nameDraft, setNameDraft] = useState(fullName);
  const [isSavingName, setIsSavingName] = useState(false);

  const [profilePhotoModalOpen, setProfilePhotoModalOpen] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState("");
  const [isUpdatingProfilePhoto, setIsUpdatingProfilePhoto] = useState(false);

  const [removePhotoModalOpen, setRemovePhotoModalOpen] = useState(false);
  const [isRemovingProfilePhoto, setIsRemovingProfilePhoto] = useState(false);

  const [emailModalStep, setEmailModalStep] = useState<EmailModalStep | null>(
    null,
  );
  const [emailDraft, setEmailDraft] = useState("");
  const [otp, setOtp] = useState(() =>
    Array.from({ length: otpLength }, () => ""),
  );
  const [isRequestingEmailChange, setIsRequestingEmailChange] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const openNameModal = () => {
    setNameDraft(fullName);
    setNameModalOpen(true);
  };

  const closeNameModal = () => {
    setNameModalOpen(false);
    setNameDraft(fullName);
  };

  const saveName = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = nameDraft.trim();

    if (!normalizedName) {
      return;
    }

    setIsSavingName(true);

    try {
      const response = await authService.updateAdminProfile({
        name: normalizedName,
      });

      const updatedName = response.data?.name?.trim() || normalizedName;

      setFullName(updatedName);
      setNameDraft(updatedName);
      tokenStorage.updateAdmin({ name: updatedName });
      setNameModalOpen(false);
      toast.success(response.message || "Name updated successfully.");
    } catch {
      // API error toast is handled centrally in axios interceptor.
    } finally {
      setIsSavingName(false);
    }
  };

  const openProfilePhotoModal = () => {
    setProfilePhotoFile(null);
    setProfilePhotoPreview(profilePhotoSrc);
    setProfilePhotoModalOpen(true);
  };

  const closeProfilePhotoModal = () => {
    setProfilePhotoModalOpen(false);
    setProfilePhotoFile(null);
    setProfilePhotoPreview("");
  };

  const handleProfilePhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    setProfilePhotoFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setProfilePhotoPreview(
        typeof reader.result === "string" ? reader.result : "",
      );
    };
    reader.readAsDataURL(file);
  };

  const saveProfilePhoto = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!profilePhotoFile) {
      toast.error("Please choose a profile photo.");
      return;
    }

    setIsUpdatingProfilePhoto(true);

    try {
      const response = await authService.updateAdminProfile({
        name: fullName.trim(),
        profileImage: profilePhotoFile,
      });

      const updatedPhoto =
        response.data?.profileImage?.trim() ||
        response.data?.image?.trim() ||
        profilePhotoPreview ||
        profilePhotoSrc;

      setProfilePhotoSrc(updatedPhoto);
      tokenStorage.updateAdmin({
        profileImage: updatedPhoto,
        image: updatedPhoto,
      });
      closeProfilePhotoModal();
      toast.success(response.message || "Profile photo updated successfully.");
    } catch {
      // API error toast is handled centrally in axios interceptor.
    } finally {
      setIsUpdatingProfilePhoto(false);
    }
  };

  const openRemovePhotoModal = () => {
    setRemovePhotoModalOpen(true);
  };

  const closeRemovePhotoModal = () => {
    setRemovePhotoModalOpen(false);
  };

  const handleRemoveProfilePhoto = async () => {
    setIsRemovingProfilePhoto(true);

    try {
      const response = await authService.deleteAdminProfilePhoto();
      setProfilePhotoSrc(defaultProfilePhoto);
      tokenStorage.updateAdmin({
        profileImage: "",
        image: "",
      });
      setProfilePhotoFile(null);
      setProfilePhotoPreview("");
      setRemovePhotoModalOpen(false);
      toast.success(response.message || "Profile photo removed successfully.");
    } catch {
      // API error toast is handled centrally in axios interceptor.
    } finally {
      setIsRemovingProfilePhoto(false);
    }
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

  const handleEmailModalDismiss = () => {
    if (emailModalStep === "success") {
      handleSignInAfterEmailChange();
      return;
    }

    closeEmailModal();
  };

  const handleRequestEmailChange = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const normalizedEmail = emailDraft.trim();

    if (!normalizedEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsRequestingEmailChange(true);

    try {
      await authService.requestAdminEmailChange(normalizedEmail);
      setOtp(Array.from({ length: otpLength }, () => ""));
      setEmailModalStep("otp");
      toast.success("OTP sent successfully.");
    } catch {
      // API error toast is handled centrally in axios interceptor.
    } finally {
      setIsRequestingEmailChange(false);
    }
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

  const verifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (otp.join("").length !== otpLength) {
      toast.error(`Please enter ${otpLength}-digit OTP.`);
      return;
    }

    const normalizedEmail = emailDraft.trim();

    if (!normalizedEmail) {
      toast.error("Email session expired. Please request OTP again.");
      setEmailModalStep("enter");
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const response = await authService.verifyAdminEmailChangeOtp(
        otp.join(""),
      );
      const updatedEmail = response.data.email?.trim() || normalizedEmail;
      setEmailAddress(updatedEmail);
      onEmailChangeSuccess?.(updatedEmail);
      setEmailModalStep("success");
    } catch {
      // API error toast is handled centrally in axios interceptor.
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSignInAfterEmailChange = () => {
    closeEmailModal();
    navigate(authRoutes.signIn);
  };

  const handleResendOtp = async () => {
    const normalizedEmail = emailDraft.trim();

    if (!normalizedEmail) {
      toast.error("Email session expired. Please request OTP again.");
      setEmailModalStep("enter");
      return;
    }

    setIsResendingOtp(true);

    try {
      await authService.requestAdminEmailChange(normalizedEmail);
      setOtp(Array.from({ length: otpLength }, () => ""));
      toast.success("OTP resent successfully.");
    } catch {
      // API error toast is handled centrally in axios interceptor.
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleSetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    setIsChangingPassword(true);

    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully.");
    } catch {
      // API error toast is handled centrally in axios interceptor.
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <section className="dashboard-hero dashboard-hero--wide account-settings">
      <h1 className="account-settings__title">Account Settings</h1>

      <div className="account-settings__profile-card">
        <img
          className="account-settings__avatar"
          src={profilePhotoSrc}
          alt="Christopher Nesscrance"
        />

        <div className="account-settings__profile-meta">
          <strong>{fullName}</strong>
          <span>Super Admin</span>

          <div className="account-settings__profile-actions">
            <button
              type="button"
              className="account-settings__outline-action"
              onClick={openProfilePhotoModal}
            >
              <FiCamera aria-hidden="true" focusable="false" />
              <span>Change Profile Photo</span>
            </button>
            <button
              type="button"
              className="account-settings__danger-action"
              onClick={openRemovePhotoModal}
            >
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

          <button
            className="account-settings__submit"
            type="submit"
            disabled={isChangingPassword}
          >
            {isChangingPassword ? "Updating..." : "Set New Password"}
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
                {isSavingName ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {profilePhotoModalOpen ? (
        <div
          className="account-settings-modal"
          role="presentation"
          onClick={closeProfilePhotoModal}
        >
          <form
            className="account-settings-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="change-profile-photo-title"
            onClick={(event) => event.stopPropagation()}
            onSubmit={saveProfilePhoto}
          >
            <button
              type="button"
              className="account-settings-modal__close"
              onClick={closeProfilePhotoModal}
              aria-label="Close"
            >
              <FiX aria-hidden="true" focusable="false" />
            </button>

            <h2 id="change-profile-photo-title">Change Profile Photo</h2>
            <div className="account-settings-modal__divider" />

            <div className="account-settings-modal__photo-preview">
              <img
                src={profilePhotoPreview || profilePhotoSrc}
                alt="Profile photo preview"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  display: "block",
                  margin: "0 auto 16px",
                }}
              />
            </div>

            <label htmlFor="profile-photo-input">Choose a new image</label>
            <input
              id="profile-photo-input"
              type="file"
              accept="image/*"
              onChange={handleProfilePhotoChange}
            />

            <div className="account-settings-modal__actions">
              <button
                type="button"
                className="account-settings-modal__cancel"
                onClick={closeProfilePhotoModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="account-settings-modal__confirm"
                disabled={isUpdatingProfilePhoto}
              >
                {isUpdatingProfilePhoto ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {removePhotoModalOpen ? (
        <div
          className="account-settings-modal"
          role="presentation"
          onClick={closeRemovePhotoModal}
        >
          <div
            className="account-settings-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-profile-photo-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="account-settings-modal__close"
              onClick={closeRemovePhotoModal}
              aria-label="Close"
            >
              <FiX aria-hidden="true" focusable="false" />
            </button>

            <h2 id="remove-profile-photo-title">Remove Profile Photo</h2>
            <div className="account-settings-modal__divider" />

            <p>Are you sure you want to remove the current profile photo?</p>

            <div className="account-settings-modal__actions">
              <button
                type="button"
                className="account-settings-modal__cancel"
                onClick={closeRemovePhotoModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="account-settings-modal__confirm account-settings-modal__confirm--wide"
                onClick={handleRemoveProfilePhoto}
                disabled={isRemovingProfilePhoto}
              >
                {isRemovingProfilePhoto ? "Removing..." : "Remove Photo"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {emailModalStep ? (
        <div
          className="account-settings-modal"
          role="presentation"
          onClick={handleEmailModalDismiss}
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
              onClick={handleEmailModalDismiss}
              aria-label="Close"
            >
              <FiX aria-hidden="true" focusable="false" />
            </button>

            <h2 id="change-email-title">Change Email Address</h2>
            <div className="account-settings-modal__divider" />

            {emailModalStep === "enter" ? (
              <form onSubmit={handleRequestEmailChange}>
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
                    disabled={isRequestingEmailChange}
                  >
                    {isRequestingEmailChange ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              </form>
            ) : null}

            {emailModalStep === "otp" ? (
              <form onSubmit={verifyOtp}>
                <h3>OTP Verification</h3>
                <p>
                  Enter the verification code we sent to {emailDraft.trim()}.
                </p>
                <div className="account-settings-modal__mail-row">
                  <FiMail aria-hidden="true" focusable="false" />
                  <span>{emailDraft.trim()}</span>
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
                  <button type="button" onClick={handleResendOtp}>
                    {isResendingOtp ? "Resending..." : "Resend"}
                  </button>
                </div>

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
                    disabled={isVerifyingOtp}
                  >
                    {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </form>
            ) : null}

            {emailModalStep === "success" ? (
              <div className="account-settings-modal__success">
                <BrandMark />
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
                  onClick={handleSignInAfterEmailChange}
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
