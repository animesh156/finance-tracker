"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function BudgetForm({ setBudgets, setBudgetModalOpen }) {
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Other",
  ];

  const fetchBudgets = async () => {
    try {
      const { data } = await axios.get("/api/budgets");
      setBudgets(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError("Budget must be a positive number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post("/api/budgets", {
        category,
        amount: parseFloat(amount),
      });

      await fetchBudgets();

      setBudgetModalOpen(false);
    } catch (error) {
      setError("Failed to set budget.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <Input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Budget Amount"
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Set Budget"}
      </Button>
    </form>
  );
}
