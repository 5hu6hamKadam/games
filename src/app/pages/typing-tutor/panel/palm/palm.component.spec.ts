import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PalmComponent } from './palm.component';

describe('PalmComponent', () => {
  let component: PalmComponent;
  let fixture: ComponentFixture<PalmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PalmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PalmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
