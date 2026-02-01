import { db } from "@/db";
import { properties } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditPropertyForm from "./EditPropertyForm";

async function getProperty(id: number) {
  const [property] = await db
    .select()
    .from(properties)
    .where(eq(properties.id, id));

  if (!property) notFound();

  return property;
}

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = await getProperty(parseInt(id));

  return <EditPropertyForm property={property} />;
}