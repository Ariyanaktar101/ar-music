
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
}

export function PhoneAuthForm() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log('reCAPTCHA solved');
        },
      });
    }
  };

  const onSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setupRecaptcha();
    
    // Add country code if not present
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;

    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      toast({ title: 'OTP Sent!', description: 'Check your phone for the verification code.' });
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      let description = error.message || 'Please check the phone number and try again.';
      if (error.code === 'auth/billing-not-enabled') {
        description = 'Phone Authentication is a premium feature. Please enable billing on your Firebase project to use it.';
      }
      toast({
        variant: 'destructive',
        title: 'Failed to send OTP',
        description: description,
      });
      // Reset reCAPTCHA
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then(function(widgetId: any) {
          grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;

      // For phone auth, we don't have name/email initially
      const appUser = {
        name: 'Music Lover',
        phone: user.phoneNumber || '',
      };
      login(appUser);
      router.push('/profile');
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: 'The code you entered is incorrect. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div id="recaptcha-container"></div>
      {!otpSent ? (
        <form onSubmit={onSendOtp} className="space-y-4">
          <Input
            type="tel"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader className="animate-spin" /> : 'Send OTP'}
          </Button>
        </form>
      ) : (
        <form onSubmit={onVerifyOtp} className="space-y-4">
          <Input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            required
          />
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader className="animate-spin" /> : 'Verify OTP'}
          </Button>
        </form>
      )}
    </div>
  );
}
