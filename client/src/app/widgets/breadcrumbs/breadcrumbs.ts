import { Component, inject } from '@angular/core';
import { BreadcrumbsService } from '../../shared/services/breadcrumbs/breadcrumbs.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink],
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
})
export class Breadcrumbs {
  protected readonly currentBreadcrumbs = inject(BreadcrumbsService);
}
