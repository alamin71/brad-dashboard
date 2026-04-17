import { useMemo, useState } from "react";
import { FiFilter } from "react-icons/fi";

type MonthlyPoint = {
  month: string;
  value: number;
};

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const buildMonthlySeries = (seed: number): MonthlyPoint[] => {
  return monthLabels.map((month, index) => {
    const seasonalWave = Math.sin((index / 11) * Math.PI * 2) * 18;
    const trend = index * 9;
    const noise = ((seed + index * 17) % 13) * 2;

    return {
      month,
      value: Math.max(18, Math.round(seed + trend + seasonalWave + noise)),
    };
  });
};

const runningYear = new Date().getFullYear();

const yearSeriesMap: Record<number, MonthlyPoint[]> = {
  [runningYear]: buildMonthlySeries(96),
  [runningYear - 1]: buildMonthlySeries(74),
  [runningYear - 2]: buildMonthlySeries(54),
  [runningYear - 3]: buildMonthlySeries(62),
};

const getAvailableYears = () => {
  const years = [
    runningYear,
    runningYear - 1,
    runningYear - 2,
    runningYear - 3,
  ];

  return years.filter((year) => Boolean(yearSeriesMap[year]));
};

const buildSmoothPath = (points: Array<{ x: number; y: number }>) => {
  if (points.length === 0) {
    return "";
  }

  if (points.length === 1) {
    return `M${points[0].x} ${points[0].y}`;
  }

  const path = [`M${points[0].x} ${points[0].y}`];

  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const controlX = (current.x + next.x) / 2;

    path.push(
      `C${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`,
    );
  }

  return path.join(" ");
};

function AdminDashboardPage() {
  const [selectedYear, setSelectedYear] = useState(() => {
    return yearSeriesMap[runningYear] ? runningYear : getAvailableYears()[0];
  });

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

  const yearOptions = useMemo(() => getAvailableYears(), []);
  const monthlySeries =
    yearSeriesMap[selectedYear] ?? yearSeriesMap[runningYear];
  const maxValue = Math.max(...monthlySeries.map((item) => item.value));
  const chartWidth = 640;
  const chartHeight = 220;
  const chartPadding = 24;
  const chartPoints = monthlySeries.map((item, index) => {
    const x =
      chartPadding +
      (index * (chartWidth - chartPadding * 2)) / (monthlySeries.length - 1);
    const y =
      chartHeight -
      chartPadding -
      (item.value / maxValue) * (chartHeight - chartPadding * 2);

    return { ...item, x, y };
  });

  const linePath = buildSmoothPath(chartPoints);

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
          <div className="dashboard-overview-chart__heading-copy">
            <h2>Monthly User Growth</h2>
            <p>Year-wise Jan to Dec user growth trend for the selected year.</p>
          </div>
          <div className="dashboard-overview-chart__filter">
            <span
              className="dashboard-overview-chart__filter-icon"
              aria-hidden="true"
            >
              <FiFilter />
            </span>
            <label
              className="dashboard-overview-chart__filter-label"
              htmlFor="dashboard-year-filter"
            >
              Year
            </label>
            <select
              id="dashboard-year-filter"
              className="dashboard-overview-chart__filter-select"
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              aria-label="Select growth year"
            >
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
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
                key={`${point.month}-point`}
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
                key={point.month}
              >
                <span className="dashboard-overview-chart__value">
                  {point.value}
                </span>
                <span className="dashboard-overview-chart__label">
                  {point.month}
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
