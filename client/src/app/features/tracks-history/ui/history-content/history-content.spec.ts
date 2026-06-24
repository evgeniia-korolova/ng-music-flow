import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryContent } from './history-content';

describe('HistoryContent', () => {
  let component: HistoryContent;
  let fixture: ComponentFixture<HistoryContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryContent],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoryContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
