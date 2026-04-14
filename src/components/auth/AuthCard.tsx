import type { ReactNode } from "react";

type AuthCardProps = {
  children: ReactNode;
};

function AuthCard({ children }: AuthCardProps) {
  return <section className="auth-card">{children}</section>;
}

export default AuthCard;
