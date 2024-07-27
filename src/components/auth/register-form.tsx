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
import { Form, FormField, FormLabel, FormMessage, FormItem, FormControl } from "../ui/form"
import { useRouter } from "next/navigation";

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'First name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

const RegisterForm= () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    }
  });

  const router = useRouter();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log({ values });

    try {
      const response = await fetch('http://localhost:3003/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      router.push('/auth/login');
    } catch (error) {
      console.error('Error during registration', error);
    }
  };

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <Card className="mx-auto max-w-sm">
            <CardHeader>
              <CardTitle className="text-xl">Sign Up</CardTitle>
              <CardDescription>
                Enter your information to create an account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                  <FormField control={form.control} name="firstName" render={( {field} ) => {
                    return (<FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    )
                  }}
                  />
                  </div>
                  <div className="grid gap-2">
                  <FormField control={form.control} name="lastName" render={( {field} ) => {
                    return (<FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                    )
                  }}
                  />
                  </div>
                </div>
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
                <FormField control={form.control} name="password" render={({ field }) => {
                  return (<FormItem>
                    <FormLabel>Password</FormLabel>
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
                  Create an account
                </Button>
                <Button variant="outline" className="w-full">
                  Sign up with Google
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="http://localhost:3000/auth/login" className="underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    )
}

export default RegisterForm
