import { Component } from '@angular/core';

@Component({
  selector: 'app-menu-mobile',
  templateUrl: './menu-mobile.component.html',
  styleUrl: './menu-mobile.component.scss'
})
export class MenuMobileComponent {

  activeMenu: any = null;

  menus = [
    {
      label: 'Ações',
      icon: 'bi bi-lightning-charge-fill',
      items: ['Publicar notícia', 'Nova pauta', 'Minhas atividades']
    },
    {
      label: 'Comunidade',
      icon: 'bi bi-people-fill',
      items: ['Usuários', 'Ranking', 'Novos membros']
    },
    {
      label: 'Mensagens',
      icon: 'bi bi-chat-dots-fill',
      items: ['Enviar Mensagem', 'Minhas mensagens']
    },
    {
      label: 'Perfil',
      icon: 'bi bi-person-circle',
      items: ['Meu perfil', 'Sair']
    }
  ];

  openSheet(menu: any) {
    this.activeMenu = menu;
  }

  closeSheet() {
    this.activeMenu = null;
  }
}
