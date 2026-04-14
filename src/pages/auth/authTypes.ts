export const otpLength = 6;

export type AuthScreen =
  | "signIn"
  | "verifyEmail"
  | "otp"
  | "newPassword"
  | "success";

export type SignInPageProps = {
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  passwordVisible: boolean;
  onTogglePassword: () => void;
  onForgotPassword: () => void;
  onSubmit: () => void;
  errorMessage?: string;
};

export type VerifyEmailPageProps = {
  email: string;
  onEmailChange: (value: string) => void;
  onGetOtp: () => void;
  onBackToSignIn: () => void;
};

export type OtpVerificationPageProps = {
  email: string;
  otp: string[];
  onOtpChange: (index: number, value: string) => void;
  onOtpKeyDown: (index: number, key: string) => void;
  onOtpPaste: (value: string) => void;
  onVerifyOtp: () => void;
  onChangeEmail: () => void;
  onResend: () => void;
};

export type NewPasswordPageProps = {
  newPassword: string;
  confirmPassword: string;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onToggleNewPassword: () => void;
  onToggleConfirmPassword: () => void;
  onSubmit: () => void;
  onBackToOtp: () => void;
};

export type SuccessPageProps = {
  onSignInNow: () => void;
};
