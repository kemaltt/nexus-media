"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Send,
  Clock,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Get user from local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, [router]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Create Post", href: "/dashboard/create", icon: Send },
    { name: "History", href: "/dashboard/history", icon: Clock },
    { name: "Accounts", href: "/dashboard/accounts", icon: Users },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#171021] text-white transform transition-transform duration-200 ease-in-out lg:transform-none lg:translate-x-0 flex flex-col ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link
            href="/dashboard"
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
          >
            Nexus Media
          </Link>
          <button
            className="ml-auto lg:hidden text-gray-400 hover:text-white"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive
                    ? "bg-purple-600/20 text-purple-400"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon
                  size={20}
                  className={`mr-3 ${isActive ? "text-purple-400" : "text-gray-500 group-hover:text-white"}`}
                />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
              {user?.name?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-400 hover:bg-white/5 rounded-lg transition-colors"
          >
            <LogOut size={18} className="mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
          <button
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={toggleSidebar}
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2" />
            {/* Mobile User Avatar (visible only on mobile if sidebar is closed, technically standard header logic) */}
            <div className="md:hidden w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
