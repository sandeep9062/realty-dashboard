import { db } from "@/db";
import { properties } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { deleteProperty } from "@/lib/actions";
import { Pencil,Building2 , Trash2, ArrowLeft, MapPin, IndianRupee } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  // 1. Await params for Next.js 16 compliance
  const { id } = await params;
  const propertyId = parseInt(id);

  // 2. Fetch specific property using Drizzle
  const [property] = await db
    .select()
    .from(properties)
    .where(eq(properties.id, propertyId));

  // 3. Handle 'Not Found' state for better UX
  if (!property) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent transition-colors hover:text-blue-600">
          <Link href="/dashboard/properties" className="flex items-center gap-2 text-slate-600">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden border-none shadow-2xl bg-white">
        {/* Property Media */}
        {property.images && property.images.length > 0 ? (
          <div className="h-72 bg-slate-100 relative group">
            {property.images[0].match(/\.(mp4|webm|ogg|mov)$/i) ? (
              <video
                src={property.images[0]}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">{property.price.toLocaleString('en-IN')}</span>
            </div>
          </div>
        ) : (
          <div className="h-72 bg-slate-100 relative group">
            <div className="absolute inset-0 flex items-center justify-center text-slate-300">
              <Building2 className="w-16 h-16 opacity-20" />
            </div>
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-blue-600" />
              <span className="text-2xl font-bold text-slate-900">{property.price.toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

        <CardHeader className="p-8 border-b">
          <div className="space-y-2">
            <CardTitle className="text-4xl font-extrabold text-slate-900 tracking-tight">
              {property.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-slate-500 text-lg">
              <MapPin className="w-5 h-5 text-blue-500" />
              <span>{property.location}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Additional Media */}
            {property.images && property.images.length > 1 && (
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">Gallery</h3>
                <div className="grid grid-cols-3 gap-4">
                  {property.images.slice(1).map((media: string, index: number) => (
                    <div key={index} className="relative group">
                      {media.match(/\.(mp4|webm|ogg|mov)$/i) ? (
                        <video
                          src={media}
                          controls
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <img
                          src={media}
                          alt={`${property.title} - Media ${index + 2}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Property Description</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-lg">
                {property.description}
              </p>
            </div>
            
            {/* Action Bar */}
            <div className="mt-10 flex flex-wrap gap-4 border-t pt-8">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 h-11 px-8">
                <Link href={`/dashboard/properties/${property.id}/edit`} className="flex items-center gap-2">
                  <Pencil className="w-4 h-4" /> Edit Details
                </Link>
              </Button>
           
              {/* Fix: Wrap delete in a Form for Server Action */}
              <form action={deleteProperty}>
                <input type="hidden" name="id" value={property.id} />
                <Button 
                  type="submit" 
                  className="h-11 px-8 bg-red-600 hover:bg-red-700" 
                  variant="destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Listing
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}