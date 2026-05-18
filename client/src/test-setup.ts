import '@angular/compiler';
import '@analogjs/vitest-angular/setup-snapshots';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { provideLucideIcons } from '@lucide/angular';
import { APP_ICONS } from './app/shared/constants/app.icons';

setupTestBed({
  browserMode: false,
  providers: [provideLucideIcons(...APP_ICONS)],
});
