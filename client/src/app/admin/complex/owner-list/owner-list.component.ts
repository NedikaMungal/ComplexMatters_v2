import { Component, Inject, inject, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ComplexListComponent } from '../complex-list/complex-list.component';
import { OwnerService } from '../../../_services/owner.service';
import { Owner } from '../../../_models/owner';
import { OwnerInfoComponent } from '../owner-info/owner-info.component';
import { UnitListComponent } from '../unit-list/unit-list.component';
//import { OwnerListComponent } from '../owner-list/owner-list.component';

@Component({
  selector: 'app-owner-list',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule,
    MatMenuModule, MatFormFieldModule, MatInputModule, MatPaginator, MatSortModule,
    MatTooltipModule],
  templateUrl: './owner-list.component.html',
  styleUrl: './owner-list.component.css'
})
export class OwnerListComponent {

  private ownerService = inject(OwnerService);
  displayedColumns: string[] = ['fullname', 'idnumber', 'email', 'cellphone', 'actions'];
  dataSource = new MatTableDataSource<Owner>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  constructor(private dialog: MatDialog,
    public dialogUnitListRef: MatDialogRef<UnitListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.getOwnersByUnitId();
  }



  getOwnersByUnitId() {
    this.ownerService.getOwnersByUnitId(this.data.unitId).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  addItem(): void {
    const dialogAddOwner = this.dialog.open(OwnerInfoComponent, {
      width: '1000px',
      disableClose: true,
      data: {
        unitId: this.data.unitId,
        ownerId: 0,
        owner: this.data.owner,
      },
    });

    dialogAddOwner.afterClosed().subscribe(result => {
      if (result) {
           this.getOwnersByUnitId();
      }
    });
  }

  editItem(item: any): void {
    const dialogEditUnit = this.dialog.open(OwnerInfoComponent, {
      width: '1000px',
      data: {
        unitId: this.data.unitId,
        ownerId: item.ownerId,
        owner: this.data.owner
      },
    });

    dialogEditUnit.afterClosed().subscribe(result => {
      if (result) {
        this.getOwnersByUnitId();
      }
    });
  }

  deleteItem(item: any): void {


  }



  cancel(): void {

    this.dialogUnitListRef.close(true);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();

    }
  }
}