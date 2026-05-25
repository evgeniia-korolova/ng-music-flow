import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavigationBar } from './navigation-bar';
import { Route } from '@angular/router';

describe('NavigationBar', () => {
  let component: NavigationBar;
  let fixture: ComponentFixture<NavigationBar>;

  const dummyRoutes: Route[] = [
    {
      path: '',
      children: [
        {
          path: 'discover',
          title: 'Discover',
          data: { displayOnNavbar: true },
          children: [
            { path: '', redirectTo: 'popular', pathMatch: 'full' },
            {
              path: 'popular',
              title: 'Popular Tracks',
              data: { order: 'popularity_total', pageTitle: 'Popular Tracks' },
            },
            {
              path: 'new',
              title: 'New Releases',
              data: { order: 'releasedate_desc', pageTitle: 'New Releases' },
            },
            {
              path: 'genres',
              title: 'Genres',
            },
          ],
        },
        {
          path: 'artists',
          title: 'Artists',
          data: { displayOnNavbar: true },
        },
        {
          path: '',
          redirectTo: 'discover',
          pathMatch: 'full',
        },
      ],
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationBar],
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationBar);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('pathCollection', dummyRoutes);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
