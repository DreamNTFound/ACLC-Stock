import Swal from "sweetalert2";
import { formatCurrency } from "@/utils/formatCurrency";

export const showGCashPaymentSuccess = async ({
  item,
  quantity,
  totalAmount,
  transactionRef,
}) => {
  let transactionCopied = false;

  await Swal.fire({
    title: "Payment Successful!",
    html: `
      <div style="text-align:left; padding:0 8px;">

        <div style="
          background:#ecfdf5;
          border:1px solid #a7f3d0;
          border-radius:10px;
          padding:12px;
          margin-bottom:16px;
        ">
          <p style="
            margin:0;
            color:#047857;
            font-weight:600;
            font-size:14px;
          ">
            ✓ Payment submitted successfully
          </p>

          <p style="
            margin:4px 0 0;
            color:#065f46;
            font-size:12px;
          ">
            Your payment is now waiting for verification.
          </p>
        </div>

        <p style="margin-bottom:8px;">
          <strong>Item:</strong> ${item.item_name}
        </p>

        <p style="margin-bottom:8px;">
          <strong>Quantity:</strong> ${quantity}
        </p>

        <p style="margin-bottom:8px;">
          <strong>Total:</strong> ${formatCurrency(totalAmount)}
        </p>

        <p style="margin-bottom:8px;">
          <strong>Payment:</strong> GCash
        </p>

        <p style="margin-bottom:8px;">
          <strong>Status:</strong>
          <span style="
            color:#d97706;
            font-weight:600;
            margin-left:4px;
          ">
            For Verification
          </span>
        </p>

        <hr style="margin:14px 0">

        <div style="
          background:#fff7ed;
          border:1px solid #fed7aa;
          border-radius:10px;
          padding:12px;
          margin-bottom:12px;
        ">
          <p style="
            margin:0 0 4px;
            color:#c2410c;
            font-weight:700;
            font-size:13px;
          ">
            ⚠ Important: Save your transaction reference
          </p>

          <p style="
            margin:0;
            color:#9a3412;
            font-size:12px;
            line-height:1.5;
          ">
            This reference will be used by the administrator
            to verify your payment. Please copy and save it.
          </p>
        </div>

        <p style="
          margin-bottom:6px;
          font-weight:600;
          font-size:13px;
        ">
          Transaction Reference
        </p>

        <div style="
          display:flex;
          align-items:center;
          gap:8px;
          background:#f8fafc;
          border:1px solid #cbd5e1;
          border-radius:8px;
          padding:10px;
        ">

          <p style="
            font-family:monospace;
            word-break:break-all;
            color:#334155;
            margin:0;
            font-size:13px;
            flex:1;
          ">
            ${transactionRef}
          </p>

          <button
            id="copy-transaction-reference"
            type="button"
            style="
              flex-shrink:0;
              background:#2563eb;
              color:white;
              border:none;
              border-radius:6px;
              padding:7px 10px;
              font-size:12px;
              font-weight:600;
              cursor:pointer;
            "
          >
            Copy
          </button>

        </div>

        <p id="copy-message" style="
          color:#64748b;
          font-size:11px;
          margin:6px 0 0;
        ">
          You must copy the reference before continuing.
        </p>

      </div>
    `,

    width: "440px",
    padding: "1.5rem",

    customClass: {
      popup: "mx-4 rounded-xl",
    },

    confirmButtonText: "Continue",
    confirmButtonColor: "#2563eb",

    allowOutsideClick: false,

    didOpen: () => {
      const copyButton = document.getElementById("copy-transaction-reference");

      const copyMessage = document.getElementById("copy-message");
      const confirmButton = Swal.getConfirmButton();

      confirmButton.disabled = true;
      confirmButton.style.opacity = "0.5";
      confirmButton.style.cursor = "not-allowed";

      copyButton.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(transactionRef);

          transactionCopied = true;

          copyButton.textContent = "✓ Copied";
          copyButton.style.background = "#16a34a";

          copyMessage.textContent =
            "Transaction reference copied. You can now continue.";

          copyMessage.style.color = "#16a34a";
          copyMessage.style.fontWeight = "600";

          confirmButton.disabled = false;
          confirmButton.style.opacity = "1";
          confirmButton.style.cursor = "pointer";
        } catch (error) {
          console.error("Failed to copy transaction reference:", error);

          Swal.showValidationMessage(
            "Unable to copy the reference. Please copy it manually.",
          );
        }
      });
    },

    preConfirm: () => {
      if (!transactionCopied) {
        return false;
      }

      return true;
    },
  });
};

export const showReservationSubmitted = async () => {
  await Swal.fire({
    icon: "success",
    title: "Reservation Submitted!",
    html: `
      <p>
        You'll be notified when the item is ready for pickup.
      </p>
    `,
    width: "440px",
    padding: "1.5rem",

    customClass: {
      popup: "mx-4 rounded-xl",
    },

    confirmButtonText: "Close",
  });
};
