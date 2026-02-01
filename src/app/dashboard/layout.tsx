import Link from "next/link";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="flex flex-1">
        <aside className="w-64 border-r bg-white hidden md:block">
          <nav className="p-4 space-y-2">
            
            <Link href="/dashboard" className="block p-2 hover:bg-blue-50 rounded text-blue-600 font-medium">Overview</Link>
            <Link href="/dashboard/properties" className="block p-2 hover:bg-slate-100 rounded">My Properties</Link>
            <form action={logout} className="mt-auto">
              <Button type="submit" variant="outline" className="w-full">
                Logout
              </Button>
            </form>
          </nav>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
     
    </div>
  );
}
