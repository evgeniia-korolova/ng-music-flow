import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryLayout } from './secondary-layout';

describe('SecondaryLayout', () => {
  let component: SecondaryLayout;
  let fixture: ComponentFixture<SecondaryLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondaryLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(SecondaryLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
