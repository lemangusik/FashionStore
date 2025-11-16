// Navigation.jsx - ОБНОВЛЕННЫЕ ЦВЕТА
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const { pathname } = useLocation();

  const navItems = [
    { label: "Главная", href: "/", match: pathname === "/" },
    {
        label: "Каталог",
        href: "/catalog",
        match: pathname.startsWith("/catalog"),
    },
    { label: "Создать товар", href: "/product/create", match: pathname === "/product/create" },
  ];

  return (
    <nav aria-label="Основная навигация">
      <ul className="flex justify-start space-x-6 py-4">
        {navItems.map(({ label, href, match }) => (
          <li key={label}>
            <Link
              to={href}
              className={`
                px-4 py-2 rounded-full text-sm font-semibold transition-colors
                focus:outline-none focus:ring-4 focus:ring-fashion-pink
                ${
                  match
                    ? "bg-fashion-pink text-white shadow-lg"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }
              `}
              aria-current={match ? "page" : undefined}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;