import { Component, inject } from '@angular/core';
import { UserTokenStore } from '../../services/user-token-store';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UserInfosStore } from '../../services/user-infos-store';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly _userTokenStore = inject(UserTokenStore);
  private readonly _router = inject(Router);
  readonly userInfosStore = inject(UserInfosStore);

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    console.log('Saindo do sistema...');
    this._userTokenStore.removeToken();
    this.userInfosStore.removeUser();
    this._router.navigate(['/auth/login']);
  }
}
