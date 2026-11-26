import { LucideShieldCheck } from "lucide-react";

export const InventoryHealth = ({ items }) => {
  const totalItems = items.length;

  const getTotalStock = (item) => {
    if (item.item_sizes && item.item_sizes.length > 0) {
      return item.item_sizes.reduce(
        (total, size) => total + size.item_stock,
        0,
      );
    }
    return item.item_stock || 0;
  };

  const inStock = items.filter((item) => getTotalStock(item) > 5);
  const outOfStock = items.filter((item) => getTotalStock(item) === 0);
  const lowStock = items.filter(
    (item) => getTotalStock(item) > 0 && getTotalStock(item) <= 5,
  );

  let status, emoji, color, bg, desc;

  if (totalItems === 0) {
    status = "No items";
    emoji = "📦";
    color = "text-slate-500";
    bg = "bg-slate-50";
    desc = "No  merchandise added yet.";
  } else if (outOfStock.length / totalItems > 0.3) {
    status = "Critical";
    emoji = "🔴";
    color = "text-red-600";
    bg = "bg-red-50";
    desc = `${outOfStock.length} item${outOfStock.length > 1 ? "s" : ""} out of stock — immediate restock needed!`;
  } else if (lowStock.length / totalItems > 0.3) {
    status = "Warning";
    emoji = "🟡";
    color = "text-amber-600";
    bg = "bg-amber-50";
    desc = `${lowStock.length} item${lowStock.length > 1 ? "s" : ""} running low — consider restocking soon.`;
  } else {
    status = "Healthy";
    emoji = "🟢";
    color = "text-emerald-600";
    bg = "bg-emerald-50";
    desc = `Inventory is healthy with ${inStock.length} item${inStock.length > 1 ? "s" : ""} in good stock.`;
  }

  const pctIn =
    totalItems > 0 ? Math.round((inStock.length / totalItems) * 100) : 0;
  const pctOut =
    totalItems > 0 ? Math.round((outOfStock.length / totalItems) * 100) : 0;
  const pctLow =
    totalItems > 0 ? Math.round((lowStock.length / totalItems) * 100) : 0;

  return (
    <>
      <div className="space-y-4 p-6 pt-0">
        <div className={`${bg} rounded-xl p-4 flex items-center gap-4`}>
          <span className="text-3xl">{emoji}</span>
          <div>
            <p className={`text-lg font-bold ${color}`}>{status}</p>
            <p className="text-sm text-slate-600">{desc}</p>
          </div>
        </div>

        {totalItems > 0 && (
          <>
            <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
              {pctIn > 0 && (
                <div
                  className="bg-emerald-500 transition-all"
                  style={{ width: `${pctIn}%` }}
                />
              )}
              {pctOut > 0 && (
                <div
                  className="bg-red-500 transition-all"
                  style={{ width: `${pctOut}%` }}
                />
              )}
              {pctLow > 0 && (
                <div
                  className="bg-amber-500 transition-all"
                  style={{ width: `${pctLow}%` }}
                />
              )}
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {inStock.length} in stock
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                {outOfStock.length} out of stock
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {lowStock.length} low stock
              </span>
            </div>
          </>
        )}
      </div>
    </>
  );
};
