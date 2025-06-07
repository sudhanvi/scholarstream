"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Share2, Mail, Copy } from "lucide-react"; // Using MessageCircle for WhatsApp as placeholder

interface ShareDialogProps {
  documentName: string;
  children: React.ReactNode; // To use custom trigger
}

export function ShareDialog({ documentName, children }: ShareDialogProps) {
  const { toast } = useToast();

  const handleShare = (platform: "email" | "whatsapp" | "link") => {
    // Mock sharing functionality
    toast({
      title: "Shared (Mock)",
      description: `${documentName} shared via ${platform}.`,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://scholarstream.app/share/${documentName.replace(/\s+/g, '-').toLowerCase()}-mock-link`);
    toast({
      title: "Link Copied!",
      description: "Shareable link copied to clipboard.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Share "{documentName}"</DialogTitle>
          <DialogDescription>
            Share this document or snips via email, WhatsApp, or a shareable link.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button variant="outline" onClick={() => handleShare("email")}>
            <Mail className="mr-2 h-4 w-4" /> Share via Email
          </Button>
          <Button variant="outline" onClick={() => handleShare("whatsapp")}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.61 15.33 3.4 16.8L2 22L7.39 20.63C8.84 21.33 10.41 21.72 12.04 21.72C17.5 21.72 21.95 17.27 21.95 11.81C21.95 6.35 17.5 2 12.04 2ZM12.04 20.06C10.62 20.06 9.25 19.71 8.05 19.07L7.62 18.83L4.9 19.55L5.64 17L5.39 16.54C4.65 15.23 4.2 13.61 4.2 11.91C4.2 7.51 7.73 3.97 12.04 3.97C16.36 3.97 19.89 7.51 19.89 11.81C19.89 16.12 16.36 20.06 12.04 20.06ZM16.95 14.38C16.71 14.26 15.53 13.69 15.31 13.61C15.09 13.52 14.93 13.48 14.77 13.72C14.61 13.97 14.09 14.58 13.94 14.74C13.78 14.9 13.62 14.92 13.38 14.8C13.14 14.68 12.24 14.37 11.17 13.42C10.36 12.7 9.82 11.83 9.68 11.58C9.54 11.33 9.66 11.21 9.77 11.1C9.87 11 9.99 10.86 10.11 10.73C10.23 10.6 10.27 10.5 10.35 10.34C10.43 10.18 10.39 10.04 10.33 9.92C10.27 9.8 9.82 8.66 9.64 8.23C9.46 7.8 9.27 7.85 9.12 7.84H8.79C8.63 7.84 8.33 7.92 8.06 8.18C7.8 8.43 7.14 9.03 7.14 10.23C7.14 11.42 8.09 12.57 8.21 12.73C8.33 12.89 9.82 15.29 12.16 16.22C12.75 16.48 13.19 16.61 13.53 16.71C14.1 16.87 14.58 16.84 14.97 16.78C15.41 16.71 16.41 16.13 16.61 15.53C16.81 14.94 16.81 14.46 16.75 14.38Z" /></svg>
             Share via WhatsApp
          </Button>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input type="text" value={`https://scholarstream.app/share/... (view-only)`} readOnly />
            <Button type="button" size="icon" onClick={handleCopyLink} aria-label="Copy Link">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => { /* Close dialog */ }}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
