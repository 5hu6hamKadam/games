import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypingTutorComponent } from './typing-tutor.component';

describe('TypingTutorComponent', () => {
  let component: TypingTutorComponent;
  let fixture: ComponentFixture<TypingTutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypingTutorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypingTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
