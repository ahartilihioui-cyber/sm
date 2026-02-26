"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) return null;

  const links = [
    { href: "/dashboard", label: "Tableau de bord", icon: "📊" },
    { href: "/students", label: "Étudiants", icon: "🎓" },
    { href: "/students/new", label: "Ajouter", icon: "➕" },
  ];

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-xl font-bold text-blue-600 mr-8"
            >
              🏫 Student Manager
            </Link>
            <div className="hidden md:flex space-x-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span className="mr-1">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {session.user?.name || session.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
      {/* Mobile nav */}
      <div className="md:hidden px-4 pb-3 flex space-x-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded text-xs font-medium ${
              pathname === link.href
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {link.icon} {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
