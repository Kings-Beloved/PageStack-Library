import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from "@angular/forms";
import { Books } from '../Services/books';
import { CommonModule } from '@angular/common';
import { Auth } from '../Services/auth';

@Component({
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {

  private bookService = inject(Books);
  private cdr = inject(ChangeDetectorRef);
  private auth = inject(Auth);

  selectGenre = new FormGroup({
    searchQuery: new FormControl(''),
    selectedGenre: new FormControl('')
  });

  Genre: any;
  books: any[] = [];
  isLoading: boolean = false;
  
  // Navigation & Library State
  activeTab: 'catalog' | 'library' = 'catalog';
  myLibrary: any[] = [];

  selectedBook: any = null;
  isModalOpen: boolean = false;
  isModalLoading: boolean = false;
  selectedBookCover: any = null;
  activeBook: any = null;

  isMobileMenuOpen: boolean = false;
  firstName: string = '';
  lastName: string = '';

  private bookDetailsCache = new Map<string, any>();

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  ngOnInit(): void {
    // FIX 1: Add 'this.' context to load library
    this.loadUserLibrary();

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload: any = jwtDecode(token);
        this.firstName = payload.First_name || payload.firstName || '';
        this.lastName = payload.Last_name || payload.lastName || '';
      } catch (error) {
        // Handle invalid token quietly
      }
    }

    this.loadBooks('bestseller');
  }

  private loadBooks(query: string): void {
    this.isLoading = true;
    this.books = [];

    const searchQuery = (!query || query === 'bestseller') ? 'bestseller' : query;

    this.bookService.allBook(searchQuery).subscribe({
      next: (olResponse: any) => {
        const olDocs = olResponse.docs || [];

        this.books = olDocs.filter((book: any) => 
          book.ebook_access === 'public' || 
          book.ebook_access === 'unrestricted' || 
          book.ebook_access === 'borrowable'
        );

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getBookAccessTier(book: any): 'free' | 'borrow' | 'unavailable' {
    if (!book) return 'unavailable';
    const access = book.ebook_access;
    if (access === 'public' || access === 'unrestricted') return 'free'; 
    if (access === 'borrowable') return 'borrow';
    return 'unavailable'; 
  }

  /* --- Library & Tab Management --- */

  loadUserLibrary(): void {
    const saved = localStorage.getItem('user_library');
    this.myLibrary = saved ? JSON.parse(saved) : [];
  }

  switchTab(tab: 'catalog' | 'library'): void {
    this.activeTab = tab;
    this.cdr.detectChanges();
  }

  // Auto-save to collection and open reader
  handleReadNow(book: any): void {
    if (!book) return;

    // 1. Automatically save to My Library if not present
    const exists = this.myLibrary.some((b: any) => b.key === book.key);
    if (!exists) {
      this.myLibrary.unshift(book);
      localStorage.setItem('user_library', JSON.stringify(this.myLibrary));
    }

    // 2. Launch external reader target
    const iaId = book.ia && book.ia.length > 0 ? book.ia[0] : null;
    if (iaId) {
      window.open(`https://archive.org/stream/${iaId}`, '_blank', 'noopener,noreferrer');
    } else if (book.key) {
      window.open(`https://openlibrary.org${book.key}`, '_blank', 'noopener,noreferrer');
    }

    this.cdr.detectChanges();
  }

  removeFromLibrary(bookKey: string, event?: Event): void {
    if (event) event.stopPropagation();
    this.myLibrary = this.myLibrary.filter((b: any) => b.key !== bookKey);
    localStorage.setItem('user_library', JSON.stringify(this.myLibrary));
    this.cdr.detectChanges();
  }

  /* --- Search & Filters --- */

  applyGenre(): void {
    this.Genre = this.selectGenre.value.selectedGenre;
    const query = this.Genre ? this.Genre : 'bestseller';
    this.loadBooks(query);
  }

  searchBook(): void {
    const query = this.selectGenre.value.searchQuery;
    if (query) {
      this.loadBooks(query);
    }
  }

  /* --- Modal Details --- */

  viewBookDetails(book: any): void {
  this.activeBook = book;
  this.selectedBookCover = book.cover_i || null;
  this.isModalOpen = true;

  // 1. Instantly display available data so the modal feels instantaneous
  const fallbackDescription = book.first_sentence ? book.first_sentence[0] : 'No summary available for this title.';
  
  this.selectedBook = {
    title: book.title,
    description: fallbackDescription,
    subjects: book.subject ? book.subject.slice(0, 4) : []
  };

  // 2. Return cached data immediately if available
  if (book.key && this.bookDetailsCache.has(book.key)) {
    this.selectedBook = this.bookDetailsCache.get(book.key);
    this.isModalLoading = false;
    this.cdr.detectChanges();
    return;
  }

  this.isModalLoading = true;

  // 3. Fetch detailed metadata from Open Library API
  if (book.key) {
    this.bookService.getBookDetails(book.key).subscribe({
      next: (details: any) => {
        let extractedDescription = fallbackDescription;

        // Parse Open Library description variations
        if (typeof details?.description === 'string') {
          extractedDescription = details.description;
        } else if (details?.description?.value) {
          extractedDescription = details.description.value;
        }

        // Create new object reference to trigger Angular change detection
        this.selectedBook = {
          title: details?.title || book.title,
          description: extractedDescription,
          subjects: details?.subjects || book.subject || []
        };

        if (!this.selectedBookCover && details?.covers?.length > 0) {
          this.selectedBookCover = details.covers[0];
        }

        this.bookDetailsCache.set(book.key, this.selectedBook);
        this.isModalLoading = false;

        // Force Angular view update
        this.cdr.detectChanges();
      },
      error: () => {
        this.isModalLoading = false;
        this.cdr.detectChanges();
      }
    });
  } else {
    this.isModalLoading = false;
    this.cdr.detectChanges();
  }
}
  closeModal(): void {
    this.isModalOpen = false;
    this.isModalLoading = false;
    this.selectedBook = null;
    this.activeBook = null;
    this.cdr.detectChanges();
  }

  onLogOut(){
    this.auth.logOut();
  }
}