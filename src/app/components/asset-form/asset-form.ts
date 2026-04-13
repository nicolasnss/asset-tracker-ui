import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, Funcionario } from '../../services/auth';

interface Asset {
  id?: number;
  nome: string;
  tagPatrimonio: string;
  tipo: string;
  status: string;
  descricao: string;
  funcionarioId?: number;
}

@Component({
  selector: 'app-asset-form',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data ? 'Editar Ativo' : 'Novo Ativo' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="assetForm" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="fill">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="nome" required>
          <mat-error *ngIf="assetForm.get('nome')?.invalid && assetForm.get('nome')?.touched">
            Nome é obrigatório
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Tag de Patrimônio</mat-label>
          <input matInput formControlName="tagPatrimonio" required>
          <mat-error *ngIf="assetForm.get('tagPatrimonio')?.invalid && assetForm.get('tagPatrimonio')?.touched">
            Tag de Patrimônio é obrigatória
          </mat-error>
          <mat-error *ngIf="assetForm.get('tagPatrimonio')?.hasError('duplicate')">
            Tag de Patrimônio já existe
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Tipo</mat-label>
          <mat-select formControlName="tipo" required>
            <mat-option value="LAPTOP">LAPTOP</mat-option>
            <mat-option value="MONITOR">MONITOR</mat-option>
            <mat-option value="DESKTOP">DESKTOP</mat-option>
            <mat-option value="TABLET">TABLET</mat-option>
            <mat-option value="OUTROS">OUTROS</mat-option>
          </mat-select>
          <mat-error *ngIf="assetForm.get('tipo')?.invalid && assetForm.get('tipo')?.touched">
            Tipo é obrigatório
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status" required>
            <mat-option value="DISPONIVEL">DISPONÍVEL</mat-option>
            <mat-option value="EM_USO">EM USO</mat-option>
            <mat-option value="MANUTENCAO">MANUTENÇÃO</mat-option>
          </mat-select>
          <mat-error *ngIf="assetForm.get('status')?.invalid && assetForm.get('status')?.touched">
            Status é obrigatório
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Responsável</mat-label>
          <mat-select formControlName="funcionarioId" required>
            <mat-option *ngFor="let funcionario of funcionarios" [value]="funcionario.id">
              {{ funcionario.nome }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="assetForm.get('funcionarioId')?.invalid && assetForm.get('funcionarioId')?.touched">
            Responsável é obrigatório
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Descrição</mat-label>
          <textarea matInput formControlName="descricao" rows="3"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="assetForm.invalid">Salvar</button>
    </mat-dialog-actions>
  `,
})
export class AssetFormComponent implements OnInit {
  assetForm: FormGroup;
  funcionarios: Funcionario[] = [];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<AssetFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Asset | null
  ) {
    this.assetForm = this.fb.group({
      nome: [data?.nome || '', Validators.required],
      tagPatrimonio: [data?.tagPatrimonio || '', Validators.required],
      tipo: [data?.tipo || '', Validators.required],
      status: [data?.status || '', Validators.required],
      descricao: [data?.descricao || ''],
      funcionarioId: [data?.funcionarioId || '', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadFuncionarios();
  }

  loadFuncionarios(): void {
    this.authService.getFuncionarios().subscribe({
      next: (funcionarios: Funcionario[]) => {
        this.funcionarios = funcionarios;
      },
      error: (erro: any) => {
        console.error('ERRO AO CARREGAR FUNCIONÁRIOS:', erro);
      }
    });
  }

  onSubmit() {
    if (this.assetForm.valid) {
      const asset = this.assetForm.value;
      if (this.data?.id) {
        // Editar
        this.authService.atualizarAtivo(this.data.id, asset).subscribe({
          next: () => {
            this.snackBar.open('Ativo atualizado com sucesso!', 'Fechar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (erro: any) => {
            if (erro.error?.message?.includes('Tag Duplicada')) {
              this.assetForm.get('tagPatrimonio')?.setErrors({ duplicate: true });
            } else {
              console.error('Erro ao atualizar ativo:', erro);
            }
          }
        });
      } else {
        // Criar
        this.authService.salvarAtivo(asset).subscribe({
          next: () => {
            this.snackBar.open('Ativo vinculado com sucesso!', 'Fechar', { duration: 3000 });
            this.dialogRef.close(true);
          },
          error: (erro: any) => {
            if (erro.error?.message?.includes('Tag Duplicada')) {
              this.assetForm.get('tagPatrimonio')?.setErrors({ duplicate: true });
            } else {
              console.error('Erro ao salvar ativo:', erro);
            }
          }
        });
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
