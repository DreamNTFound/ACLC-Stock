export const TopItems = ({ reservation, items }) => {
  const itemCount = {};

  const getTotalStock = (items) => {
    if (items.item_sizes && items.item_sizes?.length > 0) {
      return items.item_sizes.reduce(
        (total, size) => total + size.item_stock,
        0,
      );
    }
    return items.item_stock || 0;
  };

  reservation.forEach((r) => {
    const name = r.productId?.item_name;

    if (!itemCount[name]) {
      itemCount[name] = {
        name,
        count: 0,
      };
    }

    itemCount[name].count += 1;
  });

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return { label: "Out of Stock", color: "bg-red-50 text-red-700" };
    }
    if (stock <= 5) {
      return { label: "Low Stock", color: "bg-yellow-50 text-yellow-700" };
    }
    return { label: "In Stock", color: "bg-green-50 text-green-700" };
  };

  const sortedItems = Object.values(itemCount).sort(
    (a, b) => b.count - a.count,
  );

  const topItems = sortedItems.slice(0, 5);

  const maxCount = sortedItems[0]?.count || 1;

  return (
    <>
      {topItems.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-6">
          No reservation data yet.
        </p>
      ) : (
        <div className="space-y-3 p-6 pt-0">
          {topItems.map(({ name, count }, i) => {
            const item = items.find((i) => i.item_name === name);
            const stock = item ? getTotalStock(item) : 0;
            const status = getStockStatus(stock);
            const pct = Math.round((count / maxCount) * 100);
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-4">
                      #{i + 1}
                    </span>
                    <span className="text-sm font-medium text-[#1e3a5f] truncate max-w-[160px]">
                      {name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{count}</span>
                    {item && (
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}
                      >
                        {status.label}
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#d4a843] rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
