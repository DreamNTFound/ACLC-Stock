export function ProductImage({ item }) {
  const API_BASE_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000/api"
  ).replace(/\/api\/?$/, "");

  return (
    <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center">
      {item?.item_images?.[0] ? (
        <img
          src={`${API_BASE_URL}/uploads/${item?.item_images?.[0]}`}
          alt="Preview"
          className="w-full h-full object-cover rounded-md"
        />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-package-icon lucide-package w-40 h-40 text-slate-400"
        >
          <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
          <path d="M12 22V12" />
          <polyline points="3.29 7 12 12 20.71 7" />
          <path d="m7.5 4.27 9 5.15" />
        </svg>
      )}
    </div>
  );
}
