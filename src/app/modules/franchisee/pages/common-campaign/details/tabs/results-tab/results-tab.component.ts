import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { Router, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CommomTableComponent, TableColumn } from "../../../../../../shared/components/commom-table/commom-table.component";


export interface ResultData {
  id: string
  name: string
  status: string
  conversion: string
}

@Component({
  selector: 'app-results-tab',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    CommomTableComponent
  ],
  templateUrl: './results-tab.component.html',
  styleUrl: './results-tab.component.scss'
})
export class ResultsTabComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  public data = signal<any[]>([]);

  public displayedColumns: TableColumn[] = [
    { label: 'ID', key: 'id', type: 'text' },
    { label: 'Nome', key: 'name', type: 'text' },
    { label: 'Status de envio', key: 'sendStatus', type: 'text' },
    { label: 'Conversões', key: 'convertions', type: 'text' },
  ];

  ngOnInit() {
    this.getResults();
  }

  private getResults(search?: string) {
    let data: any[] = [];
    
    for(let i = 0; i < 10; i++) {
      data.push({
        id: i,
        name: 'Anderson',
        sendStatus: i % 2 === 0 ? 'Enviado' : 'Recebido',
        convertions: i % 2 === 0 ? 'Sim' : 'Não',
      })
    }

    this.data.set(data);
  }

  public gotoDetailPage(row: any) {
    this.router.navigate([row.id], { relativeTo: this.activatedRoute });
  }

  gotoEditPage(row: any) {
    this.router.navigate(['/admin/clients/edit', row.id])
  }

  deleteRow(row: any) {
    const deleteUser = confirm('Deseja deletar esse usuário?');
    
    if (deleteUser) {
      this.toastr.success('Cliente excluído com sucesso!')
    }
  }
}
