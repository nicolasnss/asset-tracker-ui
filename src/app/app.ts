import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from './services/auth';

// Importando os seus novos componentes
import { NavbarComponent } from './components/navbar/navbar';
import { AssetListComponent } from './components/asset-list/asset-list';

@Component({
  selector: 'app-root',
  standalone: true,
  // Adicionamos os novos componentes aqui para o Angular permitir o uso das tags no HTML
  imports: [CommonModule, RouterModule, NavbarComponent, AssetListComponent],
  // Usamos o template inline para organizar a estrutura da página rapidamente
  template: `
    <app-navbar></app-navbar>

    <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
      <h2 style="color: #444; margin-bottom: 20px;">Gerenciamento de Ativos - Dashboard</h2>
      <app-asset-list></app-asset-list>
    </div>

    <router-outlet></router-outlet>
  `,
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    console.log('--- TESTE DE INTEGRAÇÃO INICIADO ---');

    // Mantemos o teste que você validou para garantir que o canal com o Java continua aberto
    this.authService.testarLogin('nicolas', 'nicolas123').subscribe({
      next: (dados: any) => {
        console.log('SUCESSO NA CONEXÃO:', dados);
        // O alert confirmará que o componente carregou e a API respondeu
      },
      error: (erro: any) => {
        console.error('ERRO DE CONEXÃO NO APP.TS:', erro);
      },
    });
  }
}
