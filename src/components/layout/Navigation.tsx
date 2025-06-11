import React from "react";
import Link from "next/link";

interface NavigationProps {
  // Define props like an array of navigation items
}

export default function Navigation({}: // Use props here
NavigationProps) {
  // Example navigation items
  const navItems = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/interviews", label: "Interviews" },
    // Add more navigation items as needed
  ];

  return (
    <nav>
      <ul className="flex space-x-4">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-gray-700 hover:text-blue-600"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
