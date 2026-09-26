import { Component, inject, signal } from '@angular/core';
import { Auth } from '../Services/auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators,} from "@angular/forms";
import { jwtDecode } from 'jwt-decode';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule, RouterLinkActive, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private auth = inject(Auth);
  private route = inject(Router);

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)

  })

  userData:any;
  response!:any
  message = signal('')
  visiblePassword = false

  displayPassword(){
    this.visiblePassword = !this.visiblePassword;
  }

  login(){
    console.log(this.loginForm.value);

    this.userData = this.loginForm.value;
    this.auth.loginUser(this.userData).subscribe((data)=>{
    this.response = data;
    // console.log(this.response);
    if (this.response.status == 504){
        this.message.set('Account does not exist, do you want to sign up?');
      } else if (this.response.status == 400){
        this.message.set('Invalid credentials')
      } else if(this.response.status == 200){

        let payload = jwtDecode(this.response.token)
        console.log(payload);
        localStorage.setItem('token', JSON.stringify(this.response.token));
        // this.message.set('Login successful, redirecting to dashboard');
        
          this.route.navigate(['/loader'])
        ;
        // setTimeout(()=>{
        //   this.route.navigate(['/loader'])
        // }, 3000); 
      }
    })
    
  }

  get email(){
    return this.loginForm.get('email');
  }
  get password(){
    return this.loginForm.get('password');
  }

 visibleMessage = true;

 clearMessage(){
  this.message.set('')
  this.visibleMessage = !this.visibleMessage;
 }


}
