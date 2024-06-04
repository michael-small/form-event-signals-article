import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl } from '@angular/forms';
import { combineLatest, distinctUntilChanged, map, startWith } from 'rxjs';

export function formValues$<T>(form: AbstractControl<T>) {
  return form.valueChanges.pipe(
    startWith(form.value),
    distinctUntilChanged(
      (previous, current) =>
        JSON.stringify(previous) === JSON.stringify(current),
    ),
  );
}

export function formStatuses$<T>(form: AbstractControl<T>) {
  return form.statusChanges.pipe(
    startWith(form.status),
    map(() => form.status),
  );
}

export function formValueAndStatus$<T>(form: AbstractControl<T>) {
  return combineLatest([formValues$(form), formStatuses$(form)]).pipe(
    map(([value, status]) => {
      // Bonus! You can choose to include these if you want
      const valid = status === 'VALID';
      const invalid = status === 'INVALID';
      const pending = status === 'PENDING';
      return {
        value: value,
        status: status,
        valid: valid,
        invalid: invalid,
        pending: pending,
      };
    }),
  );
}

export function $formValueAndStatus<T>(form: AbstractControl<T>) {
  return toSignal(formValueAndStatus$(form));
}
