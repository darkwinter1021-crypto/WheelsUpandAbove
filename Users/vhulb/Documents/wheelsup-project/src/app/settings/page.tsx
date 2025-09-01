
'use client';

import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Switch } from '../../components/ui/switch';
import { Separator } from '../../components/ui/separator';
import { Moon, Sun, Laptop, Bell, Mail } from 'lucide-react';

export default function SettingsPage() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <header className="mb-10">
        <h1 className="text-4xl font-bold font-headline">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and app preferences.</p>
      </header>

      <div className="space-y-12">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how WheelsUp looks on your device.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme" className="flex items-center gap-2">
                  <Sun className="h-5 w-5 inline-block dark:hidden" />
                  <Moon className="h-5 w-5 hidden dark:inline-block" />
                  Theme
                </Label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" /> Light
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" /> Dark
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Laptop className="h-4 w-4" /> System
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Choose how you want to be notified.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="flex flex-col gap-1">
                <span className='flex items-center'><Bell className='mr-2 h-4 w-4' />Push Notifications</span>
                <span className="text-xs font-normal text-muted-foreground">For new messages and ride updates.</span>
              </Label>
              <Switch id="push-notifications" disabled />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="flex flex-col gap-1">
                <span className='flex items-center'><Mail className='mr-2 h-4 w-4' />Email Notifications</span>
                <span className="text-xs font-normal text-muted-foreground">For promotions and important account activity.</span>
              </Label>
              <Switch id="email-notifications" disabled />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
