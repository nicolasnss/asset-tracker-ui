import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth';
import { AssetFormComponent } from '../asset-form/asset-form';

interface Asset {
  id: number;
  nome: string;
  tagPatrimonio: string;
}

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatDialogModule, MatIconModule],
  template: `
    <button mat-raised-button color="primary" (click)="openFormDialog()">Novo Ativo</button>
    <div class="mat-elevation-z8" style="margin-top: 20px;">
      <table mat-table [dataSource]="dataSource">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef>ID</th>
          <td mat-cell *matCellDef="let element">{{ element.id }}</td>
        </ng-container>

        <ng-container matColumnDef="nome">
          <th mat-header-cell *matHeaderCellDef>Nome do Ativo</th>
          <td mat-cell *matCellDef="let element">{{ element.nome }}</td>
        </ng-container>

        <ng-container matColumnDef="tagPatrimonio">
          <th mat-header-cell *matHeaderCellDef>Nº Patrimônio</th>
          <td mat-cell *matCellDef="let element">{{ element.tagPatrimonio }}</td>
        </ng-container>

        <ng-container matColumnDef="acoes">
          <th mat-header-cell *matHeaderCellDef>Ações</th>
          <td mat-cell *matCellDef="let element">
            <button mat-icon-button (click)="editarAtivo(element)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="excluirAtivo(element)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        <tr *ngIf="dataSource.length === 0" class="mat-row">
          <td class="mat-cell" [attr.colspan]="displayedColumns.length">Nenhum ativo encontrado</td>
        </tr>
      </table>
    </div>
  `,
})
export class AssetListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nome', 'tagPatrimonio', 'acoes'];

  dataSource: Asset[] = [];

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadAssets();
  }

  loadAssets(): void {
    this.authService.listarAtivos().subscribe(dados => {
      this.dataSource = dados.content; // Acessa a lista dentro do objeto paginado
      this.cdr.detectChanges(); // Força o Angular a desenhar a tabela agora
    });
  }

  openFormDialog(asset?: Asset): void {
    const dialogRef = this.dialog.open(AssetFormComponent, {
      width: '400px',
      data: asset || null // Para novo ativo ou edição
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadAssets(); // Recarrega a lista após salvar
      }
    });
  }

  editarAtivo(asset: Asset): void {
    this.openFormDialog(asset);
  }

  excluirAtivo(asset: Asset): void {
    if (confirm('Tem certeza que deseja excluir este ativo?')) {
      this.authService.excluirAtivo(asset.id).subscribe(() => {
        this.loadAssets(); // Recarrega a lista após excluir
      });
    }
  }
}
