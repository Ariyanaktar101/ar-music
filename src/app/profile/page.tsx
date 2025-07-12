
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  LogIn,
  UserPlus,
  Instagram,
  LogOut,
  Settings,
  Edit,
  RefreshCw,
  AtSign,
  Mail,
  Phone,
  Heart,
  Upload,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';

function SnapchatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
        <path d="M11.96,2c-5.52,0-10,4.48-10,10s4.48,10,10,10,10-4.48,10-10-4.48-10-10-10Zm4.49,14.65c-.15.1-.33.15-.51.15a.52.52,0,0,1-.43-.2l-1.39-2.21a.54.54,0,0,0-.43-.2h-3.41a.54.54,0,0,0-.43.2l-1.39,2.21a.52.52,0,0,1-.43.2c-.18,0-.36-.05-.51-.15a.52.52,0,0,1-.2-.82l3.41-5.46a.52.52,0,0,1,.86,0l3.41,5.46c.15.24.1.58-.1.82Zm-5.83-3.11h2.72l-1.36-2.18Z" />
    </svg>
  );
}

function WavingDoraemon() {
    return (
        <div className="relative w-12 h-12 inline-block ml-2">
            <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Waving Hand */}
                <g className="origin-center animate-wave-hand" style={{ transformOrigin: '25px 80px' }}>
                     <circle cx="20" cy="85" r="10" fill="#fff" stroke="#000" strokeWidth="1" />
                </g>
                {/* Head */}
                <circle cx="50" cy="50" r="40" fill="#36A9E1" stroke="#000" strokeWidth="2" />
                {/* Face */}
                <circle cx="50" cy="55" r="30" fill="#fff" />
                 {/* Collar */}
                <path d="M25 75 Q50 85 75 75 L 75 80 Q50 90 25 80 Z" fill="#D81E05" stroke="#000" strokeWidth="1.5" />
                <circle cx="50" cy="80" r="5" fill="#F9D900" stroke="#000" strokeWidth="1" />
                {/* Eyes */}
                <ellipse cx="40" cy="40" rx="10" ry="12" fill="#fff" stroke="#000" strokeWidth="1.5" />
                <ellipse cx="60" cy="40" rx="10" ry="12" fill="#fff" stroke="#000" strokeWidth="1.5" />
                <circle cx="42" cy="42" r="3" fill="#000" />
                <circle cx="58" cy="42" r="3" fill="#000" />
                {/* Nose */}
                <circle cx="50" cy="50" r="5" fill="#D81E05" stroke="#000" strokeWidth="1" />
                {/* Mouth Line */}
                <line x1="50" y1="55" x2="50" y2="70" stroke="#000" strokeWidth="1.5" />
                {/* Mouth Smile */}
                <path d="M35 65 Q50 75 65 65" stroke="#000" strokeWidth="1.5" fill="none" />
                {/* Whiskers */}
                <line x1="20" y1="55" x2="35" y2="50" stroke="#000" strokeWidth="1" />
                <line x1="20" y1="60" x2="35" y2="60" stroke="#000" strokeWidth="1" />
                <line x1="20" y1="65" x2="35" y2="70" stroke="#000" strokeWidth="1" />
                <line x1="80" y1="55" x2="65" y2="50" stroke="#000" strokeWidth="1" />
                <line x1="80" y1="60" x2="65" y2="60" stroke="#000" strokeWidth="1" />
                <line x1="80" y1="65" x2="65" y2="70" stroke="#000" strokeWidth="1" />
            </svg>
        </div>
    );
}

