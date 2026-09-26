import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { BestSellers } from './best-sellers/best-sellers';
import { PreOrder } from './pre-order/pre-order';
import { BrowseBooks } from './browse-books/browse-books';
import { AboutUs } from './about-us/about-us';
import { NewArrivals } from './new-arrivals/new-arrivals';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { SignUp } from './sign-up/sign-up';
import { authGuard } from './auth-guard';
import { Loader } from './loader/loader';
import { Donate } from './donate/donate';
import { BookDetails } from './book-details/book-details';
import { HowItWorks } from './how-it-works/how-it-works';


export const routes: Routes = [
    {path:'', redirectTo: 'homepage', pathMatch:'full'},
    {path:'', component:Homepage},
    {path:'bestSeller', component: BestSellers},
    {path:'newArrivals', component:NewArrivals},
    {path:'preOrder', component: PreOrder},
    {path:'browseBooks', component:BrowseBooks},
    {path: 'aboutUs', component:AboutUs},
    {path:'login', component:Login},
    {path:'signUp', component:SignUp},
    {path:'loader', component:Loader},
    {path:'donate', component:Donate},
    {path:'howitworks', component:HowItWorks},
    {path:'dashboard/book/:id', component:BookDetails},
    {path:'dashboard', component:Dashboard, canActivate: [authGuard]}


];
