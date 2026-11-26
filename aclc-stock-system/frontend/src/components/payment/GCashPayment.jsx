import { formatCurrency } from "@/utils/formatCurrency";
import { paymentConfig, gcashInstructions } from "@/config/paymentConfig";
import Swal from "sweetalert2";

export default function GCashPayment({
  item,
  quantity,
  gcashNumber,
  setGcashNumber,
  paymentError,
  onBack,
  onSubmit,
}) {
  const gcash = paymentConfig.GCash;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(gcash.number);
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "GCash number copied",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div className="space-y-4 py-2">
      {/* Amount */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium opacity-90">Amount to Pay</span>
          <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold bg-white/20 text-white border-white/30">
            GCash
          </div>
        </div>
        <p className="text-3xl font-bold">
          {formatCurrency(item.item_price * quantity)}
        </p>
        <p className="text-xs opacity-75 mt-1">{item.item_name}</p>
      </div>

      {/* Payment Destination */}
      <div className="px-1">
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">₱</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-700">
                GCash Payment
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Send your payment to the ACLC Merchandise GCash account.
              </p>
              <div className="mt-3 bg-white rounded-lg border border-blue-100 p-3">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">
                  GCash Account
                </p>
                <p className="text-sm font-semibold text-[#1e3a5f] mt-1">
                  {gcash.name}
                </p>
                <div className="flex items-center justify-between gap-3 mt-1">
                  <p className="text-lg font-bold tracking-wide text-[#1e3a5f]">
                    {gcash.number}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="space-y-3 px-1">
        <p className="text-sm font-semibold text-slate-700">How to pay</p>

        {gcashInstructions.map((instruction, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
          >
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-blue-600">{i + 1}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700">
                {instruction.title}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {instruction.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Student GCash Number */}
      <div>
        <label className="text-sm font-medium text-slate-700">
          Your GCash Mobile Number
        </label>
        <input
          type="tel"
          placeholder="09XX-XXX-XXXX"
          value={gcashNumber}
          onChange={(e) => setGcashNumber(e.target.value)}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors md:text-sm mt-1"
        />
        <p className="text-xs text-slate-500 mt-1">
          Enter the GCash number you used for the payment.
        </p>
        {paymentError && (
          <p className="text-red-600 text-sm mt-1">{paymentError}</p>
        )}
      </div>

      {/* Verification Notice */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
        <div className="flex items-start gap-2">
          <span className="text-amber-600 text-sm">⚠</span>
          <div>
            <p className="text-sm font-medium text-amber-800">
              Payment requires verification
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Your reservation will be marked as unpaid until an administrator
              verifies the payment.
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-4 py-4 border-t border-slate-200 mt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 flex-1"
        >
          <span>Back</span>
        </button>
        <button
          type="button"
          disabled={!/^09\d{9}$/.test(gcashNumber)}
          onClick={onSubmit}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors shadow h-9 px-4 py-2 flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Submit Payment</span>
        </button>
      </div>
    </div>
  );
}
