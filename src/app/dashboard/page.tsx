import { db } from "@/db";
import { properties } from "@/db/schema";
import { count } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardOverview() {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  try {
    // 2. Data Fetching [cite: 6]
    const [result] = await db.select({ value: count() }).from(properties);

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back, {session.user.name}</p>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{result.value}</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    // 3. Error Handling for "Real-World Challenges" [cite: 40, 67]
    console.error("Database Error:", error);
    return <div>Failed to load dashboard data. Please check your database connection.</div>;
  }
}