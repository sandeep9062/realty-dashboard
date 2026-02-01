import { db } from "@/db";
import { properties } from "@/db/schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Pencil,
  IndianRupee,
  Plus,
  Eye,
  Trash2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { deleteProperty } from "@/lib/actions"; // We'll create this next

export default async function PropertiesPage() {
  const allProperties = await db.select().from(properties);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Property Portfolio
          </h1>
          <p className="text-slate-500 mt-1">
            Manage and track your active real estate listings.
          </p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-md">
          <Link
            href="/dashboard/properties/new"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Property
          </Link>
        </Button>
      </div>

      {/* Grid Layout */}
      {allProperties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <Building2 className="w-12 h-12 text-slate-300 mb-4" />
          <p className="text-slate-500 font-medium">
            No properties found. Start by adding one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProperties.map((prop: any) => (
            <Card
              key={prop.id}
              className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
            >
              {/* Property Media */}
              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                {prop.images && prop.images.length > 0 ? (
                  prop.images[0].match(/\.(mp4|webm|ogg|mov)$/i) ? (
                    <video
                      src={prop.images[0]}
                      controls
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform duration-500">
                    <Building2 className="w-10 h-10 opacity-20" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-blue-600 font-bold text-sm shadow-sm">
                  ₹{prop.price.toLocaleString("en-IN")}
                </div>
              </div>

              <CardHeader className="p-5 pb-2">
                <h3 className="font-bold text-xl text-slate-900 truncate leading-tight">
                  {prop.title}
                </h3>
                <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="truncate">{prop.location}</span>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-0">
                <p className="text-slate-600 text-sm line-clamp-2 mt-2">
                  {prop.description ||
                    "No description provided for this luxury property."}
                </p>
              </CardContent>

              <CardFooter className="p-5 border-t bg-slate-50/50 flex justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1 bg-white"
                >
                  <Link
                    href={`/dashboard/properties/${prop.id}`}
                    className="flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" /> View
                  </Link>
                </Button>

                {/* Delete Form */}
                <form action={deleteProperty}>
                  <input type="hidden" name="id" value={prop.id} />

                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1"
                  >
                    <Link
                      href={`/dashboard/properties/${prop.id}/edit`}
                      className="flex items-center justify-center gap-2"
                    >
                      <Pencil className="w-4 h-4" /> Edit
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </form>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
