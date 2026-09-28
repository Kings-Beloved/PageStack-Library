import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [Header, Footer, RouterLink, RouterLinkActive],
  selector: 'app-about-us',
  styleUrl: './about-us.css',
  templateUrl: './about-us.html',
})
export class AboutUs {}
