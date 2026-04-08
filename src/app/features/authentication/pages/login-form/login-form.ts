import { Component, signal } from '@angular/core';
import { email, form, Field, minLength, required } from '@angular/forms/signals';

@Component({
  selector: 'app-login-form',
  imports: [Field],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  loginModel = signal({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, {message: 'O e-mail é obrigatório.'});
    email(schemaPath.email, {message: 'E-mail inválido.'});
    required(schemaPath.password, {message: 'A senha é obrigatória.'});
    minLength(schemaPath.password, 8, { message: 'A senha deve ter no mínimo 8 caracteres.'})
  });

}
