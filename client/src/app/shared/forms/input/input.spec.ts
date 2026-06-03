import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import { Input } from './input';

@Component({
  standalone: true,
  imports: [Input],
  template: `<app-input [field]="testForm.value" />`,
})
class TestHostComponent {
  model = signal({ value: '' });
  testForm = form(this.model);
}

describe('Input', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, Input],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
