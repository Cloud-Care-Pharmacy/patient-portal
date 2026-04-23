"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: "Jan", total: 42 },
  { name: "Feb", total: 38 },
  { name: "Mar", total: 55 },
  { name: "Apr", total: 47 },
  { name: "May", total: 62 },
  { name: "Jun", total: 58 },
  { name: "Jul", total: 73 },
  { name: "Aug", total: 67 },
  { name: "Sep", total: 81 },
  { name: "Oct", total: 76 },
  { name: "Nov", total: 89 },
  { name: "Dec", total: 95 },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="var(--muted-foreground)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            fontSize: 12,
          }}
        />
        <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
