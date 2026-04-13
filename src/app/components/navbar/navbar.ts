import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary">
      <mat-icon style="margin-right: 10px;">inventory_2</mat-icon>
      <span>Asset Tracker - Sistema de Gestão</span>
      <span style="flex: 1 1 auto;"></span>
      <button mat-button>Dashboard</button>
      <button mat-button>Ativos</button>
      <button mat-icon-button><mat-icon>account_circle</mat-icon></button>
    </mat-toolbar>
  `
})
export class NavbarComponent {}
