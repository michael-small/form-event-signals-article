import {Component, effect, inject} from '@angular/core';
import {NonNullableFormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, JsonPipe} from "@angular/common";
import {$formValueAndStatus, formValueAndStatus$} from "./v16-utils";
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

    <p>V18 Helper Values. See the console for v16 utility equivalent being logged.</p>
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

  // v18 usage - see template
  form$ = allEventsObservable(this.form);
  $form = allEventsSignal(this.form);

  // v16 versions - see console
  formValueAndStatus$ = formValueAndStatus$(this.form);
  observableLogging = this.formValueAndStatus$.subscribe((v) => console.log('observable', v));

  $formValueAndStatus = $formValueAndStatus(this.form);
  $signalLogging = effect(() => console.log('signal', this.$formValueAndStatus()));
}
