import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  imports: [
    MatIconModule,
  ],
})
export class FileUploadComponent {
  fileUrl!: string | null;

  @Output() fileSelected = new EventEmitter<File>();

  imageSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.fileUrl = file.name;
      this.fileSelected.emit(event.target.files[0]);
    }
  }
}
