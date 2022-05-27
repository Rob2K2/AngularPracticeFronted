import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  submitted = false;
  authForm!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.authForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.authForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.authForm.invalid) {
      return;
    }

    const { username, password } = this.authForm.value;

    this.authService.login(username, password).subscribe((ok) => {
      console.log (ok)
      if (ok === true) {
        this.router.navigateByUrl('/home');
      } else {
        Swal.fire('Error', ok, 'error')
      }
    });
  }

  onReset(): void {
    this.submitted = false;
    this.authForm.reset();
  }
}
