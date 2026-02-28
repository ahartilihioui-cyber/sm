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
    { href: "/cars", label: "Voitures", icon: "🚗" },
    { href: "/cars/new", label: "Ajouter", icon: "➕" },
  ];

  return (
    <nav className="bg-gray-950 border-b border-gray-800 shadow-lg shadow-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-xl font-bold text-orange-500 mr-8"
            >
              🏎️ Car Manager
            </Link>
            <div className="hidden md:flex space-x-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href) && link.href !== "/cars/new")
                      ? "bg-orange-600/20 text-orange-400 border border-orange-600/30"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <span className="mr-1">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              {session.user?.name || session.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
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
                ? "bg-orange-600/20 text-orange-400"
                : "text-gray-400 hover:bg-gray-800"
            }`}
          >
            {link.icon} {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
