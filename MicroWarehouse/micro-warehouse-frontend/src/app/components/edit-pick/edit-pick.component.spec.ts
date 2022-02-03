import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPickComponent } from './edit-pick.component';

describe('EditPickComponent', () => {
  let component: EditPickComponent;
  let fixture: ComponentFixture<EditPickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPickComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
