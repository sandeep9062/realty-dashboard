"use server";

import { db } from "@/db";
import { properties } from "@/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";


export async function logout() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    await auth.api.signOut({
      headers: await headers(),
    });
  }

  redirect("/");
}

export async function createProperty(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Ensure only authenticated users can create properties
  if (!session) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const location = formData.get("location") as string;
  
  // Get all image URLs from form data
  const images = formData.getAll("images") as string[];

  // Insert into Neon database
  await db.insert(properties).values({
    title,
    description,
    price,
    location,
    userId: session.user.id,
    images,
  });

  // Clear cache for the properties list and redirect
  revalidatePath("/dashboard/properties");
  redirect("/dashboard/properties");
}

export async function deleteProperty(formData: FormData) {
  const id = formData.get("id");
  if (!id) return;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");

  // Ensure user owns the property before deleting
  await db.delete(properties).where(
    and(
      eq(properties.id, Number(id)),
      eq(properties.userId, session.user.id)
    )
  );

  revalidatePath("/dashboard/properties");
}


export async function updateProperty(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Unauthorized");

  const id = Number(formData.get("id"));
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  const location = formData.get("location") as string;
  
  // Get all image URLs from form data
  const images = formData.getAll("images") as string[];

  // Security: Check ownership before updating
  await db
    .update(properties)
    .set({ title, description, price, location, images })
    .where(
      and(
        eq(properties.id, id),
        eq(properties.userId, session.user.id)
      )
    );

  revalidatePath("/dashboard/properties");
  revalidatePath(`/dashboard/properties/${id}`);
  redirect("/dashboard/properties");
}
