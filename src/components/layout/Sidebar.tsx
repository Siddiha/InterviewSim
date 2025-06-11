import React from "react";
import Link from "next/link";

interface SidebarProps {
  // Define props like isOpen, onClose, or content
  children?: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  // This is a basic example. You would likely add conditional rendering
  // based on an 'isOpen' prop and handle closing the sidebar.

  return (
    <div className="w-64 bg-gray-100 p-4 min-h-screen">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sidebar Menu</h3>
      <nav>
        {/* Example sidebar navigation items */}
        <ul>
          <li>
            <Link
              href="/dashboard"
              className="block py-2 text-gray-700 hover:bg-gray-200 rounded"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/interviews"
              className="block py-2 text-gray-700 hover:bg-gray-200 rounded"
            >
              Interviews
            </Link>
          </li>
          {/* Add more sidebar links */}
        </ul>
      </nav>
      <div className="mt-6">{children}</div>
    </div>
  );
}
