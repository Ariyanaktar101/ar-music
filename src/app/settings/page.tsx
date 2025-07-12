
'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Palette, Music, Wifi, User, Trash2, Moon, Sun, Monitor, Shield, Bell, LifeBuoy, Flag, MessageSquare, Link as LinkIcon, Loader, Check } from 'lucide-react';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useTheme } from '@/context/ThemeContext';
import { useSettings } from '@/context/SettingsContext';
import { Input } from '@/components/ui/input';
import emailjs from '@emailjs/browser';
import { useToast } from '@/hooks/use-toast';

const accentColors = [
    { name: 'Blue', color: '207 90% 58%' },
    { name: 'Green', color: '142 71% 45%' },
    { name: 'Orange', color: '25 95% 53%' },
    { name: 'Rose', color: '347 77% 50%' },
    { name: 'Violet', color: '262 84% 58%' },
]

function ReportSongCard() {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleReport = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formRef.current) return;
        
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
        
        if (!serviceId || !templateId || !publicKey) {
            toast({
                variant: 'destructive',
                title: 'Configuration Error',
                description: 'Email service is not configured correctly.',
            });
            return;
        }

        setIsLoading(true);
        setIsSuccess(false);

        emailjs.sendForm(serviceId, templateId, formRef.current, publicKey)
            .then(
                () => {
                    toast({
                        title: 'Report Sent!',
                        description: 'Thanks for your feedback. We will look into adding this song.',
                    });
                    setIsSuccess(true);
                    if (formRef.current) formRef.current.reset();
                },
                (error) => {
                     toast({
                        variant: 'destructive',
                        title: 'Uh oh! Something went wrong.',
                        description: 'There was a problem sending your report. Please try again.',
                    });
                    console.error('FAILED...', error.text);
                }
            )
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessageSquare /> Report a Missing Song</CardTitle>
                <CardDescription>If you can't find a song, let us know and we'll try to add it.</CardDescription>
            </CardHeader>
            <CardContent>
                <form ref={formRef} onSubmit={handleReport} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="song_name">Song Name</Label>
                        <Input 
                            id="song_name"
                            name="song_name"
                            placeholder="e.g., Faded"
                            required
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="youtube_link">YouTube Song Link</Label>
                        <div className="relative">
                           <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input 
                              id="youtube_link"
                              name="youtube_link"
                              placeholder="https://youtube.com/watch?v=..."
                              required
                              className="pl-9"
                          />
                        </div>
                    </div>
                    <Button type="submit" disabled={isLoading || isSuccess}>
                        {isLoading ? <Loader className="animate-spin" /> : isSuccess ? <Check /> : 'Send Report'}
                        {isLoading ? 'Sending...' : isSuccess ? 'Sent!' : 'Send Report'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { 
    accentColor, 
    setAccentColor,
    streamingQuality,
    setStreamingQuality,
    crossfade,
    setCrossfade,
    downloadOverWifiOnly,
    setDownloadOverWifiOnly,
  } = useSettings();

  return (
      <div className="flex justify-center w-full">
        <div className="w-full max-w-3xl space-y-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="shrink-0">
              <Link href="/profile">
                <ArrowLeft />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold font-headline">Settings</h1>
              <p className="text-muted-foreground">Manage your account and app preferences.</p>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Palette /> Appearance</CardTitle>
              <CardDescription>Customize the look and feel of the app.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme-select">Theme</Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger id="theme-select" className="w-[180px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light"><div className="flex items-center gap-2"><Sun className="h-4 w-4"/><span>Light</span></div></SelectItem>
                    <SelectItem value="dark"><div className="flex items-center gap-2"><Moon className="h-4 w-4"/><span>Dark</span></div></SelectItem>
                    <SelectItem value="system"><div className="flex items-center gap-2"><Monitor className="h-4 w-4"/><span>System</span></div></SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
               <div className="space-y-3">
                <Label>Accent Color</Label>
                <div className="flex flex-wrap gap-3">
                    {accentColors.map(accent => (
                         <Button key={accent.name} variant={accentColor === accent.color ? 'default' : 'outline'} className="flex items-center gap-2" onClick={() => setAccentColor(accent.color)}>
                            <div className="w-4 h-4 rounded-full" style={{backgroundColor: `hsl(${accent.color})`}} />
                            {accent.name}
                        </Button>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Music /> Playback</CardTitle>
               <CardDescription>Control your listening experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <Label>Streaming Quality</Label>
                    <RadioGroup value={streamingQuality} onValueChange={(value) => setStreamingQuality(value as any)} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="low" id="q-low" />
                            <Label htmlFor="q-low">Low</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <RadioGroupItem value="normal" id="q-normal" />
                            <Label htmlFor="q-normal">Normal</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <RadioGroupItem value="high" id="q-high" />
                            <Label htmlFor="q-high">High</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <RadioGroupItem value="lossless" id="q-lossless" />
                            <Label htmlFor="q-lossless">Lossless</Label>
                        </div>
                    </RadioGroup>
                </div>
                <Separator />
                 <div className="space-y-3">
                    <Label htmlFor="crossfade-slider">Crossfade</Label>
                    <div className="flex items-center gap-4">
                        <Slider id="crossfade-slider" value={[crossfade]} max={12} step={1} onValueChange={(value) => setCrossfade(value[0])} />
                        <span className="text-sm font-mono text-muted-foreground w-12 text-right">{crossfade} s</span>
                    </div>
                </div>
            </CardContent>
          </Card>
          
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Wifi /> Data Saver</CardTitle>
               <CardDescription>Manage your data usage.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="wifi-only-switch">Download over Wi-Fi only</Label>
                        <p className="text-sm text-muted-foreground">Prevent downloads when on a cellular network.</p>
                    </div>
                    <Switch id="wifi-only-switch" checked={downloadOverWifiOnly} onCheckedChange={setDownloadOverWifiOnly} />
                </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield /> Privacy & Security</CardTitle>
              <CardDescription>Manage how your data is used and seen by others.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                  <div>
                      <Label htmlFor="private-session-switch">Private Session</Label>
                      <p className="text-sm text-muted-foreground">Your listening activity won't be visible to your followers.</p>
                  </div>
                  <Switch id="private-session-switch" />
              </div>
              <Separator />
               <div className="flex items-center justify-between">
                  <Label>Privacy Policy</Label>
                  <Button variant="link" asChild><Link href="#">Read Policy</Link></Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bell /> Notifications</CardTitle>
              <CardDescription>Choose what you want to be notified about.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="push-notif-switch">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">For new music, and playlist updates.</p>
                    </div>
                    <Switch id="push-notif-switch" defaultChecked />
                </div>
                 <Separator />
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="email-notif-switch">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">For news, offers, and recommendations.</p>
                    </div>
                    <Switch id="email-notif-switch" />
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><LifeBuoy /> Help & Support</CardTitle>
              <CardDescription>Get help with your account and the app.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <Button variant="outline" className="justify-start">FAQs</Button>
                <Button variant="outline" className="justify-start">Contact Support</Button>
                <Button variant="outline" className="justify-start">Terms of Service</Button>
            </CardContent>
          </Card>
          
          <ReportSongCard />
          
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Flag /> Report a Problem</CardTitle>
              <CardDescription>Encountered an issue? Let us know.</CardDescription>
            </CardHeader>
            <CardContent>
               <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="w-full sm:w-auto">
                        Report a Problem
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>A Helpful Tip</AlertDialogTitle>
                    <AlertDialogDescription>
                        Jada problem ho raha hee na to baap ke paiso se soptify ka premium le.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogAction>Got it</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User /> Account</CardTitle>
              <CardDescription>Manage your account settings.</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash2 /> Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
