
'use client';

import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
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
import React, { useState } from 'react';
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

function LoggedInView() {
  const { user, logout, login } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarSeed, setAvatarSeed] = useState(user?.avatarSeed || 'default');

  const handleSaveChanges = () => {
    if (user) {
      const updatedUser = { ...user, name, username, bio, email, phone, avatarSeed };
      login(updatedUser); // login function also updates the user
    }
  };
  
  const randomizeAvatar = () => {
    setAvatarSeed(Math.random().toString(36).substring(7));
  }

  return (
    <Card className="w-full max-w-md animate-in fade-in-50 zoom-in-95">
      <CardHeader className="text-center items-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage
            src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${user?.avatarSeed || user?.name}`}
            alt={user?.name}
          />
          <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-3xl font-bold font-headline">
          {user?.name}
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
                            <AvatarImage src={`https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${avatarSeed}`} alt={name} />
                            <AvatarFallback>{name?.[0]}</AvatarFallback>
                        </Avatar>
                        <Button variant="ghost" size="icon" onClick={randomizeAvatar}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
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
            <p className="inline-flex items-center gap-1.5">
              Made with <Heart className="h-4 w-4 text-red-500 fill-current" /> by Ariyan
            </p>
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
            <p className="inline-flex items-center gap-1.5">
              Made with <Heart className="h-4 w-4 text-red-500 fill-current" /> by Ariyan
            </p>
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
    <AppShell>
      <div className="flex flex-col items-center justify-center h-full">
        {user ? <LoggedInView /> : <GuestView />}
      </div>
    </AppShell>
  );
}
