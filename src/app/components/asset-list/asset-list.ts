import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-asset-list',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  template: `
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

        <ng-container matColumnDef="patrimonio">
          <th mat-header-cell *matHeaderCellDef>Nº Patrimônio</th>
          <td mat-cell *matCellDef="let element">{{ element.tag }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>
    </div>
  `,
})
export class AssetListComponent {
  displayedColumns: string[] = ['id', 'nome', 'patrimonio'];

  // Dados mockados para vermos a tabela "viva"
  dataSource = [
    { id: 1, nome: 'Dell Vostro 3520', tag: 'STI-00123' },
    { id: 2, nome: 'Monitor Samsung 24"', tag: 'STI-00456' },
    { id: 3, nome: 'Teclado Mecânico Logitech', tag: 'STI-00789' },
  ];
}
