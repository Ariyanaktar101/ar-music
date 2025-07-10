import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center h-full">
        <Card className="w-full max-w-lg">
            <CardHeader>
                <div className="flex items-center gap-4">
                     <Button asChild variant="ghost" size="icon">
                        <Link href="/profile">
                            <ArrowLeft />
                        </Link>
                    </Button>
                    <div>
                        <CardTitle className="text-2xl font-bold font-headline">Settings</CardTitle>
                        <CardDescription>Manage your app settings.</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-center p-8 text-muted-foreground">
                    <p>More settings coming soon!</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
