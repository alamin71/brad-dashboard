function AdminDashboardPage() {
  return (
    <section className="dashboard-hero dashboard-hero--wide">
      <p className="dashboard-eyebrow">Admin Dashboard</p>
      <h1 className="dashboard-title">Welcome back, Admin</h1>
      <p className="dashboard-copy">
        Your authentication flow is complete and the dashboard is ready.
      </p>

      <div className="dashboard-stats dashboard-stats--grid dashboard-stats--overview">
        <article className="dashboard-stat dashboard-stat--overview">
          <span className="dashboard-stat__value">3542</span>
          <span className="dashboard-stat__label">Total User</span>
          <p className="dashboard-stat__note">
            Total count of the user on this platform
          </p>
        </article>
        <article className="dashboard-stat dashboard-stat--overview">
          <span className="dashboard-stat__value">312</span>
          <span className="dashboard-stat__label">New User</span>
          <p className="dashboard-stat__note">Who joined last 30 days</p>
        </article>
        <article className="dashboard-stat dashboard-stat--overview">
          <span className="dashboard-stat__value">39</span>
          <span className="dashboard-stat__label">Deactivated User</span>
          <p className="dashboard-stat__note">
            Who deactivated their account last 30 days
          </p>
        </article>
        <article className="dashboard-stat dashboard-stat--overview">
          <span className="dashboard-stat__value">17</span>
          <span className="dashboard-stat__label">Deleted User</span>
          <p className="dashboard-stat__note">
            Who deleted their account last 30 days
          </p>
        </article>
      </div>
    </section>
  );
}

export default AdminDashboardPage;
