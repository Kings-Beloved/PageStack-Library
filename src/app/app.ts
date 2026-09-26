import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./header/header";
import { SignUp } from "./sign-up/sign-up";
import { Login } from "./login/login";
import { Dashboard } from "./dashboard/dashboard";
import { MostRead } from "./most-read/most-read";
import { Footer } from "./footer/footer";
import { Disclaimer } from "./disclaimer/disclaimer";
import { Loader } from "./loader/loader";
import { Donate } from "./donate/donate";
import { BookDetails } from "./book-details/book-details";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, SignUp, Login, Dashboard, MostRead, Footer, Disclaimer, Loader, Donate, BookDetails],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('PageStack');
}
