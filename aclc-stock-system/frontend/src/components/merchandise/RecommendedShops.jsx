export default function RecommendedShops({ shops }) {
  if (!shops || shops.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow opacity-0 animate-fadeIn">
      <div className="flex flex-col space-y-1.5 p-6 pb-3">
        <div className="font-semibold tracking-tight text-lg text-[#1e3a5f] flex items-center gap-2">
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
              d="M15 10.5a3 3 0 1 1-6 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
            />
          </svg>

          <span>Recommended Local Shops</span>
        </div>

        <p className="text-sm text-slate-500">
          This item is currently out of stock. You may find similar items at
          these nearby shops:
        </p>
      </div>

      <div className="p-6 pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {shops.map((shop) => (
            <div
              key={shop._id}
              className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-[#1e3a5f] text-lg">
                        {shop.shopName}
                      </h3>

                      {shop.partner && (
                        <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors shadow hover:bg-primary/80 bg-[#d4a843]/15 text-[#d4a843] border-[#d4a843]/30 text-[10px]">
                          <span className="text-yellow-400 text-xs">
                            ★ Partner
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-2 text-sm text-slate-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4 mt-0.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10.5a3 3 0 1 1-6 0Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                        />
                      </svg>

                      <span>{shop.address}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
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
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>

                  <span>{shop.contact}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {shop.avail_items.map((availableItem, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors border-transparent bg-slate-100 text-secondary-foreground text-[10px]"
                    >
                      {availableItem}
                    </div>
                  ))}
                </div>

                <a
                  href={shop.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors border bg-background shadow-sm hover:text-accent-foreground h-8 rounded-md px-3 text-xs w-full text-[#1e3a5f] border-[#1e3a5f]/20 hover:bg-[#1e3a5f]/5 mt-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-3 h-3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>

                  <span>View on Map</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
