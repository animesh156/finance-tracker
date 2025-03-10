"use client";
import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash, Check, X } from "lucide-react";

export default function TransactionList({ transactions, setTransactions }) {
  const [editId, setEditId] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id) => {
    if (loading) return;
    setLoading(true);
    try {
      await axios.delete("/api/transactions", { data: { id } });

      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
    setLoading(false);
  };

  const handleEdit = (transaction) => {
    setEditId(transaction._id);
    setEditAmount(transaction.amount);
    setEditDescription(transaction.description);
    setEditDate(transaction.date);
  };

  const handleUpdate = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await axios.put("/api/transactions", {
        id: editId,
        amount: parseFloat(editAmount),
        description: editDescription,
        date: editDate,
      });

      setTransactions((prev) =>
        prev.map((t) =>
          t._id === editId
            ? {
                _id: editId,
                amount: editAmount,
                description: editDescription,
                date: editDate,
              }
            : t
        )
      );

      setEditId(null);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
    setLoading(false);
  };

  return (
    <div >
    <h2 className="text-lg font-semibold mb-3">💰 Your Transactions</h2>
    <div className="max-h-80 overflow-y-auto space-y-3 border border-gray-300 dark:border-gray-700 rounded-lg p-2">
      <ul className="space-y-3">
        <AnimatePresence>
          {transactions.map((t) => (
            <motion.li
              key={t._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-900 transition-all"
            >
              {editId === t._id ? (
                <div className="grid grid-cols-5 gap-3 items-center">
                  <Input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="col-span-2"
                  />
                  <Input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="text-center"
                  />
                  <Input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="text-center"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleUpdate}
                      className="bg-green-500 text-white px-3"
                    >
                      <Check size={18} />
                    </Button>
                    <Button
                      onClick={() => setEditId(null)}
                      className="bg-gray-500 text-white px-3"
                    >
                      <X size={18} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-5 gap-3 items-center">
                  <span className="text-sm font-medium truncate col-span-2">
                    {t.description}
                  </span>
                  <span className="text-sm font-bold text-green-600 text-center">
                    ${t.amount}
                  </span>
                  <span className="text-xs text-gray-500 text-center">
                    {new Date(t.date).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(t)}
                      className="bg-blue-500 text-white px-3"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      onClick={() => handleDelete(t._id)}
                      className="bg-red-500 text-white px-3"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  </div>
  
  );
}
