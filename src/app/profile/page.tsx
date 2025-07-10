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
        <p className="inline-flex items-center gap-1.5">
          App created with <Heart className="h-4 w-4 text-red-500 fill-current" /> by Ariyan •{' '}
          <a
            href="https://www.instagram.com/ariyan.xlx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Instagram className="h-4 w-4" /> @ariyan.xlx
          </a>
        </p>
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
          Sign up or log in to save your favorite songs and create playlists.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center gap-4 px-6 pt-4">
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
      </CardContent>
      <CardFooter className="flex-col gap-2 text-center text-sm text-muted-foreground pt-6">
        <p className="inline-flex items-center gap-1.5">
          App created with <Heart className="h-4 w-4 text-red-500 fill-current" /> by Ariyan •{' '}
          <a
            href="https://www.instagram.com/ariyan.xlx"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-primary transition-colors"
          >
            <Instagram className="h-4 w-4" /> @ariyan.xlx
          </a>
        </p>
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
