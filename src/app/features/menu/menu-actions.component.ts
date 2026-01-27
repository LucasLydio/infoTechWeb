import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-menu-actions',
  templateUrl: './menu-actions.component.html',
  styleUrl: './menu-actions.component.scss'
})
export class MenuActionsComponent {

  activeIndex: number | null = null;
  isLoggedIn: boolean = false;
  toggle = false;
  menus = [
    {
      label: 'Ações',
      icon: 'bi bi-lightning-charge-fill',
      items: ['Publicar notícia', 'Nova pauta', 'Minhas atividades']
    },
    {
      label: 'Nossa Comunidade',
      icon: 'bi bi-people-fill',
      items: ['Usuários', 'Ranking', 'Novos membros']
    },
    {
      label: 'Mensagens',
      icon: 'bi bi-chat-dots-fill',
      items: ['Enviar Mensagem', 'Minhas mensagens']
    },
    {
      label: 'Políticas',
      icon: 'bi bi-shield-fill-check',
      items: ['Termos de uso', 'Regras da comunidade', 'Privacidade']
    }
  ];

  constructor(
    private auth: AuthService
  ) {
    this.isLoggedIn = this.auth.isAuthenticated();
  }

  openMenu(index: number) {
    this.activeIndex = index;
  }

  closeMenu(index: number) {
    if (this.activeIndex === index) {
      this.activeIndex = null;
    }
  }

  toggleMenu() {
    this.toggle = !this.toggle;
  }

  logout() {
    // Lógica de logout aqui
    console.log('Usuário deslogado');
  }
}
