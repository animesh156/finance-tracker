"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function CategoryPieChart({ transactions }) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A83279", "#7D3C98"];

  // 🔥 Use useMemo to ensure `chartData` updates immediately when transactions change
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const categoryTotals = transactions.reduce((acc, { category, amount }) => {
      const validCategory = category && category.trim() !== "" ? category : "Other"; // ✅ Default to "Other"
      acc[validCategory] = (acc[validCategory] || 0) + amount;
      return acc;
    }, {});

    const formattedData = Object.keys(categoryTotals).map((key) => ({
      name: key,
      value: categoryTotals[key],
    }));

    console.log("Updated Chart Data:", formattedData); // 🔍 Debugging output
    return formattedData;
  }, [transactions]); // ✅ Depend only on `transactions`, recompute instantly when it changes

  return (
    <PieChart width={300} height={280}>
      <Pie data={chartData} cx="50%" cy="50%" label outerRadius={80} fill="#8884d8" dataKey="value">
        {chartData.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}
