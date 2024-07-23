"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import * as z from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormLabel, FormMessage, FormItem, FormControl } from "../ui/form";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const LoginForm= () => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });
  const router = useRouter();

  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    console.log('Sending login request with payload:', { ...values, password: '[REDACTED]' });
    //console.log({ values });

    try {
      console.log('Sending request to:', 'http://localhost:3003/api/v1/users/login');
      const response = await fetch('http://localhost:3003/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        console.error('Response not OK. Status:', response.status);
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      console.log('Login response data:', data);

      if (data.token) {
        console.log('Token received, login successful');
        // You might want to store the token in localStorage or a state management solution here
        // localStorage.setItem('token', data.token);
      } else {
        console.warn('Login successful but no token received');
      }
      // Redirect to homepage
      router.push('/');
    } catch (error) {
      console.error('Error during login:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
              <FormField control={form.control} name="email" render={({ field }) => {
                  return (<FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" type="email" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  )
                }}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <FormLabel>Password</FormLabel>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                      Forgot your password?
                    </Link>
                </div>
                <FormField control={form.control} name="password" render={({ field }) => {
                  return (<FormItem>
                    <FormControl>
                      <Input placeholder="Password" type="password" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  )
                }}
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="http://localhost:3000/auth/register" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
      </Form>
    )
}

export default LoginForm
