import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { email, form, Field, minLength, required } from '@angular/forms/signals';
import { UserApi } from '../../../../core/services/user-api';
import { Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { ILoginParams } from '../../models/login-params';
import { setErrorMessage } from '../../../../shared/utils/set-error-message';

@Component({
  selector: 'app-login-form',
  imports: [Field],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private readonly _userApi = inject(UserApi);
  private readonly _router = inject(Router);

  loginModel = signal<ILoginParams>({
    email: '',
    password: '',
  });

  loginParams = signal<ILoginParams| undefined>(undefined);

  loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, {message: 'O e-mail é obrigatório.'});
    email(schemaPath.email, {message: 'E-mail inválido.'});
    required(schemaPath.password, {message: 'A senha é obrigatória.'});
    minLength(schemaPath.password, 8, { message: 'A senha deve ter no mínimo 8 caracteres.'})
  });

  loginResource = rxResource({
    params: () => this.loginParams(),
    stream: ({params}) => {
      return this._userApi
      .login(params.email, params.password)
      .pipe(tap(()=> this._router.navigate(['/explore'])));
    },
  })

  loginError = computed(()=> setErrorMessage(this.loginResource.error()));

  login(){
    const credentials = this.loginForm().value();
    this.loginParams.set(credentials);
  }

}
