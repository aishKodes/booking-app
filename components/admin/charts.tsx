"use client";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
export const chartColors = ["#bf3543", "#d4b6a5", "#817c72", "#a9b096"];
const axis = { tickLine: false, axisLine: false, tick: { fill: "#85847b", fontSize: 11 } };
const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #e9e7e1",
  fontSize: 12,
  boxShadow: "0 5px 25px #0000000c",
};
export function TrendChart({
  data,
  metric = "reservations",
  area = false,
}: {
  data: { label: string; reservations?: number; covers?: number }[];
  metric?: "reservations" | "covers";
  area?: boolean;
}) {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
        {area ? (
          <AreaChart
            data={data}
            margin={{ top: 8, right: 8, left: -25, bottom: 0 }}
            accessibilityLayer
          >
            <defs>
              <linearGradient id="coverFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#bf3543" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#bf3543" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#eeeae4" />
            <XAxis dataKey="label" {...axis} minTickGap={25} />
            <YAxis {...axis} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#ded8d0" }} />
            <Area
              type="monotone"
              dataKey={metric}
              name={metric === "covers" ? "Covers" : "Reservations"}
              stroke="#bf3543"
              strokeWidth={2.5}
              fill="url(#coverFill)"
              isAnimationActive={false}
            />
          </AreaChart>
        ) : (
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: -25, bottom: 0 }}
            accessibilityLayer
          >
            <CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#eeeae4" />
            <XAxis dataKey="label" {...axis} minTickGap={25} />
            <YAxis {...axis} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f8f5ef" }} />
            <Bar
              dataKey={metric}
              name={metric === "covers" ? "Covers" : "Reservations"}
              fill="#bf3543"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
              isAnimationActive={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={i === data.length - 1 ? "#bf3543" : "#dfb0b6"} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
export function SourceChart({ data }: { data: { name: string; value: number }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  return (
    <div className="source-chart">
      <div className="donut-wrap">
        <ResponsiveContainer width="100%" height="100%" minWidth={1}>
          <PieChart accessibilityLayer>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={57}
              outerRadius={77}
              paddingAngle={3}
              stroke="none"
              isAnimationActive={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={chartColors[i % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-label">
          <strong>{total}</strong>
          <span>bookings</span>
        </div>
      </div>
      <div className="chart-legend">
        {data.map((d, i) => (
          <div key={d.name}>
            <span>
              <i style={{ background: chartColors[i] }} />
              {d.name}
            </span>
            <strong>{total ? Math.round((d.value / total) * 100) : 0}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
