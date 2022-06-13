import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import Swal from 'sweetalert2';

import { AuthService } from '../services/auth.service';
import { AppState } from '../../../app.reducer';
import * as ui from '../../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit, OnDestroy {
  submitted = false;
  authForm!: FormGroup;
  loading: boolean = false;
  uiSubscription!: Subscription;

  constructor(
    private readonly fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.uiSubscription = this.store.select('ui').subscribe((ui) => {
      this.loading = ui.isLoading;
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
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
    // Set isLoading to true in Redux Store
    this.store.dispatch(ui.isLoading());

    const { username, password } = this.authForm.value;

    this.authService.login(username, password).subscribe((ok) => {
      console.log(ok);
      if (ok === true) {
        // Set isLoading to false in Redux Store
        this.store.dispatch(ui.stopLoading());
        this.router.navigateByUrl('/home');
      } else {
        this.store.dispatch(ui.stopLoading());
        Swal.fire('Error', ok, 'error');
      }
    });
  }

  onReset(): void {
    this.submitted = false;
    this.authForm.reset();
  }
}
