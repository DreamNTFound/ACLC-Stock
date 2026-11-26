import { useNavigate } from "react-router-dom";
import { ShieldX } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <ShieldX className="h-8 w-8 text-amber-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-800">Access Denied</h1>

        <p className="mt-3 text-sm leading-6 text-slate-600">
          You don't have permission to access this page. Please return to a page
          available to your account.
        </p>

        <button
          onClick={() => navigate("/store", { replace: true })}
          className="mt-6 w-full rounded-lg bg-[#214574] px-4 py-3 font-semibold text-white transition hover:bg-[#19375c]"
        >
          Return to Store
        </button>
      </div>
    </div>
  );
}
