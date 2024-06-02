import {Component, inject} from '@angular/core';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, JsonPipe} from "@angular/common";
import {allEventsObservable, allEventsSignal} from "./form-events";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, AsyncPipe],
  template: `
    <form [formGroup]="form">
      <span>
        <label for="firstName">First Name </label>
        <input formControlName="firstName" name="firstName"/>
      </span>
      <span>
        <label for="lastName">Last Name </label>
        <input formControlName="lastName" name="lastName"/>
      </span>
      <button type="reset">Reset</button>
    </form>
    <div id="form-values">
      <pre>$form (signal): {{ $form() | json }}</pre>
      <pre>form$ (observable): {{ form$ | async | json }}</pre>
    </div>
  `,
  styles: `
    #form-values {
      display: flex;
    }

    form {
      display: flex;
      flex-direction: column;
      max-width: 300px;
      gap: 10px;
    }
  `
})
export class AppComponent {
  fb = inject(NonNullableFormBuilder);
  form = this.fb.group({
    firstName: this.fb.control('', Validators.required),
    lastName: this.fb.control(''),
  });

  form$ = allEventsObservable(this.form);
  $form = allEventsSignal(this.form);
}
