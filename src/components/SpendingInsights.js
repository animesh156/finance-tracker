export default function SpendingInsights({ transactions, budgets }) {
    const insights = budgets.map((budget) => {
      const actualSpent = transactions
        .filter((t) => t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);
  
      const remaining = budget.amount - actualSpent;
      return {
        category: budget.category,
        status: remaining < 0 ? "Overspent" : "Within Budget",
        remaining,
      };
    });
  
    return (
      <div className="space-y-2">
        {insights.map(({ category, status, remaining }) => (
          <p key={category} className={status === "Overspent" ? "text-red-500" : "text-green-500"}>
            {category}: {status} ({remaining >= 0 ? `$${remaining} left` : `Overspent by $${-remaining}`})
          </p>
        ))}
      </div>
    );
  }
  