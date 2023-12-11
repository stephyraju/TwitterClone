import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
// import { AuthService } from 'src/services/auth.service';
import { User } from '../user.interface'; // Import the User interface
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup;
  confirmPassword: string = 'none';
  registrationSuccess: boolean = false;
  formSubmitted: boolean = false;
  baseURL: string = '';
  error: string | null = '';
  success: string | null = '';
  errorMsg: string | null = '';


  ngOnInit(): void {
    this.baseURL = window.sessionStorage.getItem('baseURL') as string;
   }


  constructor(private formBuilder: FormBuilder, private router: Router, private http: HttpClient) {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern("[a-zA-Z].*")]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern("[a-zA-Z].*")]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required, Validators.pattern("[0-9]*"), Validators.minLength(10), Validators.maxLength(12)]],
      gender: ['', [Validators.required]],
      pwd: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20), this.validatePassword]],
      rpwd: ['']
    });
  }


  validatePassword(control: AbstractControl): ValidationErrors | null {
    const password = control.value;
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    if (!hasSpecialCharacter) {
      return { specialCharacter: true };
    }
    return null;
  }
// changes
  registerSubmitted() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }
    if (this.pwd.value === this.rpwd.value) {
      console.log("Submitted");
      const firstName = this.registrationForm.value.firstName;
      const lastName = this.registrationForm.value.lastName;
      const email = this.registrationForm.value.email;
      const password = this.registrationForm.value.pwd;
      const  username = `${this.registrationForm.value.firstName} ${this.registrationForm.value.lastName}`;
      const  fullName = `${this.registrationForm.value.firstName} ${this.registrationForm.value.lastName}`;

      const apiUrl = `http://localhost:8080/api/auth/register`;

      const requestBody = {
        name : fullName,
        email: email,
        password: password,
        username: username
      };

// Set the headers (if required by your API)
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'accept': '*/*'
  });

  // Make the HTTP POST request
  this.http.post(apiUrl, requestBody, { headers: headers }).subscribe(
    (response: any) => {
      this.success =response.registrationMsg;
      // window.sessionStorage.setItem('success',response.registrationMsg);
      console.log('register successful!', response);

  // Add the registered user to AuthService
  // this.authService.addRegisteredUser(response);

      this.router.navigate(['/login']);
     //  this.success =response.registrationMsg;

    },
    (error: any) => {
      if (error && error.error && error.error.message) {
        this.errorMsg = error.error.message;
      } else {

        this.errorMsg = 'An error occurred';
      }

      console.error('register failed!', error);
      if (error && error.status == 200) {
        this.router.navigate(['/register']);
      }

    }

  );
      this.registrationSuccess = true;
    } else {
      this.confirmPassword = 'inline';
    }
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  // Getter methods for form controls
  get firstName(): FormControl {
    return this.registrationForm.get('firstName') as FormControl;
  }

  get lastName(): FormControl {
    return this.registrationForm.get('lastName') as FormControl;
  }

  get email(): FormControl {
    return this.registrationForm.get('email') as FormControl;
  }

  get mobile(): FormControl {
    return this.registrationForm.get('mobile') as FormControl;
  }

  get gender(): FormControl {
    return this.registrationForm.get('gender') as FormControl;
  }

  get pwd(): FormControl {
    return this.registrationForm.get('pwd') as FormControl;
  }

  get rpwd(): FormControl {
    return this.registrationForm.get('rpwd') as FormControl;
  }
}
