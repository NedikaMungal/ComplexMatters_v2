import { ChangeDetectionStrategy, Component, Inject, inject, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UnitService } from '../../../_services/unit.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Unit } from '../../../_models/unit';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ComplexListComponent } from '../complex-list/complex-list.component';
import { OwnerListComponent } from '../owner-list/owner-list.component';
import { MatDialogModule } from '@angular/material/dialog'
import { MatBadgeModule } from '@angular/material/badge';
import { UnitInfoComponent } from '../unit-info/unit-info.component';
import { Complex } from '../../../_models/complex';
import { ComplexInfoHoverComponent } from '../complex-info-hover/complex-info-hover.component';
import { InfoDialogComponent } from '../../../common/info-dialog/info-dialog.component';

@Component({
  selector: 'app-unit-list',
  standalone: true,
  imports: [MatCardModule, MatBadgeModule, MatTableModule, MatIconModule, MatButtonModule,
    MatMenuModule, MatFormFieldModule, MatInputModule, MatPaginator, MatSortModule,
    MatTooltipModule],
  templateUrl: './unit-list.component.html',
  styleUrl: './unit-list.component.css'
})
export class UnitListComponent {

  private unitService = inject(UnitService);
  displayedColumns: string[] = ['unitnumber', 'unittype', 'actions'];
  dataSource = new MatTableDataSource<Unit>();
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
 
  constructor(private dialog: MatDialog,
    public dialogComplexListRef: MatDialogRef<ComplexListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
 
    this.getUnitsByComplexId();
  }



  getUnitsByComplexId() {
    this.unitService.getUnitsByComplexId(this.data.complexId).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  addItem(): void {
    const dialogAddUnit = this.dialog.open(UnitInfoComponent, {
     width: '1000px',
     disableClose: true,
     data: { unitId: 0,
             complex: this.data.complex,
      },
   });

   dialogAddUnit.afterClosed().subscribe(result => {
   if (result)
      { 
         this.getUnitsByComplexId();
      }
   });
  }

  editItem(item: any): void {
    const dialogEditUnit = this.dialog.open(UnitInfoComponent, {
      width: '1000px',
      disableClose: true,
      data: {
        unitId: item.unitId,
        complex: this.data.complex
      },
    });

      dialogEditUnit.afterClosed().subscribe(result => {
      if (result)
      { 
         this.getUnitsByComplexId();
      }
    });
     //need to return a result and based on that result decide whether or not to refresh
  }
  deleteItem(item: any): void {
    /*
    const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this item?' },
    });
    dialogConfirm.afterClosed().subscribe(result => {
      if (result) {
        // User confirmed deletion, implement your delete logic here
        this.unitService.delete((item.unitId).subscribe(
          () => {

            const dialogInfo = this.dialog.open(InfoDialogComponent, {
              width: '250px',
              data: { message: 'Complex has been successfully deleted.' },
            });
            this.getUnitsByComplexId();
          },
          (error: any) => {
            console.error('Error deleting item:', error);
            // Handle error
          }
        );

      }
    });*/
  }

  viewOwners(item: any): void {
    const dialogOwnerList = this.dialog.open(OwnerListComponent, {
      width: '1000px',
      disableClose: true,
      data: { unitId: item.unitId },
    });

    dialogOwnerList.afterClosed().subscribe(result => {
      if (result){ 
        this.getUnitsByComplexId();
      }
    });

  }

  openDialogComplexInfoHover()
  {
      this.dialog.open(ComplexInfoHoverComponent, {
      width: '350px',
      height: '400px',
      data: {
      complex: this.data.complex
      },
    });
  }

  cancel(): void {

    this.dialogComplexListRef.close(true);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();

    }
  }





}