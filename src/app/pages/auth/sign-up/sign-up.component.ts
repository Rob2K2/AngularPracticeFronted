import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import Validation from './validation';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent {
  // options: OptionsForm = {
  //   id: ACTIONS.signUp,
  //   label: ACTIONS.signUp,
  // };
  submitted = false;
  authForm!: FormGroup;
  //signIn = ACTIONS.signIn;
  //@Input() options!: OptionsForm;

  constructor(private readonly fb: FormBuilder) {}

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

  // notValidField(field: string) {
  //   return (
  //     this.authForm.get(field)?.invalid && this.authForm.get(field)?.touched
  //   );
  // }

  get f(): { [key: string]: AbstractControl } {
    return this.authForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.authForm.markAllAsTouched();
    if (this.authForm.invalid) {
      return;
    }
    console.log(JSON.stringify(this.authForm.value, null, 2));
  }

  onReset(): void {
    this.submitted = false;
    this.authForm.reset();
  }
}
