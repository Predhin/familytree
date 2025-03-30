import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyMemberDialogComponent } from './family-member-dialog.component';

describe('FamilyMemberDialogComponent', () => {
  let component: FamilyMemberDialogComponent;
  let fixture: ComponentFixture<FamilyMemberDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyMemberDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyMemberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
