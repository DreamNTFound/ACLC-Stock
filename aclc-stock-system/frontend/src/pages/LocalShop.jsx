import { useState, useEffect } from "react";
import { getLocalShop } from "../services/localShopService";
import { categoryOptions } from "../utils/formatHelpers";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LocalShop() {
  const [shops, setShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectItemCategory, setItemCategory] = useState("All Items");
  const [openSelectCategory, setOpenSelectCategory] = useState(false);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const shops = await getLocalShop();
        setTimeout(() => {
          setShops(shops);
        }, 500);
      } catch (error) {
        console.log("Error fetching shops:", error);
      }
    };
    fetchShops();
  });

  const filteredItems = shops.filter((shop) => {
    const term = searchTerm?.toLowerCase();
    const matchSearch =
      !term ||
      shop.name.toLowerCase().includes(term) ||
      shop.address.toLowerCase().includes(term);
    const matchCategory =
      !selectItemCategory ||
      selectItemCategory === "All Items" ||
      shop.avail_items?.some(
        (item) => item.toLowerCase() === selectItemCategory.toLowerCase(),
      );
    return matchSearch && matchCategory;
  });

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <nav className="bg-[#1e3a5f] text-white sticky top-0 z-50 shadow-lg">
          <Navbar />
        </nav>
        <div className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-medium text-[#1e3a5f]">
                  Local Shops
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Find nearby stores for school merchandise alternatives
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search shops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm transition-colors md:text-sm pl-10 bg-white border-slate-200"
                  />
                </div>
                <div className="relative">
                  <button
                    onClick={() => setOpenSelectCategory(!openSelectCategory)}
                    className="flex h-9 items-center justify-between whitespace-nowrap rounded-md border border-input px-3 py-2 text-sm shadow-sm ring-offset-background w-full sm:w-44 bg-white"
                  >
                    <span>{selectItemCategory || "All Items"}</span>
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
                  {openSelectCategory && (
                    <ul className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-md">
                      <li
                        onClick={() => {
                          setItemCategory("All Items");
                          setOpenSelectCategory(false);
                        }}
                        className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                      >
                        All Items
                      </li>

                      {categoryOptions.map((option) => (
                        <li
                          key={option}
                          onClick={() => {
                            setItemCategory(option);
                            setOpenSelectCategory(false);
                          }}
                          className="px-3 py-2 hover:bg-slate-100 cursor-pointer text-sm"
                        >
                          {option}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {filteredItems.map((shop) => (
                  <div
                    key={shop.id}
                    className="rounded-xl border-bg-card-foreground shadow overflow-hidden hover:shadow-lg transition-all duration-300 border-slate-200 opacity-0 animate-fadeIn"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-[#1e3a5f] text-lg">
                              {shop.name}
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
                                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
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
                          className="w-4 h-4 "
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
                        {shop.avail_items.map((item, i) => (
                          <div
                            key={i}
                            className="inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold transition-colors border-transparent bg-slate-100 text-secondary-foreground text-[10px]"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                      <a
                        href={shop.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors border bg-background shadow-sm hover:text-accent-foreground h-8 rounded-md px-3 text-xs w-full text-[#1e3a5f] border-[#1e3a5f]/20 hover:bg-[#1e3a5f]/5 mt-2"
                      >
                        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors border bg-background shadow-sm hover:text-accent-foreground h-8 rounded-md px-3 text-xs w-full text-[#1e3a5f] border-[#1e3a5f]/20 hover:bg-[#1e3a5f]/5">
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
                        </button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white mt-8">
          <Footer />
        </footer>
      </div>
    </>
  );
}
