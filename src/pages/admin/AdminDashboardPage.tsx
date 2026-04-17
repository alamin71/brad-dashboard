import { useMemo, useState } from "react";
import { FiFilter } from "react-icons/fi";

type MetricKey = "totalUser" | "newUser" | "deactivatedUser" | "deletedUser";

type MonthlyPoint = {
  month: string;
  value: number;
  x: number;
  y: number;
};

type HoveredPoint = {
  month: string;
  metricLabel: string;
  value: number;
  color: string;
  leftPercent: number;
  topPercent: number;
};

type YearSeries = Record<MetricKey, number[]>;

type MetricConfig = {
  key: MetricKey;
  label: string;
  color: string;
  fillColor: string;
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

const metricConfigs: MetricConfig[] = [
  {
    key: "totalUser",
    label: "Total User",
    color: "#dd0f0a",
    fillColor: "rgba(221, 15, 10, 0.12)",
  },
  {
    key: "newUser",
    label: "New User",
    color: "#f97316",
    fillColor: "rgba(249, 115, 22, 0.12)",
  },
  {
    key: "deactivatedUser",
    label: "Deactivated User",
    color: "#2563eb",
    fillColor: "rgba(37, 99, 235, 0.12)",
  },
  {
    key: "deletedUser",
    label: "Deleted User",
    color: "#7c3aed",
    fillColor: "rgba(124, 58, 237, 0.12)",
  },
];

const buildMetricSeries = (
  seed: number,
  base: number,
  trend: number,
  amplitude: number,
) => {
  return monthLabels.map((_, index) => {
    const wave = Math.sin((index / 11) * Math.PI * 2) * amplitude;
    const variation = ((seed + index * 19) % 11) - 5;

    return Math.max(8, Math.round(base + index * trend + wave + variation));
  });
};

const buildYearSeries = (seed: number): YearSeries => {
  return {
    totalUser: buildMetricSeries(seed + 11, 95, 6.4, 12),
    newUser: buildMetricSeries(seed + 21, 56, 4.6, 10),
    deactivatedUser: buildMetricSeries(seed + 31, 36, 3.4, 8),
    deletedUser: buildMetricSeries(seed + 41, 24, 2.4, 6),
  };
};

const runningYear = new Date().getFullYear();

const yearSeriesMap: Record<number, YearSeries> = {
  [runningYear]: buildYearSeries(96),
  [runningYear - 1]: buildYearSeries(74),
  [runningYear - 2]: buildYearSeries(54),
  [runningYear - 3]: buildYearSeries(62),
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

const buildAreaPath = (
  path: string,
  points: Array<{ x: number; y: number }>,
  chartHeight: number,
  chartPadding: number,
) => {
  if (!points.length) {
    return "";
  }

  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  return `${path} L ${lastPoint.x} ${chartHeight - chartPadding} L ${firstPoint.x} ${chartHeight - chartPadding} Z`;
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
  const selectedYearSeries =
    yearSeriesMap[selectedYear] ?? yearSeriesMap[runningYear];
  const allValues = metricConfigs.flatMap(
    (config) => selectedYearSeries[config.key],
  );
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const yRangePadding = Math.max(10, Math.round((maxValue - minValue) * 0.18));
  const domainMax = maxValue + yRangePadding;
  const domainMin = Math.max(0, minValue - yRangePadding);
  const chartWidth = 640;
  const chartHeight = 260;
  const chartPadding = 22;
  const [hoveredPoint, setHoveredPoint] = useState<HoveredPoint | null>(null);

  const yTicks = Array.from({ length: 4 }, (_, index) => {
    const ratio = index / 3;
    return Math.round(domainMax - ratio * (domainMax - domainMin));
  });

  const toY = (value: number) => {
    const safeRange = Math.max(1, domainMax - domainMin);
    const normalized = (value - domainMin) / safeRange;

    return (
      chartHeight - chartPadding - normalized * (chartHeight - chartPadding * 2)
    );
  };

  const pointsByMetric = metricConfigs.map((config) => {
    const points: MonthlyPoint[] = monthLabels.map((month, index) => {
      const value = selectedYearSeries[config.key][index];
      const x =
        chartPadding +
        (index * (chartWidth - chartPadding * 2)) / (monthLabels.length - 1);
      const y = toY(value);

      return {
        month,
        value,
        x,
        y,
      };
    });

    return {
      ...config,
      points,
      linePath: buildSmoothPath(points),
      areaPath: buildAreaPath(
        buildSmoothPath(points),
        points,
        chartHeight,
        chartPadding,
      ),
    };
  });

  const handlePointHover = (point: MonthlyPoint, metric: MetricConfig) => {
    setHoveredPoint({
      month: point.month,
      metricLabel: metric.label,
      value: point.value,
      color: metric.color,
      leftPercent: (point.x / chartWidth) * 100,
      topPercent: (point.y / chartHeight) * 100,
    });
  };

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
          aria-label="Monthly multi-metric growth line chart"
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <div className="dashboard-overview-chart__y-axis" aria-hidden="true">
            {yTicks.map((tick) => (
              <span key={tick}>{tick}</span>
            ))}
          </div>

          <svg
            className="dashboard-overview-chart__svg"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            preserveAspectRatio="none"
          >
            <defs>
              {pointsByMetric.map((metric, index) => (
                <linearGradient
                  key={`${metric.key}-gradient`}
                  id={`overviewLineGradient-${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={metric.color}
                    stopOpacity="0.28"
                  />
                  <stop
                    offset="100%"
                    stopColor={metric.color}
                    stopOpacity="0.01"
                  />
                </linearGradient>
              ))}
            </defs>

            {yTicks.map((tick) => {
              const y = toY(tick);

              return (
                <line
                  key={`grid-${tick}`}
                  className="dashboard-overview-chart__grid-line"
                  x1={chartPadding}
                  x2={chartWidth - chartPadding}
                  y1={y}
                  y2={y}
                />
              );
            })}

            {pointsByMetric.map((metric, metricIndex) => (
              <g key={`${metric.key}-series`}>
                <path
                  className="dashboard-overview-chart__area"
                  d={metric.areaPath}
                  style={{
                    fill: `url(#overviewLineGradient-${metricIndex})`,
                    animationDelay: `${metricIndex * 0.08}s`,
                  }}
                />
                <path
                  className="dashboard-overview-chart__line"
                  d={metric.linePath}
                  style={{
                    stroke: metric.color,
                    animationDelay: `${metricIndex * 0.08}s`,
                  }}
                />

                {metric.points.map((point, index) => (
                  <g
                    key={`${metric.key}-${point.month}`}
                    className="dashboard-overview-chart__node-group"
                  >
                    <circle
                      className="dashboard-overview-chart__node-ring"
                      cx={point.x}
                      cy={point.y}
                      r="11"
                      style={{
                        fill: metric.fillColor,
                        animationDelay: `${metricIndex * 0.08 + index * 0.04}s`,
                      }}
                    />
                    <circle
                      className="dashboard-overview-chart__node"
                      cx={point.x}
                      cy={point.y}
                      r="4.5"
                      style={{
                        fill: metric.color,
                        animationDelay: `${metricIndex * 0.08 + index * 0.04}s`,
                      }}
                      onMouseEnter={() => handlePointHover(point, metric)}
                      onMouseMove={() => handlePointHover(point, metric)}
                    />
                  </g>
                ))}

                <text
                  className="dashboard-overview-chart__series-label"
                  x={metric.points[0].x + 8}
                  y={metric.points[0].y - (10 - metricIndex * 2)}
                  fill={metric.color}
                >
                  {metric.label}
                </text>
              </g>
            ))}
          </svg>

          {hoveredPoint ? (
            <div
              className="dashboard-overview-chart__tooltip"
              style={{
                left: `${hoveredPoint.leftPercent}%`,
                top: `${Math.max(8, hoveredPoint.topPercent - 12)}%`,
                borderColor: hoveredPoint.color,
              }}
            >
              <strong style={{ color: hoveredPoint.color }}>
                {hoveredPoint.metricLabel}
              </strong>
              <span>{hoveredPoint.month}</span>
              <span>Count: {hoveredPoint.value}</span>
            </div>
          ) : null}

          <div className="dashboard-overview-chart__labels">
            {monthLabels.map((month) => (
              <span className="dashboard-overview-chart__label" key={month}>
                {month}
              </span>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}

export default AdminDashboardPage;
