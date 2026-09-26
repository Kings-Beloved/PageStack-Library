import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Auth } from '../Services/auth';
import { Books } from '../Services/books';

@Component({
  selector: 'app-most-read',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrl: './most-read.css',
  templateUrl: './most-read.html',
})
export class MostRead implements OnInit, OnDestroy {
  private auth = inject(Auth);
  private books = inject(Books);

  @ViewChild('carouselViewport') viewport!: ElementRef<HTMLElement>;

  mostRead = signal<any[]>([]);
  private scrollInterval: any;

  ngOnInit(): void {
    this.getMostRead();
    this.startAutoScroll();
  }

  ngOnDestroy(): void {
    this.stopAutoScroll();
  }

  // Auto Scroll Methods
  startAutoScroll(): void {
    this.scrollInterval = setInterval(() => {
      if (this.viewport?.nativeElement) {
        const el = this.viewport.nativeElement;
        
        // If reached the end, reset back to start smoothly
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
          el.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          el.scrollBy({ left: 240, behavior: 'smooth' });
        }
      }
    }, 3000); // Scrolls every 3 seconds
  }

  stopAutoScroll(): void {
    if (this.scrollInterval) {
      clearInterval(this.scrollInterval);
    }
  }

  // Manual Scroll Methods
  scrollNext(): void {
    if (this.viewport?.nativeElement) {
      this.viewport.nativeElement.scrollBy({ left: 320, behavior: 'smooth' });
    }
  }

  scrollPrev(): void {
    if (this.viewport?.nativeElement) {
      this.viewport.nativeElement.scrollBy({ left: -320, behavior: 'smooth' });
    }
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://via.placeholder.com/180x260?text=No+Cover';
  }

  getMostRead(): void {
    this.books.getBooks('bonnke').subscribe((data: any) => {
      this.mostRead.set(data.docs);
    });
  }
}