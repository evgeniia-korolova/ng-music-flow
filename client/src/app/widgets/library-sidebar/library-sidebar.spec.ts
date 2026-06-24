import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrarySidebar } from './library-sidebar';

describe('LibrarySidebar', () => {
  let component: LibrarySidebar;
  let fixture: ComponentFixture<LibrarySidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibrarySidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(LibrarySidebar);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('playlists', []);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
