
"use client";

import Link from 'next/link';
import { BookOpenText, UserCircle, CreditCard } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useReaderMode } from '@/contexts/ReaderModeContext';
import { useToast } from '@/hooks/use-toast';

export default function AppHeader() {
  const { isReaderMode } = useReaderMode();
  const { toast } = useToast();
  const trialDaysLeft = 23; // Mock trial days. Set to 0 or negative to see "Trial Ended" state.

  if (isReaderMode) {
    return null; 
  }

  const handleSubscribeClick = () => {
    toast({
      title: "Subscription Options",
      description: "This is where users would see plans and subscribe. (Mock Action)",
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BookOpenText className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-xl sm:inline-block">
            Scholar Stream
          </span>
        </Link>
        
        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          {trialDaysLeft > 0 ? (
            <>
              <div className="text-xs sm:text-sm text-muted-foreground hidden md:block">
                Trial ends in {trialDaysLeft} {trialDaysLeft === 1 ? 'day' : 'days'}
              </div>
              <Button variant="outline" size="sm" onClick={handleSubscribeClick}>
                <CreditCard className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </>
          ) : (
            <>
              <div className="text-xs sm:text-sm text-destructive-foreground bg-destructive px-2 py-1 rounded-md hidden md:block">
                Trial Ended
              </div>
              <Button variant="default" size="sm" onClick={handleSubscribeClick}>
                <CreditCard className="mr-2 h-4 w-4" />
                Upgrade Now
              </Button>
            </>
          )}
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full w-8 h-8 sm:w-10 sm:h-10">
                <UserCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="sr-only">User Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={handleSubscribeClick}>Manage Subscription</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
