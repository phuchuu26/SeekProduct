import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ValidatorFn } from '@angular/forms';//Interface

export const emailValidator = (): ValidatorFn => {
    return (control: AbstractControl): { [key: string]: string } => {
        const result = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(control.value);
        console.log(`emailValidator = ${result}`);
        return result==true ? null : { 'error': "Wrong email format" };
    };
}
export const confirmPasswordValidator1 = (): ValidatorFn => {
  return (control: AbstractControl,): { [key: string]: string } => {
    console.log(control);
    console.log(control.value);
    console.log(control.parent.controls);
      return (control.value ) == true ? null : {'error1': "Wrong email format1"};
  };
}


export function MustMatch(controlName: string, matchingControlName: string) {
  return (accountForm: FormGroup) => {
      const control = accountForm.controls[controlName];
      const matchingControl = accountForm.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
          // return if another validator has already found an error on the matchingControl
          return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
          matchingControl.setErrors({ mustMatch: true });
      } else {
          matchingControl.setErrors(null);
      }
  }
}

export function MatchPassword(password: string, confirm_password: string) {
  return (accountForm: FormGroup) => {
    const passwordControl = accountForm.controls[password];
    const confirmPasswordControl = accountForm.controls[confirm_password];

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }
  }
}
