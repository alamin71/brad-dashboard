import type { ReactNode } from "react";

type AuthFrameProps = {
  children: ReactNode;
};

function AuthFrame({ children }: AuthFrameProps) {
  return (
    <main className="auth-shell">
      <div className="auth-shell__glow auth-shell__glow--left" />
      <div className="auth-shell__glow auth-shell__glow--right" />
      {children}
    </main>
  );
}

export default AuthFrame;
