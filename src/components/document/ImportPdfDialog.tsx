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
import { UploadCloud } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function ImportPdfDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      // In a real app, you would handle the file upload here.
      // For this prototype, we just show a toast.
      toast({
        title: "Import Initiated",
        description: `${selectedFile.name} is being imported. (Mocked)`,
      });
      setSelectedFile(null);
      setIsOpen(false);
    } else {
      toast({
        title: "No File Selected",
        description: "Please select a PDF file to import.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <UploadCloud className="mr-2 h-4 w-4" /> Import PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Import PDF</DialogTitle>
          <DialogDescription>
            Select a PDF file from your device, or provide a URL.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pdf-file" className="text-right">
              File
            </Label>
            <Input
              id="pdf-file"
              type="file"
              accept=".pdf"
              className="col-span-3"
              onChange={handleFileChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pdf-url" className="text-right">
              URL
            </Label>
            <Input
              id="pdf-url"
              placeholder="https://example.com/document.pdf"
              className="col-span-3"
            />
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Or connect cloud storage (Google Drive, Dropbox - Mock)
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleImport}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
