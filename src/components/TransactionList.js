"use client";
import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <div>
      <h2 className="text-lg font-semibold mb-3">💰 Your Transactions</h2>
      <div className="max-h-80 overflow-y-auto border border-gray-300 dark:border-gray-700 rounded-lg p-2">
        <ul className="space-y-3">
          {transactions.map((t) => (
            <li
              key={t._id}
              className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-900 transition-all xl:w-[580px]  w-full"
            >
              {editId === t._id ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="flex-1 min-w-0"
                  />
                  <Input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-24 text-center"
                  />
                  <Input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-32 text-center"
                  />
                  <div className="flex gap-2">
                    
                      <Check onClick={handleUpdate} className="md:size-5 hover:cursor-pointer text-green-400 hover:text-green-600 size-4" />
                 
                   
                      <X onClick={() => setEditId(null)} className="md:size-5 size-4 hover:cursor-pointer text-red-500 hover:text-red-700" />
                    
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium truncate flex-1">
                    {t.description}
                  </span>
                  <span className="text-sm font-bold text-green-600 text-center w-20">
                    ${t.amount}
                  </span>
                  <span className="text-xs text-gray-500 text-center w-24">
                    {new Date(t.date).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                   
                    
                      <Pencil  onClick={() => handleEdit(t)} className="md:size-5 text-blue-400 hover:cursor-pointer hover:text-blue-600 size-4" />
                  
                  
                      <Trash onClick={() => handleDelete(t._id)} className="md:size-5 hover:cursor-pointer text-red-500 hover:text-red-700 size-4" />
                   

                   


                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
