import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistsList } from './artists-list';

describe('ArtistsList', () => {
  let component: ArtistsList;
  let fixture: ComponentFixture<ArtistsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistsList],
    }).compileComponents();

    fixture = TestBed.createComponent(ArtistsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
