export default function Footer() {
  return (
    <>
      <div className="max-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-[#d4a843]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
              />
            </svg>
            <span className="font-semibold text-[#1e3a5f]">ACLCStock</span>
            <span className="text-slate-300">|</span>
            <span>ACLC College of Tacloban</span>
          </div>
          <p className="text-xs text-slate-400">© 2026 All rights reserved.</p>
        </div>
      </div>
    </>
  );
}
