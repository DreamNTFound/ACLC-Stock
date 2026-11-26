import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { BarChart2 } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";

export const ReservationChart = ({ reservations }) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const label = format(date, "MMM d");
    const dayStart = startOfDay(date).getTime();
    const dayEnd = dayStart + 86400000;
    const count = reservations.filter((r) => {
      const t = new Date(r.created_at).getTime();
      return t >= dayStart && t < dayEnd;
    }).length;
    return { label, count };
  });

  return (
    <>
      <div className="p-6 pt-0 pb-2">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={days} barSize={24}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />

            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              width={24}
            />

            <Tooltip
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                border: "1px solid #e2e8f0",
              }}
              cursor={{ fill: "#f8fafc" }}
              formatter={(v) => [v, "Reservations"]}
            />

            <Bar dataKey="count" fill="#d4a843" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};
