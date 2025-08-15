import { DialogRef } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    MatCardModule,
    MatRadioModule,
    FormsModule,
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  public dialogRef = inject(DialogRef);

  visibleType: any = 'sms';

  onClose() {
    this.dialogRef.close()
  }

}
