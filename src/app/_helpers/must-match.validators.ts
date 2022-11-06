// import {FormGroup} from '@angular/forms';

// export function MustMatch(password: string, confirmPassword : string){
//     return (formGroup : FormGroup) => {
//         const passwordControl = formGroup.controls[password];
//         const confirmpasswordControl = formGroup.controls[confirmPassword];
//         if(confirmpasswordControl.errors && !confirmpasswordControl.errors['mustMatch']){
//             return;
//         }
//         if(passwordControl.value !== confirmpasswordControl.value){
//             confirmpasswordControl.setErrors({mustMatch: true});
//         }else{
//             confirmpasswordControl.setErrors(null);
//         }
//     }
// }



import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function MustMatch(password: string, confirmPassword : string) : ValidatorFn{
    return (ctrl : AbstractControl) : ValidationErrors | null => {
        const passwordControl = ctrl.get(password);
        const confirmpasswordControl = ctrl.get(confirmPassword);
        if(confirmpasswordControl.errors && !confirmpasswordControl.errors['mustMatch']){
            return null;
        }
        if(passwordControl.value !== confirmpasswordControl.value){
            confirmpasswordControl.setErrors({mustMatch: true});
        }else{
            confirmpasswordControl.setErrors(null);
        }
        return null;
    }
}