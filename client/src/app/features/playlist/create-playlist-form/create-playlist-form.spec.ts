import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlaylistForm } from './create-playlist-form';

describe('CreatePlaylistForm', () => {
  let component: CreatePlaylistForm;
  let fixture: ComponentFixture<CreatePlaylistForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePlaylistForm],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePlaylistForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
