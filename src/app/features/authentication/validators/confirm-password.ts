import { validate } from "@angular/forms/signals";

export function confirmPassword(confirmPasswordField: any, passwordField: any){
   validate(confirmPasswordField, ({value, valueOf}) => {
      const confirmPassword = value();
      const password = valueOf(passwordField);

      if(confirmPassword != password){
        return {
          kind: 'confirmPassword',
          message: 'As senhas devem ser iguais.',
        };
      }
      
      return null;
    });
}