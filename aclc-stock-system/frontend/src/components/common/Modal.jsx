export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  overlayClassName,
}) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm ${overlayClassName}`}
      >
        <div className="bg-white rounded-xl w-full max-w-lg max-h-[90dvh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-slate-200 shrink-0">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button onClick={onClose} className="text-slate-500 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 overflow-y-auto flex-1">{children}</div>
        </div>
      </div>
    </>
  );
}
