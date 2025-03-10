"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useState, useEffect } from "react";

// Function to format transactions into monthly totals
const processTransactions = (transactions) => {
  const monthlyData = {};

  transactions.forEach(({ amount, date }) => {
    const month = new Date(date).toLocaleString("default", { month: "short", year: "numeric" });

    if (!monthlyData[month]) {
      monthlyData[month] = 0;
    }
    monthlyData[month] += amount;
  });

  return Object.entries(monthlyData).map(([month, total]) => ({ month, total }));
};

export default function ExpenseChart({ transactions }) {
  const [loading, setLoading] = useState(true);
  const chartData = useMemo(() => processTransactions(transactions), [transactions]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500); // Simulating API delay
    return () => clearTimeout(timer);
  }, [transactions]);

  return (
    <Card className="border shadow-md w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">📊 Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent className="h-64 w-full flex items-center justify-center">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-400 animate-pulse">Loading...</p>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <XAxis dataKey="month" stroke="#aaa" />
              <YAxis stroke="#aaa" />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <Bar dataKey="total" fill="#4F46E5" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-400">No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