function LoggedInView() {
  const { user, logout, login } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarSeed, setAvatarSeed] = useState(user?.avatarSeed || 'default');
  const [customAvatar, setCustomAvatar] = useState<string | null>(user?.avatarUrl || null);


  const handleSaveChanges = () => {
    if (user) {
      const updatedUser = { ...user, name, username, bio, email, phone, avatarSeed, avatarUrl: customAvatar };
      login(updatedUser);
    }
  };
  
  const randomizeAvatar = () => {
    setCustomAvatar(null); // Clear custom avatar when randomizing
    setAvatarSeed(Math.random().toString(36).substring(7));
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const getAvatarSrc = () => {
    if (user?.avatarUrl) {
      return user.avatarUrl;
    }
    return `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user?.avatarSeed || user?.name}`;
  }

  return (
    <Card className="w-full max-w-md animate-in fade-in-50 zoom-in-95">
      <CardHeader className="text-center items-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage
            src={getAvatarSrc()}
            alt={user?.name}
          />
          <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-3xl font-bold font-headline flex items-center">
          <span>{user?.name}</span>
          <WavingDoraemon />
        </CardTitle>
        <CardDescription className="flex flex-col gap-1 text-md text-muted-foreground pt-1">
            {user?.username && (
                <span className="flex items-center gap-1 justify-center">
                    <AtSign className="h-4 w-4" />{user.username}
                </span>
            )}
            {user?.email && (
                <span className="flex items-center gap-1 justify-center">
                    <Mail className="h-4 w-4" />{user.email}
                </span>
            )}
            {user?.phone && (
                <span className="flex items-center gap-1 justify-center">
                    <Phone className="h-4 w-4" />{user.phone}
                </span>
            )}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pt-4 space-y-4">
        {user?.bio && (
            <div className="text-center text-sm text-foreground p-3 bg-secondary rounded-md">
                <p>{user.bio}</p>
            </div>
        )}
        <div className="grid grid-cols-2 gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="col-span-3"
                      placeholder="e.g. musiclover123"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="col-span-3"
                      placeholder="m@example.com"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="col-span-3"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="bio" className="text-right pt-2">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="col-span-3"
                      placeholder="Tell us a little about yourself"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label className="text-right">Avatar</Label>
                     <div className="col-span-3 flex items-center gap-2">
                        <Avatar>
                            <AvatarImage src={customAvatar || `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${avatarSeed}`} alt={name} />
                            <AvatarFallback>{name?.[0]}</AvatarFallback>
                        </Avatar>
                        <Button variant="ghost" size="icon" onClick={randomizeAvatar}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                            <Upload className="h-4 w-4" />
                        </Button>
                        <Input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                        />
                     </div>
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="submit" onClick={handleSaveChanges}>
                      Save changes
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button asChild variant="outline">
              <Link href="/settings">
                <Settings />
                Settings
              </Link>
            </Button>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4 text-center text-sm text-muted-foreground pt-6">
        <Button onClick={logout} variant="secondary" className="w-1/2">
          <LogOut />
          Log Out
        </Button>
        <div className="flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-1.5">
              <p>Made with</p>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <p>by Ariyan</p>
            </div>
            <div className="flex items-center gap-4">
                <a
                    href="https://www.instagram.com/ariyan.xlx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                >
                    <Instagram className="h-4 w-4" /> @ariyan.xlx
                </a>
                <a
                    href="https://www.snapchat.com/add/ariyan.xlx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                >
                    <SnapchatIcon className="h-4 w-4" /> @ariyan.xlx
                </a>
            </div>
        </div>
      </CardFooter>
    </Card>
  );
}

function GuestView() {
  return (
    <Card className="w-full max-w-md animate-in fade-in-50 zoom-in-95">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold font-headline">
          Join the Music
        </CardTitle>
        <CardDescription className="text-md text-muted-foreground pt-2">
          Sign up or log in to customize your experience.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-6 pt-4">
        <div className="flex justify-center items-center gap-4">
            <Button asChild className="w-full">
            <Link href="/login">
                <LogIn />
                Log In
            </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full">
            <Link href="/signup">
                <UserPlus />
                Sign Up
            </Link>
            </Button>
        </div>
        <Button asChild variant="outline" className="w-full">
            <Link href="/settings">
                <Settings />
                Settings
            </Link>
        </Button>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-center text-sm text-muted-foreground pt-6">
         <div className="flex flex-col items-center gap-2">
            <div className="inline-flex items-center gap-1.5">
              <p>Made with</p>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <p>by Ariyan</p>
            </div>
            <div className="flex items-center gap-4">
                <a
                    href="https://www.instagram.com/ariyan.xlx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                >
                    <Instagram className="h-4 w-4" /> @ariyan.xlx
                </a>
                <a
                    href="https://www.snapchat.com/add/ariyan.xlx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-primary transition-colors"
                >
                    <SnapchatIcon className="h-4 w-4" /> @ariyan.xlx
                </a>
            </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  return (
      <div className="flex flex-col items-center justify-center h-full">
        {user ? <LoggedInView /> : <GuestView />}
      </div>
  );
}

    
