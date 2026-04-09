import { Component, signal } from '@angular/core';
import { email, Field, form, minLength, required, validate } from '@angular/forms/signals';
import { confirmPassword } from '../../validators/confirm-password';

@Component({
  selector: 'app-register-user-form',
  imports: [Field],
  templateUrl: './register-user-form.html',
  styleUrl: './register-user-form.css',
})
export class RegisterUserForm {
  registerModel = signal({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.name, { message: 'O nome é obrigatório.'});
    
    required(schemaPath.email, { message: 'O e-mail é obrigatório.'});
    email(schemaPath.email, { message: 'E-mail inválido.'});

    required(schemaPath.password, { message: 'A senha é obrigatória.'});
    minLength(schemaPath.password, 8 , { message: 'A senha deve ter no mínimo 8 caracteres.'});

    confirmPassword(schemaPath.confirmPassword, schemaPath.password);
  });
}
