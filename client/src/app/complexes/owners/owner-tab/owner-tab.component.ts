import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OwnerEditComponent } from "../owner-edit/owner-edit.component";
import { OwnerService } from '../../../_services/owner.service';
import { Owner } from '../../../_models/owner';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component'; // Adjust path

@Component({
  selector: 'app-owner-tab',
  standalone: true,
  imports: [MatCardModule, MatTableModule, CommonModule, MatIconModule, OwnerEditComponent, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './owner-tab.component.html',
  styleUrl: './owner-tab.component.css'
})
export class OwnerTabComponent implements AfterViewInit {
  constructor(private dialog: MatDialog) { }

  @ViewChild('childComponent') childOwnerEditComponent!: OwnerEditComponent;
  private ownerService = inject(OwnerService)
  displayedColumns: string[] = ['fullname', 'idnumber', 'email', 'cellphone', 'actions'];

  dataSource: Owner[] = [];

  selectedId: number = 0;
  showChildComponent: boolean = false;

  selectedUnitId: string = '0';
  ngAfterViewInit(): void {

  }
  // Example functions for button actions
  editRow(row: any): void {
    this.selectedId = row.ownerId;
    if (this.childOwnerEditComponent) {
      this.showChildComponent = row.ownerId > 0;
      this.childOwnerEditComponent.getOwnerByOwnerId(this.selectedId);
    }

  }

  deleteRow(row: any): void {
    this.selectedId = row.ownerId;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this item?' },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User confirmed deletion, implement your delete logic here
        console.log('selected', this.selectedId);
        this.ownerService.deleteOwnerByOwnerId(this.selectedId).subscribe(
          () => {
            console.log('Item deleted successfully!');
            // Perform actions after successful deletion
            this.getUnitOwners();
          },
          (error) => {
            console.error('Error deleting item:', error);
            // Handle error
          }
        );

      }
    });
  }



  getUnitOwners() {

    this.ownerService.getUnitOwners(1).subscribe(data => {
      this.dataSource = data
      console.log('Num Item:', this.dataSource.length);

    });


  }

  handleUnitChanged(selectedId: string) {
    this.selectedUnitId = selectedId;
    this.getUnitOwners();
  }

}
