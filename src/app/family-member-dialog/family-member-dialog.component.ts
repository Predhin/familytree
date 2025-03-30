import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-family-member-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, InputTextModule, ButtonModule, FileUploadModule, FormsModule],
  templateUrl: './family-member-dialog.component.html',
  styleUrls: ['./family-member-dialog.component.css']
})
export class FamilyMemberDialogComponent {
  @Input() visible = false;
  @Input() isEditing = false;
  @Input() form: any = { husband: '', wife: '', imageHusband: '', imageWife: '' };

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() submit = new EventEmitter<void>();
  @Output() imageUpload = new EventEmitter<{ event: any, isHusband: boolean }>();

  closeDialog() {
    this.visibleChange.emit(false);
  }

  onSubmit() {
    this.submit.emit();
  }

  onImageUpload(event: any, isHusband: boolean) {
    this.imageUpload.emit({ event, isHusband });
  }
}
