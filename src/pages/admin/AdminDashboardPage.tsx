function AdminDashboardPage() {
  const overviewItems = [
    {
      label: "Total User",
      value: 3542,
      note: "Total count of the user on this platform",
    },
    {
      label: "New User",
      value: 312,
      note: "Who joined last 30 days",
    },
    {
      label: "Deactivated User",
      value: 39,
      note: "Who deactivated their account last 30 days",
    },
    {
      label: "Deleted User",
      value: 17,
      note: "Who deleted their account last 30 days",
    },
  ];

  const maxValue = Math.max(...overviewItems.map((item) => item.value));

  return (
    <section className="dashboard-hero dashboard-hero--wide">
      <p className="dashboard-eyebrow">Admin Dashboard</p>
      <h1 className="dashboard-title">Dashboard Overview</h1>
      <p className="dashboard-copy">
        Monitor your key user metrics in one place, with a quick activity trend
        snapshot below.
      </p>

      <div className="dashboard-stats dashboard-stats--grid dashboard-stats--overview">
        {overviewItems.map((item) => (
          <article
            className="dashboard-stat dashboard-stat--overview"
            key={item.label}
          >
            <span className="dashboard-stat__value">{item.value}</span>
            <span className="dashboard-stat__label">{item.label}</span>
            <p className="dashboard-stat__note">{item.note}</p>
          </article>
        ))}
      </div>

      <section
        className="dashboard-overview-chart"
        aria-label="Overview trend chart"
      >
        <div className="dashboard-overview-chart__header">
          <h2>Overview Trend</h2>
          <p>Animated comparison based on current overview data.</p>
        </div>

        <div
          className="dashboard-overview-chart__plot"
          role="img"
          aria-label="Overview data bars"
        >
          {overviewItems.map((item, index) => {
            const barHeight = Math.max(
              8,
              Math.round((item.value / maxValue) * 100),
            );

            return (
              <div
                className="dashboard-overview-chart__column"
                key={`${item.label}-bar`}
              >
                <span className="dashboard-overview-chart__value">
                  {item.value}
                </span>
                <div className="dashboard-overview-chart__bar-track">
                  <div
                    className="dashboard-overview-chart__bar-fill"
                    style={{
                      height: `${barHeight}%`,
                      animationDelay: `${index * 0.1}s`,
                    }}
                  />
                </div>
                <span className="dashboard-overview-chart__label">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}

export default AdminDashboardPage;
