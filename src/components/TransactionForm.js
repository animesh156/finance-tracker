"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

export default function TransactionForm({ setTransactions, setIsOpen }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // State for validation errors

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validation checks
    if (!amount || parseFloat(amount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    if (!description.trim()) {
      setError("Description cannot be empty.");
      return;
    }
    if (!date) {
      setError("Please select a date.");
      return;
    }

    setLoading(true);
    setError(""); // Clear previous errors

    try {
      const { data: savedTransaction } = await axios.post("/api/transactions", {
        amount: parseFloat(amount),
        description,
        date,
      });

      setTransactions((prev) => [...prev, savedTransaction]);

      // Reset form
      setAmount("");
      setDescription("");
      setDate("");

      // Close modal after successful transaction
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
      setError("Failed to add transaction. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center">Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>} {/* Error message */}
          
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
            className={error.includes("Amount") ? "border-red-500" : ""}
          />
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
            className={error.includes("Description") ? "border-red-500" : ""}
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className={error.includes("date") ? "border-red-500" : ""}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Adding..." : "Add Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
