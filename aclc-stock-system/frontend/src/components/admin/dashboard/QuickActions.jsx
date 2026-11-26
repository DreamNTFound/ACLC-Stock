import { NavLink } from "react-router-dom";
import {
  LucideZap,
  LucidePlus,
  LucidePackageCheck,
  LucideCheckSquare,
  LucideCalendar,
} from "lucide-react";

export const QuickActions = () => {
  const actions = [
    {
      label: "Add Item",
      icon: LucidePlus,
      link: "/merchandise",
      color: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    },
    {
      label: "Restock Item",
      icon: LucidePackageCheck,
      link: "/restock-schedules",
      color: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    },
    {
      label: "Approve Reservation",
      icon: LucideCheckSquare,
      link: "/reservations",
      color: "bg-amber-50 text-amber-700 hover:bg-amber-100",
    },
    {
      label: "Schedule Restock",
      icon: LucideCalendar,
      link: "/restock-schedules",
      color: "bg-purple-50 text-purple-700 hover:bg-purple-100",
    },
  ];

  return (
    <>
      <div className="flex flex-col space-y-1.5 p-6">
        <div className="font-semibold tracking-tight text-lg flex items-center gap-2">
          <LucideZap className="w-5 h-5 text-[#d4a843]" />
          <span>Quick Actions</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 p-6 pt-0">
        {actions.map(({ label, icon: Icon, link, color }) => (
          <NavLink
            key={label}
            to={link}
            className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl font-medium text-sm transition-colors ${color}`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-center leading-tight">{label}</span>
          </NavLink>
        ))}
      </div>
    </>
  );
};
