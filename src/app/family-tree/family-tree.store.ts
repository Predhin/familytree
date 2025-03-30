// src/app/store/family-tree.store.ts
import { signal, computed } from '@angular/core';

export interface FamilyMember {
  husband: string;
  wife: string;
  imageHusband?: string;
  imageWife?: string;
  children?: FamilyMemberNode[];
}

export interface FamilyMemberNode {
  data: FamilyMember;
  expanded?: boolean;
  children?: FamilyMemberNode[];
}

const initialTree: FamilyMemberNode = {
  data: {
    husband: 'Grandpa Joe',
    wife: 'Grandma Jane',
    imageHusband: '',
    imageWife: ''
  },
  expanded: true,
  children: [
    {
      data: {
        husband: 'Dad John',
        wife: 'Mom Emma',
        imageHusband: '',
        imageWife: ''
      },
      expanded: true,
      children: [
        {
          data: {
            husband: 'David',
            wife: 'Sophia',
            imageHusband: '',
            imageWife: ''
          }
        }
      ]
    }
  ]
};

const treeSignal = signal<FamilyMemberNode>(structuredClone(initialTree));

export const familyTree = computed(() => [treeSignal()]);

export const familyTreeStore = {
  getTree: familyTree,
  addChild(parent: FamilyMemberNode, child: FamilyMemberNode) {
    parent.children = parent.children ?? [];
    parent.children.push(child);
    treeSignal.set({ ...treeSignal() }); // Trigger update
  },
  updateNode(node: FamilyMemberNode, updated: Partial<FamilyMember>) {
    Object.assign(node.data, updated);
    treeSignal.set({ ...treeSignal() }); // Trigger update
  },
  moveNode(fromParent: FamilyMemberNode, toParent: FamilyMemberNode, movedNode: FamilyMemberNode) {
    if (!fromParent.children) return;

    fromParent.children = fromParent.children.filter(n => n !== movedNode);
    toParent.children = toParent.children ?? [];
    toParent.children.push(movedNode);
    treeSignal.set({ ...treeSignal() });
  }
};
