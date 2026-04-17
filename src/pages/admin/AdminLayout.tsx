import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FiBell,
  FiGrid,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiUsers,
  FiX,
} from "react-icons/fi";
import {
  ADMIN_PROFILE_UPDATED_EVENT,
  tokenStorage,
} from "../../services/authService";

type AdminLayoutProps = {
  onLogout: () => void;
};

const navigationItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: FiGrid },
  { label: "Content", to: "/admin/content", icon: FiGrid },
  { label: "User Management", to: "/admin/user-management", icon: FiUsers },
  { label: "Policy Pages", to: "/admin/policy-pages", icon: FiSettings },
  {
    label: "Account Settings",
    to: "/admin/account-settings",
    icon: FiSettings,
  },
];

const defaultProfilePhoto = "/admin-avatar.svg";

const getStoredAdminPhoto = () => {
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

function AdminLayout({ onLogout }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [profilePhotoSrc, setProfilePhotoSrc] = useState(getStoredAdminPhoto);

  useEffect(() => {
    const syncProfilePhoto = () => {
      setProfilePhotoSrc(getStoredAdminPhoto());
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === "admin") {
        syncProfilePhoto();
      }
    };

    window.addEventListener(ADMIN_PROFILE_UPDATED_EVENT, syncProfilePhoto);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(ADMIN_PROFILE_UPDATED_EVENT, syncProfilePhoto);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return (
    <main
      className={`dashboard-shell ${collapsed ? "dashboard-shell--collapsed" : ""}`}
    >
      <aside
        className={`dashboard-sidebar ${collapsed ? "dashboard-sidebar--collapsed" : ""}`}
      >
        <NavLink
          to="/admin/dashboard"
          className="dashboard-sidebar__brand-link"
          aria-label="Go to dashboard home"
        >
          <div className="dashboard-sidebar__brand">
            <img
              className="dashboard-sidebar__logo"
              src="/brand-logo.png"
              alt="What you Eat?"
            />
            <div className="dashboard-sidebar__brand-copy">
              <span className="dashboard-sidebar__eyebrow">Dashboard</span>
            </div>
          </div>
        </NavLink>

        <nav className="dashboard-nav" aria-label="Dashboard navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "dashboard-nav__item",
                    isActive ? "dashboard-nav__item--active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
              >
                <Icon
                  className="dashboard-nav__icon"
                  aria-hidden="true"
                  focusable="false"
                />
                <span className="dashboard-nav__label">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <button
          className="dashboard-sidebar__logout"
          type="button"
          onClick={onLogout}
        >
          <FiLogOut aria-hidden="true" focusable="false" />
          <span>Logout</span>
        </button>
      </aside>

      <section className="dashboard-content">
        <header className="dashboard-topbar">
          <button
            className={`dashboard-icon-button dashboard-icon-button--toggle ${collapsed ? "dashboard-icon-button--toggle-collapsed" : ""}`}
            type="button"
            onClick={() => setCollapsed((current) => !current)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className="dashboard-toggle-icon" aria-hidden="true">
              {collapsed ? (
                <FiMenu focusable="false" />
              ) : (
                <FiX focusable="false" />
              )}
            </span>
          </button>

          <div className="dashboard-topbar__spacer" />

          <button
            className="dashboard-icon-button dashboard-icon-button--bell"
            type="button"
            aria-label="Notifications"
          >
            <FiBell aria-hidden="true" focusable="false" />
            <span className="dashboard-notification-dot" />
          </button>

          <div className="dashboard-profile">
            <img
              className="dashboard-profile__photo"
              src={profilePhotoSrc}
              alt="Admin profile"
            />
          </div>
        </header>

        <Outlet />
      </section>
    </main>
  );
}

export default AdminLayout;
