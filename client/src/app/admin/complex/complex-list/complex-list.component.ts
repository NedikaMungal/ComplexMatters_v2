import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { Complex } from '../../../_models/complex';
import { ComplexService } from '../../../_services/complex.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { ComplexInfoComponent } from '../complex-info/complex-info.component';
import { UnitListComponent } from '../unit-list/unit-list.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgClass } from '@angular/common';
import { MatBadgeModule } from '@angular/material/badge';
import { ConfirmDialogComponent } from '../../../common/confirm-dialog/confirm-dialog.component';
import { InfoDialogComponent } from '../../../common/info-dialog/info-dialog.component';

@Component({
  selector: 'app-complex-list',
  standalone: true,
  imports: [NgClass, MatTooltipModule, MatBadgeModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatMenuModule, MatFormFieldModule, MatInputModule, MatPaginator, MatSortModule],
  templateUrl: './complex-list.component.html',
  styleUrl: './complex-list.component.css'
})

export class ComplexListComponent implements AfterViewInit {
  private complexService = inject(ComplexService);
  //dataSource: Complex[] = [];
  displayedColumns: string[] = ['name', 'addressline1', 'actions'];
  dataSource = new MatTableDataSource<Complex>();
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;

  selectedId: number = 1;


  constructor(private dialog: MatDialog) { }

  ngAfterViewInit(): void {
    this.getComplexes();
  }



  getComplexes() {
    this.complexService.getAllComplexes().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  addItem(): void {
    const dialogRef = this.dialog.open(ComplexInfoComponent, {
      width: '800px',
      disableClose: true,
      data: {
        complex: {},
        complexId: 0,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getComplexes();
      }
    });
    //need to return a result and based on that result decide whether or not to refresh.
  }

  editItem(item: any): void {
    this.selectedId = item.complexId;
    const dialogRef = this.dialog.open(ComplexInfoComponent, {
      width: '800px',
      disableClose: true,
      data: {
        complex: item,
        complexId: item.complexId
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getComplexes();
      }
    });

  }
  deleteItem(item: any): void {
    const dialogConfirm = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this item?' },
    });
    dialogConfirm.afterClosed().subscribe(result => {
      if (result) {
        // User confirmed deletion, implement your delete logic here
        console.log('selected', item.complexId);
        this.complexService.deleteComplexByComplexId(item.complexId).subscribe(
          () => {

            const dialogInfo = this.dialog.open(InfoDialogComponent, {
              width: '250px',
              data: { message: 'Complex has been successfully deleted.' },
            });
            this.getComplexes();
          },
          (error: any) => {
            console.error('Error deleting item:', error);
            // Handle error
          }
        );

      }
    });
  }

  viewUnits(item: any): void {
    const dialogUnitList = this.dialog.open(UnitListComponent, {
      width: '1000px',
      disableClose: true,
      data: {
        complex: item,
        complexId: item.complexId
      },
    });

    dialogUnitList.afterClosed().subscribe(result => {
      if (result) {
        this.getComplexes();
      }
    });

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
