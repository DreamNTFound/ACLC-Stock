import { useState } from "react";
import { paymentMethodOptions } from "@/utils/formatHelpers";

export default function PaymentMethodSelect({
  selectedPaymentMethod,
  onSelect,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <label className="text-sm font-medium leading-none">
        Mode of Payment
      </label>
      <button
        type="button"
        className="inline-flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm"
        onClick={() => setOpen(!open)}
      >
        {selectedPaymentMethod || "Select Payment Method"}
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
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {open && (
        <ul className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-md">
          {paymentMethodOptions.map((option) => (
            <li
              key={option}
              onClick={() => {
                onSelect(option);
                setOpen(false);
              }}
              className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
