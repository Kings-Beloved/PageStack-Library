import { Component, inject, OnInit, signal, Signal } from '@angular/core';
import { Books } from '../Services/books';
import { CommonModule } from '@angular/common';
import { Header } from "../header/header";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { MostRead } from "../most-read/most-read";
import { Footer } from "../footer/footer";

@Component({
  imports: [CommonModule, Header, RouterLinkActive, MostRead, Footer, RouterLink],
  selector: 'app-homepage',
  styleUrl: './homepage.css',
  templateUrl: './homepage.html',
})
export class Homepage implements OnInit {

  bookService = inject(Books);
  

  bookData = signal<any>(null);

onImageError(event:Event){
(event.target as HTMLImageElement).src = 'https://placehold.co/180x260/1a1a1a/D4AF37?text=No+Cover';
}

  ngOnInit(): void {
    this.displayBooks();
  }

  displayBooks(){
    this.bookService.getBooks('bestseller').subscribe((data:any)=>{
      console.log(data);

      this.bookData.set(data.docs);
      
    })
  }


}
