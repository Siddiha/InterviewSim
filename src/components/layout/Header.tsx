import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button"; // Assuming Button component exists in ui

interface HeaderProps {
  // Add props for user info, login/logout buttons, etc.
}

export default function Header({}: // Add props here
HeaderProps) {
  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="text-xl font-bold text-gray-800">
        <Link href="/">InterviewSim</Link>
      </div>
      <nav>
        {/* Add navigation links here */}
        <ul className="flex space-x-4">
          <li>
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </li>
          {/* Add more links based on authentication status or user role */}
          {/* <li><Button variant="ghost">Login</Button></li> */}
          {/* <li><Button variant="ghost">Logout</Button></li> */}
        </ul>
      </nav>
    </header>
  );
}
