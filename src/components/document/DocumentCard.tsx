import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, Star, MoreVertical, Download, Share2, Trash2 } from "lucide-react";
import type { PdfDocument } from '@/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';

interface DocumentCardProps {
  document: PdfDocument;
}

export function DocumentCard({ document }: DocumentCardProps) {
  const [lastOpenedFormatted, setLastOpenedFormatted] = useState('');

  useEffect(() => {
    if (document.lastOpened) {
      try {
        const date = parseISO(document.lastOpened);
        setLastOpenedFormatted(formatDistanceToNow(date, { addSuffix: true }));
      } catch (error) {
        console.error("Error parsing date for document card:", error);
        setLastOpenedFormatted(document.lastOpened); // Fallback to raw string
      }
    }
  }, [document.lastOpened]);

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Link href={`/document/${document.id}`} className="block" aria-label={`Open document ${document.name}`}>
          <Image
            src={document.thumbnailUrl}
            alt={`Thumbnail for ${document.name}`}
            width={300}
            height={420}
            className="w-full h-48 object-cover"
            data-ai-hint="document cover"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/document/${document.id}`} aria-label={`Open document ${document.name}`}>
          <CardTitle className="font-headline text-lg mb-1 hover:text-primary transition-colors truncate" title={document.name}>
            {document.name}
          </CardTitle>
        </Link>
        <CardDescription className="text-xs text-muted-foreground flex items-center">
          <FileText className="w-3 h-3 mr-1 flex-shrink-0" /> {document.fileSize}
        </CardDescription>
        <CardDescription className="text-xs text-muted-foreground flex items-center mt-1">
          <Clock className="w-3 h-3 mr-1 flex-shrink-0" /> Last opened: {lastOpenedFormatted}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex justify-end items-center border-t">
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="w-8 h-8" aria-label={document.isFavorite ? "Remove from favorites" : "Add to favorites"}>
            <Star className={`w-4 h-4 ${document.isFavorite ? "text-yellow-500 fill-yellow-400" : "text-muted-foreground"}`} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8" aria-label="More options">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                <span>Download</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                <span>Share</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive hover:!bg-destructive/10">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
}
