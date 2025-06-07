"use client";

import { useState } from 'react';
import { mockPdfDocuments } from '@/constants/mockData';
import type { PdfDocument } from '@/types';
import { DocumentCard } from './DocumentCard';
import { ImportPdfDialog } from './ImportPdfDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListFilter, Search, Star, Clock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DocumentLibrary() {
  const [documents, setDocuments] = useState<PdfDocument[]>(mockPdfDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'recent' | 'favorites'>('all');
  const [sortOrder, setSortOrder] = useState<'name_asc' | 'name_desc' | 'lastOpened_asc' | 'lastOpened_desc'>('lastOpened_desc');


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredAndSortedDocuments = documents
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm);
      if (filter === 'favorites') return matchesSearch && doc.isFavorite;
      // 'recent' filter logic would need actual date parsing; for now, it's a placeholder
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        // Proper date sorting would require converting lastOpened to Date objects
        case 'lastOpened_asc': 
          return a.lastOpened.localeCompare(b.lastOpened); // Simplified sort
        case 'lastOpened_desc':
          return b.lastOpened.localeCompare(a.lastOpened); // Simplified sort
        default:
          return 0;
      }
    });
    

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-headline font-bold text-primary">My Documents</h1>
        <ImportPdfDialog />
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg bg-card">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')} className="flex-grow sm:flex-grow-0">
            <ListFilter className="mr-2 h-4 w-4" /> All
          </Button>
          <Button variant={filter === 'recent' ? 'default' : 'outline'} onClick={() => setFilter('recent')} className="flex-grow sm:flex-grow-0">
            <Clock className="mr-2 h-4 w-4" /> Recent
          </Button>
          <Button variant={filter === 'favorites' ? 'default' : 'outline'} onClick={() => setFilter('favorites')} className="flex-grow sm:flex-grow-0">
            <Star className="mr-2 h-4 w-4" /> Favorites
          </Button>
        </div>
         <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastOpened_desc">Last Opened (Newest)</SelectItem>
              <SelectItem value="lastOpened_asc">Last Opened (Oldest)</SelectItem>
              <SelectItem value="name_asc">Name (A-Z)</SelectItem>
              <SelectItem value="name_desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
      </div>

      {filteredAndSortedDocuments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedDocuments.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">No documents found.</p>
          {searchTerm && <p>Try adjusting your search or filter.</p>}
        </div>
      )}
    </div>
  );
}
