"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function LoginPage() { // Capitalized and exported correctly
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message || "Invalid credentials.");
        return;
      }

      toast.success("Welcome back!");
      router.refresh(); // Syncs server components with the new session
      router.push("/dashboard");
    } catch (err) {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
        <Image src="/login.jpg" alt="Maldonite Realty" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/20" /> 
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center p-6">
            <h1 className="text-4xl font-bold mb-4">Welcome</h1>
            <p className="text-lg">Access your real estate assets</p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <Card className="w-full max-w-md shadow-xl border-none">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
            <CardDescription>Enter your credentials to manage your listings</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input placeholder="name@example.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" disabled={form.formState.isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
                  {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </Form>
            <div className="text-center mt-6 text-sm">
              New here? <Link href="/register" className="text-blue-600 hover:underline">Create an account</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}