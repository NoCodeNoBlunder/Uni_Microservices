import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliverOrdersComponent } from './deliver-orders.component';

describe('DeliverOrdersComponent', () => {
  let component: DeliverOrdersComponent;
  let fixture: ComponentFixture<DeliverOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliverOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliverOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
