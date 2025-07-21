
'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Music } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { GoogleIcon } from '@/components/google-icon';

export default function LoginPage() {
  const { user, signInWithGoogle } = useAuth();
  const router = useRouter();
  
  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
  };

  React.useEffect(() => {
    if (user) {
      router.push('/profile');
    }
  }, [user, router]);

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
            <CardTitle className="text-2xl font-headline">Welcome to AR Music</CardTitle>
            <CardDescription>Sign in with your Google account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
                <GoogleIcon className="mr-2 h-4 w-4" />
                Sign In with Google
            </Button>
          </CardContent>
           <CardFooter className="text-center text-sm">
             <p className="w-full text-muted-foreground">
                By signing in, you agree to our terms of service.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
