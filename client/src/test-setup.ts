import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { provideRouter } from '@angular/router';

setupTestBed({
  browserMode: false,
  providers: [provideRouter([])],
});
