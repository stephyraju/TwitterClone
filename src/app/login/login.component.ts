import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginError: boolean = false;
  errorMsg: string = '';

  constructor(private formBuilder: FormBuilder, private router: Router, private http: HttpClient, private authService: AuthService) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    const apiUrl = `http://localhost:8080/api/auth/login`;

     // Create the request body
  const requestBody = {
    email: email,
    password: password
  };
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'accept': '*/*'
  });

  // Make the HTTP POST request
  this.http.post(apiUrl, requestBody, { headers: headers }).subscribe(
    (response: any) => {
      console.log('Login successful!', response);

      this.authService.setLoggedInUser(response.id);

      window.sessionStorage.setItem('id',response.id)
      window.sessionStorage.setItem('token',response.token)
      localStorage.setItem('token', response.token);

      this.router.navigate(['/home']);
    },
    (error: any) => {
      this.errorMsg = error.error.message;
      console.error('Login failed!', error);

    }
  );
}

  }
