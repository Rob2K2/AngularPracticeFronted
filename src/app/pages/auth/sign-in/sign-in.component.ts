import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent {
  // options: OptionsForm = {
  //   id: ACTIONS.signIn,
  //   label: ACTIONS.signIn,
  // };
  submitted = false;
  authForm!: FormGroup;
  //signIn = ACTIONS.signIn;
  //@Input() options!: OptionsForm;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  // onSubmit(): void {
  //   console.log('Save', this.authForm.value);
  //   this.authForm.markAllAsTouched();
  // }

  private initForm(): void {
    this.authForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  notValidField(field: string) {
    return (
      this.authForm.get(field)?.invalid &&
      this.authForm.get(field)?.touched
    );
  }

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
