import PaymentMethodSelect from "@/components/payment/PaymentMethodSelect";

export default function ReservationForm({
  user,
  item,
  quantity,
  setQuantity,
  selectedSize,
  setSelectedSize,
  notes,
  setNotes,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  openSelect,
  setOpenSelect,
  onCancel,
  onContinue,
}) {
  return (
    <div className="space-y-4 py-2">
      <div>
        <label className="text-sm font-medium leading-none">Your Name</label>

        <input
          type="text"
          value={user.name || ""}
          className="inline-flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm cursor-not-allowed"
          readOnly
        />
      </div>

      <div>
        <label className="text-sm font-medium leading-none">USN</label>

        <input
          type="text"
          value={user.usn || ""}
          className="inline-flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm cursor-not-allowed"
          readOnly
        />
      </div>

      {item.item_sizes && item.item_sizes.length > 0 && (
        <div className="relative">
          <label className="text-sm font-medium leading-none">Size</label>

          <button
            type="button"
            className="inline-flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm"
            onClick={() => setOpenSelect(!openSelect)}
          >
            {selectedSize || "Select Size"}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>

          {openSelect && (
            <ul className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-md">
              {item.item_sizes.map((option) => (
                <li
                  key={option.item_sizes}
                  onClick={() => {
                    setSelectedSize(option.item_sizes);
                    setOpenSelect(false);
                  }}
                  className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                >
                  {option.item_sizes}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div>
        <label className="text-sm font-medium leading-none">Quantity</label>

        <input
          type="number"
          value={quantity}
          onChange={(e) => {
            const val = Number(e.target.value);
            setQuantity(val < 1 ? 1 : val);
          }}
          className="inline-flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm"
        />
      </div>

      <PaymentMethodSelect
        selectedPaymentMethod={selectedPaymentMethod}
        onSelect={setSelectedPaymentMethod}
      />

      <div>
        <label className="text-sm font-medium leading-none">
          Notes (optional)
        </label>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special requests..."
          className="inline-flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm"
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-4 py-4 border-t border-slate-200 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 mt-1.5 sm:mt-0"
        >
          <span>Cancel</span>
        </button>

        <button
          type="button"
          disabled={!selectedPaymentMethod}
          onClick={onContinue}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-colors shadow h-9 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold mb-1.5 sm:mb-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>
            {selectedPaymentMethod === "Cash"
              ? `Reserve: ${item.item_name}`
              : "Proceed to Payment"}
          </span>
        </button>
      </div>
    </div>
  );
}
