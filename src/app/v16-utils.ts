import {AbstractControl, FormControlStatus} from '@angular/forms';
import {combineLatest, distinctUntilChanged, map, Observable, startWith} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";

export function formValues$<T>(form: AbstractControl<T>) {
  return form.valueChanges.pipe(
    startWith(form.value),
    distinctUntilChanged((previous, current) => JSON.stringify(previous) === JSON.stringify(current))
  );
}

export function formStatuses$<T>(form: AbstractControl<T>) {
  return form.statusChanges.pipe(
    startWith(form.status),
    map(() => form.status)
  );
}

export function formValueAndStatus$<T>(form: AbstractControl<T>):  Observable<{value: T, status: FormControlStatus}> {
  return combineLatest([formValues$(form), formStatuses$(form)]).pipe(
    map(([value, status]) => {
      return {
        value: value,
        status: status,
      }
    })
  )
}

export function $formValueAndStatus<T>(form: AbstractControl<T>) {
  return toSignal(formValueAndStatus$(form))
}
