import Link from "next/link";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import { Menu } from "~/types";

interface MenuProps {
  menu: Menu;
}

const Menus: React.FC<MenuProps> = ({ menu }) => {
  const [menuView, setMenuView] = useState<string>("appetizers");
  return (
    <section>
      <div className="mb-2.5 lg:mb-4">
        <div className="flex justify-between items-center mb-1 lg:mb-2">
          <h4 className="font-medium text-xl lg:text-2xl">Potluck Menu</h4>
          <Link
            href={"/events/create"}
            className="flex items-center gap-x-1.5 text-emerald-500 lg:hover:text-emerald-700 lg:hover:font-medium"
          >
            <span>Add</span>
            <FiPlus />
          </Link>
        </div>
        <ul className="flex items-center gap-x-2.5">
          <button
            onClick={() => setMenuView("appetizers")}
            type="button"
            className={twMerge(
              "text-sm py-2 rounded border",
              menuView === "appetizers"
                ? "px-4 border-emerald-700 text-emerald-700"
                : "px-0 border-transparent text-emerald-500 lg:hover:text-emerald-700"
            )}
          >
            Appetizers
          </button>
          <button
            onClick={() => setMenuView("mains")}
            type="button"
            className={twMerge(
              "text-sm py-2 rounded border",
              menuView === "mains"
                ? "px-4 border-emerald-700 text-emerald-700"
                : "px-0 border-transparent text-emerald-500 lg:hover:text-emerald-700"
            )}
          >
            Mains
          </button>
          <button
            onClick={() => setMenuView("desserts")}
            type="button"
            className={twMerge(
              "text-sm py-2 rounded border",
              menuView === "desserts"
                ? "px-4 border-emerald-700 text-emerald-700"
                : "px-0 border-transparent text-emerald-500 lg:hover:text-emerald-700"
            )}
          >
            Desserts
          </button>
        </ul>
      </div>
      <p className="text-red-500">
        There is no {menuView.slice(0, -1)} in the potluck.
      </p>
    </section>
  );
};

export default Menus;
