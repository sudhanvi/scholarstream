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

interface DocumentCardProps {
  document: PdfDocument;
}

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="p-0">
        <Link href={`/document/${document.id}`} className="block">
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
        <Link href={`/document/${document.id}`}>
          <CardTitle className="font-headline text-lg mb-1 hover:text-primary transition-colors truncate" title={document.name}>
            {document.name}
          </CardTitle>
        </Link>
        <CardDescription className="text-xs text-muted-foreground flex items-center">
          <FileText className="w-3 h-3 mr-1 flex-shrink-0" /> {document.fileSize}
        </CardDescription>
        <CardDescription className="text-xs text-muted-foreground flex items-center mt-1">
          <Clock className="w-3 h-3 mr-1 flex-shrink-0" /> Last opened: {document.lastOpened}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t">
        <Link href={`/document/${document.id}`} passHref>
          <Button variant="outline" size="sm">Open</Button>
        </Link>
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" className="w-8 h-8">
            <Star className={`w-4 h-4 ${document.isFavorite ? "text-yellow-500 fill-yellow-400" : "text-muted-foreground"}`} />
            <span className="sr-only">Favorite</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <MoreVertical className="w-4 h-4" />
                <span className="sr-only">More options</span>
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
