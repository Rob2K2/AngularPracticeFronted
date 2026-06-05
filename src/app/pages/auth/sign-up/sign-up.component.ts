import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import Validation from './validation';
import { AuthService } from '../services/auth.service';
import { environment } from '@env/environment';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  submitted = false;
  authForm!: FormGroup;
  loading = false;
  readonly mockAuthEnabled = environment.useMockAuth;

  constructor(
    private readonly fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.authForm = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(40),
          ],
        ],
        password2: ['', Validators.required],
      },
      {
        validators: [Validation.match('password', 'password2')],
      }
    );
  }

  get f(): { [key: string]: AbstractControl } {
    return this.authForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.authForm.invalid) {
      return;
    }

    this.loading = true;
    const { username, email, password } = this.authForm.value;

    this.authService.register({ username, email, password }).subscribe((result) => {
      this.loading = false;

      if (result === true) {
        Swal.fire({
          title: 'Account created',
          text: 'You can now sign in with your username and password.',
          icon: 'success',
        }).then(() => {
          this.router.navigateByUrl('/sign-in');
        });
        return;
      }

      const message =
        typeof result === 'string' ? result : 'Could not create account';
      Swal.fire('Error', message, 'error');
    });
  }

  onReset(): void {
    this.submitted = false;
    this.authForm.reset();
  }
}
