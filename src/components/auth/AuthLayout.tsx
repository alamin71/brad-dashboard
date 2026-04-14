import { Outlet } from "react-router-dom";
import AuthFrame from "./AuthFrame";

function AuthLayout() {
  return (
    <AuthFrame>
      <Outlet />
    </AuthFrame>
  );
}

export default AuthLayout;
