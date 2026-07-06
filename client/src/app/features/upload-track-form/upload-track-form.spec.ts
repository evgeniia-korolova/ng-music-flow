import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadTrackForm } from './upload-track-form';

describe('UploadTrackForm', () => {
  let component: UploadTrackForm;
  let fixture: ComponentFixture<UploadTrackForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadTrackForm],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadTrackForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
