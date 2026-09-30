import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../Services/auth';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Login } from "../login/login";

@Component({
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive, Login],
  selector: 'app-sign-up',
  styleUrl: './sign-up.css',
  templateUrl: './sign-up.html',
})
export class SignUp {

  private auth = inject(Auth)
  private route = inject(Router)

  passwordPattern = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

countries = [
  {name: 'Nigeria', code:'NG'},
  {name: 'United States', code:'US'},
  {name: 'United Kingdom', code:'GB'},
  {name: 'Canada', code:'CA'},
  {name: 'Ghana', code:'GH'},
  {name: 'South Africa', code:'ZA'},
  {name: 'Kenya', code:'KE'},
];

  signupForm = new FormGroup({
firstName: new FormControl('', Validators.required),
lastName: new FormControl('', Validators.required),
Email: new FormControl('', Validators.email),
Password: new FormControl('', [Validators.required, Validators.pattern(this.passwordPattern)]),

Nationality: new FormControl(),
Occupation: new FormControl()
  })




  userData:any;
  result:any;
  message = signal<string | null>('');

  visiblePassword = false
  displayPassword(){
    this.visiblePassword = !this.visiblePassword;
  }

  signUp(){
    console.log(this.signupForm.value);

    this.userData = this.signupForm.value;

    this.auth.createUser(this.userData).subscribe((response:any)=>{
      console.log(response);
      this.result = response;

      
      if(this.result.status == 200){
        this.message.set('Account Succesfully created, Redirecting to login Page');
        
        setTimeout(()=>{
          this.route.navigate(['/login']);

        },4000)
      } else if(this.result.status == 400){
        this.message.set('Account already exist, please login!')
      }else{
        this.message.set('Error creating the your account, Please try again later')
      }
    })
  
  }

  get firstName(){
    return this.signupForm.get('firstName');
  }
  get lastName(){
    return this.signupForm.get('lastName');
  }
  get email(){
    return this.signupForm.get('Email');
  }
  get password(){
    return this.signupForm.get('Password');
  }


  clearMessage(): void {
  this.message.set(null);   
}
}
