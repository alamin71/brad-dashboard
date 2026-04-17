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
  const chartWidth = 640;
  const chartHeight = 220;
  const chartPadding = 24;
  const chartPoints = overviewItems.map((item, index) => {
    const x =
      chartPadding +
      (index * (chartWidth - chartPadding * 2)) / (overviewItems.length - 1);
    const y =
      chartHeight -
      chartPadding -
      (item.value / maxValue) * (chartHeight - chartPadding * 2);

    return { ...item, x, y };
  });

  const linePath = chartPoints
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");

  const pointAreaPath = `${linePath} L ${chartWidth - chartPadding} ${chartHeight - chartPadding} L ${chartPadding} ${chartHeight - chartPadding} Z`;

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
          <p>Animated line view based on current overview data.</p>
        </div>

        <div
          className="dashboard-overview-chart__plot dashboard-overview-chart__plot--line"
          role="img"
          aria-label="Overview data line chart"
        >
          <svg
            className="dashboard-overview-chart__svg"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="overviewLineGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#ff4f47" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ff4f47" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            <path
              className="dashboard-overview-chart__area"
              d={pointAreaPath}
            />
            <path className="dashboard-overview-chart__line" d={linePath} />

            {chartPoints.map((point, index) => (
              <g
                key={`${point.label}-point`}
                className="dashboard-overview-chart__node-group"
              >
                <circle
                  className="dashboard-overview-chart__node"
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  style={{ animationDelay: `${index * 0.12}s` }}
                />
                <circle
                  className="dashboard-overview-chart__node-ring"
                  cx={point.x}
                  cy={point.y}
                  r="12"
                  style={{ animationDelay: `${index * 0.12}s` }}
                />
              </g>
            ))}
          </svg>

          <div className="dashboard-overview-chart__labels">
            {chartPoints.map((point) => (
              <div
                className="dashboard-overview-chart__label-group"
                key={point.label}
              >
                <span className="dashboard-overview-chart__value">
                  {point.value}
                </span>
                <span className="dashboard-overview-chart__label">
                  {point.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}

export default AdminDashboardPage;
