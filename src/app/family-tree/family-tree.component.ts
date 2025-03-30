import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { familyTreeStore, FamilyMemberNode } from './family-tree.store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FamilyMemberDialogComponent } from '../family-member-dialog/family-member-dialog.component';

@Component({
  selector: 'app-family-tree',
  templateUrl: './family-tree.component.html',
  styleUrls: ['./family-tree.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    OrganizationChartModule,
    DialogModule,
    ButtonModule,
    FileUploadModule,
    TooltipModule,
    FamilyMemberDialogComponent,
  ],
})
export class FamilyTreeComponent {
  @ViewChild('treeContainer') treeContainerRef!: ElementRef;
  familyTree = familyTreeStore.getTree;

  displayDialog = false;
  isExporting = false;
  isEditing = false;
  selectedNode: FamilyMemberNode | null = null;
  editForm: any = {
    husband: '',
    wife: '',
    imageHusband: '',
    imageWife: '',
  };

  exportTreeAsImage() {
    this.isExporting = true;
    setTimeout(() => {
      const element = this.treeContainerRef.nativeElement;
      html2canvas(element, {
        scale: window.devicePixelRatio * 2, // higher than 2x or 3x
        useCORS: true,
      }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'family-tree.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        this.isExporting = false;
      });
    }, 0); // Ensure the DOM is updated before capturing
  }

  exportTreeAsPDF() {
    this.isExporting = true;
    setTimeout(() => {
      const element = this.treeContainerRef.nativeElement;
      html2canvas(element, {
        scale: window.devicePixelRatio * 2, // higher than 2x or 3x
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'pt', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('family-tree.pdf');
        this.isExporting = false;
      });
    }, 0); // Ensure the DOM is updated before capturing
  }

  openAddDialog() {
    this.resetForm();
    this.displayDialog = true;
    this.isEditing = false;
  }

  onNodeSelect(event: any) {
    this.selectedNode = event.node;
    this.editForm = { ...this.selectedNode!.data };
    this.isEditing = true;
    this.displayDialog = true;
  }

  saveMember() {
    if (this.selectedNode) {
      familyTreeStore.updateNode(this.selectedNode, this.editForm);
    }
    this.displayDialog = false;
    this.resetForm();
  }

  addNewMember() {
    if (this.selectedNode) {
      const newMember: FamilyMemberNode = {
        data: {
          ...this.editForm,
          imageHusband: this.editForm.imageHusband,
          imageWife: this.editForm.imageWife,
        },
      };
      familyTreeStore.addChild(this.selectedNode, newMember);
    }
    this.displayDialog = false;
    this.resetForm();
  }

  resetForm() {
    this.selectedNode = null;
    this.editForm = { husband: '', wife: '', imageHusband: '', imageWife: '' };
    this.isEditing = false;
  }

  onNodeDrop(event: any) {
    const movedNode = event.dragNode;
    const fromParent = event.dragNodeParent;
    const toParent = event.dropNode;

    if (movedNode && toParent && fromParent) {
      familyTreeStore.moveNode(fromParent, toParent, movedNode);
    }
  }

  onDialogVisibilityChanged(isVisible: boolean) {
    this.displayDialog = isVisible;
  
    if (!isVisible) {
      console.log('Dialog closed');
      this.selectedNode = null;
    }
  }

  onImageUpload(event: any, isHusband: boolean) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      if (isHusband) {
        this.editForm.imageHusband = reader.result as string;
      } else {
        this.editForm.imageWife = reader.result as string;
      }
    };
    reader.readAsDataURL(file);
  }
}
