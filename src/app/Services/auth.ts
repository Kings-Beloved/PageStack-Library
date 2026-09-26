import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Router } from '@angular/router';

@Service()
export class Auth {

    private router = inject(Router)

    private http = inject(HttpClient);

    createUser(data:any){
        return this.http.post('http://localhost/PageStack/auth/createUser', data)
    }
    
    loginUser(data:any){
        return this.http.post('http://localhost/PageStack/auth/loginUser', data)
    }

    logOut(){
        localStorage.removeItem('token');

        this.router.navigate(['/login']);
    }

}
