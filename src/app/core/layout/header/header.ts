import { Component, inject } from '@angular/core';
import { UserTokenStore } from '../../services/user-token-store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly _userTokenStore = inject(UserTokenStore);
  private readonly _router = inject(Router);

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    console.log('Saindo do sistema...');
    this._userTokenStore.removeToken();
    this._router.navigate(['/auth/login']);
  }
}
