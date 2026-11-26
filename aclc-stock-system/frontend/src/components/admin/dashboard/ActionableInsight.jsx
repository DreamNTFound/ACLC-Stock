import { NavLink } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const ActionableInsight = ({ alertStock, reservation }) => {
  const insights = [];

  const getTotalStock = (alertStock) => {
    if (alertStock.item_sizes && alertStock.item_sizes.length > 0) {
      return alertStock.item_sizes.reduce(
        (total, size) => total + size.item_stock,
        0,
      );
    }
    return alertStock.item_stock || 0;
  };

  const outOfStock = alertStock.filter((item) => getTotalStock(item) === 0);
  const lowStock = alertStock.filter(
    (item) => getTotalStock(item) > 0 && getTotalStock(item) <= 5,
  );

  if (outOfStock.length > 0) {
    insights.push({
      type: "danger",
      message: `Restock ${outOfStock.length} Out-of-Stock Item${outOfStock.length > 1 ? "s" : ""} to avoid student shortages.`,
      link: "/merchandise?filter=out-of-stock",
    });
  }

  if (lowStock.length > 0) {
    insights.push({
      type: "warning",
      message: `${lowStock.length} item${lowStock.length > 1 ? "s are" : " is"} running low — consider restocking soon.`,
      link: "/merchandise?filter=low-stock",
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: "success",
      message:
        "Everything looks great! Inventory is healthy and reservations are up-to-date.",
      link: null,
    });
  }

  if (reservation > 0) {
    insights.push({
      type: "warning",
      message: `You have ${reservation} pending reservation${reservation > 1 ? "s" : ""} that need attention.`,
      link: "/reservations?filter=Pending",
    });
  }

  const colors = {
    danger: "border-l-4 border-red-500 bg-red-50 text-red-700",
    warning: "border-l-4 border-amber-500 bg-amber-50 text-amber-700",
    success: "border-l-4 border-emerald-500 bg-emerald-50 text-emerald-700",
  };

  return (
    <>
      <div className="p-6 pt-0 space-y-2">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className={`px-4 py-3 rounded-r-lg text-sm font-medium flex items-center justify-between gap-3 ${colors[insight.type]}`}
          >
            <span>{insight.message}</span>
            {insight.link && (
              <NavLink
                to={insight.link}
                className="shrink-0 opacity-70 hover:opacity-100"
              >
                <ArrowRight className="w-4 h-4" />
              </NavLink>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
