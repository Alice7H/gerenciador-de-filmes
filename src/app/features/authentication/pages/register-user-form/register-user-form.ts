import { Component, inject, signal } from '@angular/core';
import { email, Field, form, minLength, required, validate } from '@angular/forms/signals';
import { confirmPassword } from '../../validators/confirm-password';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserApi } from '../../../../core/services/user-api';
import { IRegisterParams } from '../../models/register-params';

@Component({
  selector: 'app-register-user-form',
  imports: [Field],
  templateUrl: './register-user-form.html',
  styleUrl: './register-user-form.css',
})
export class RegisterUserForm {
  private readonly _userApi = inject(UserApi);

  registerModel = signal<IRegisterParams>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  registerParams = signal<IRegisterParams| undefined>(undefined);

  registerForm = form(this.registerModel, (schemaPath) => {
    required(schemaPath.name, { message: 'O nome é obrigatório.'});
    
    required(schemaPath.email, { message: 'O e-mail é obrigatório.'});
    email(schemaPath.email, { message: 'E-mail inválido.'});

    required(schemaPath.password, { message: 'A senha é obrigatória.'});
    minLength(schemaPath.password, 8 , { message: 'A senha deve ter no mínimo 8 caracteres.'});

    confirmPassword(schemaPath.confirmPassword, schemaPath.password);
  });

  registerResource = rxResource({
    params: () => this.registerParams(),
    stream: ({params}) => this._userApi.register(params.name, params.email, params.password),
  })

  register(){
    const userInfos = this.registerForm().value();
    this.registerParams.set(userInfos);
  }
}
