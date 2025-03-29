import { Component } from '@angular/core';
import { familyTreeStore, FamilyMemberNode } from './family-tree.store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganizationChartModule } from 'primeng/organizationchart';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';

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
    FileUploadModule
  ]
})
export class FamilyTreeComponent {
  familyTree = familyTreeStore.getTree;

  displayDialog = false;
  isEditing = false;
  selectedNode: FamilyMemberNode | null = null;
  editForm: any = {
    husband: '',
    wife: '',
    imageHusband: '',
    imageWife: ''
  };

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
          imageHusband: this.editForm.imageHusband || 'assets/male.png',
          imageWife: this.editForm.imageWife || 'assets/female.png'
        }
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
