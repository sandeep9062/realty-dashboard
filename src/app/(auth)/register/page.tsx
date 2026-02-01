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
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const formSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone required"),
  password: z.string().min(8, "Minimum 8 characters"),
  confirmPassword: z.string().min(8, "Confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data, error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      if (error) {
        toast.error(error.message || "Failed to create account.");
        return;
      }

      toast.success("Account created successfully!");
      router.refresh();
      router.push("/dashboard");
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex">
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <Card className="w-full max-w-md shadow-xl border-none">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Sign Up</CardTitle>
              <CardDescription>Create your Realty account</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  {/* Fixed Email Field */}
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <PhoneInput 
                          placeholder="Enter phone" 
                          value={field.value} 
                          onChange={field.onChange} 
                          defaultCountry="IN" 
                          className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors" 
                        />
                      </FormControl>
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

                  <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" disabled={form.formState.isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
                    {form.formState.isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </Form>
              <div className="text-center mt-6 text-sm">
                Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Sign in</Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="hidden md:flex md:w-1/2 bg-slate-100 relative overflow-hidden">
          <Image src="/signup.jpg" alt="Join Us" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center text-white text-center p-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">Join Us</h1>
              <p className="text-lg">Start managing your property portfolio today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}