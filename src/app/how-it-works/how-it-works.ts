import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../footer/footer';
import { RouterLinkActive, RouterLinkWithHref } from '@angular/router';

@Component({
  imports: [Header, Footer, RouterLinkActive, RouterLinkWithHref],
  selector: 'app-how-it-works',
  styleUrl: './how-it-works.css',
  templateUrl: './how-it-works.html',
})
export class HowItWorks {}
