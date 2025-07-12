
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Music } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const { login } = useAuth();
  const router = useRouter();

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    
    // In a real app, you'd create a user here.
    // For now, we'll log them in with the info they provided.
    const newUser = { 
      name: name || 'Friend',
      email: email,
      phone: phone,
     };
    login(newUser);
    router.push('/profile');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary rounded-full">
                <Music className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
            <CardDescription>Join AR Music and start listening.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSignup}>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" type="text" placeholder="Your Name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input id="phone" name="phone" type="tel" placeholder="(123) 456-7890" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm">
            <p className="w-full">
              Already have an account?{' '}
              <Button variant="link" asChild className="p-0">
                <Link href="/login">Log in</Link>
              </Button>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
