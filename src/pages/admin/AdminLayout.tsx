import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  FiBell,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiLogOut,
  FiSettings,
  FiUsers,
} from "react-icons/fi";

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

function AdminLayout({ onLogout }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <main
      className={`dashboard-shell ${collapsed ? "dashboard-shell--collapsed" : ""}`}
    >
      <aside
        className={`dashboard-sidebar ${collapsed ? "dashboard-sidebar--collapsed" : ""}`}
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
            className="dashboard-icon-button dashboard-icon-button--toggle"
            type="button"
            onClick={() => setCollapsed((current) => !current)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <FiChevronRight aria-hidden="true" focusable="false" />
            ) : (
              <FiChevronLeft aria-hidden="true" focusable="false" />
            )}
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
              src="/admin-avatar.svg"
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
