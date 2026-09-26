import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Books } from '../Services/books';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-details.html',
  styleUrl: './book-details.css'
})
export class BookDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private bookService = inject(Books);

  selectedBookId: string | null = null;
  bookData: any = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const rawId = params.get('id');
      if (rawId) {
        this.selectedBookId = rawId
          .replace('/works/', '')
          .replace(/^\/+|\/+$/g, '')
          .replace(/\.json$/, '');

        this.fetchDetails(this.selectedBookId);
      } else {
        this.errorMessage = 'No book selected.';
        this.isLoading = false;
      }
    });
  }

  fetchDetails(workId: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookService.getBookDetails(workId).subscribe({
      next: (data: any) => {
        if (!data || Object.keys(data).length === 0) {
          this.errorMessage = 'Book details not found.';
        } else {
          this.bookData = data;
        }
        // Force spinner to turn off
        this.isLoading = false;
      },
      error: (err:any) => {
        console.error('Failed to load book details:', err);
        this.errorMessage = 'Failed to load book details. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // Safe title getter
  getTitle(): string {
    return this.bookData?.title || this.bookData?.full_title || 'Untitled Book';
  }

  // Safe description getter
  getDescription(): string {
    if (!this.bookData || !this.bookData.description) {
      return 'No description available for this work.';
    }
    
    const desc = this.bookData.description;
    if (typeof desc === 'string') return desc;
    if (typeof desc === 'object' && desc.value) return desc.value;
    
    return 'No description available for this work.';
  }

  // Safe cover getter
  getCoverUrl(): string {
    if (this.bookData?.covers && this.bookData.covers.length > 0 && this.bookData.covers[0] > 0) {
      return `https://covers.openlibrary.org/b/id/${this.bookData.covers[0]}-L.jpg`;
    }
    return 'https://via.placeholder.com/300x450?text=No+Cover+Available';
  }
}