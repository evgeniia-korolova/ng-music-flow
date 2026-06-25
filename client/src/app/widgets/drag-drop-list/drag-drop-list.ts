import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Track } from '../../entities/track/model/track.model';
import { TrackCard } from '../../entities/track/ui/track-card/track-card';
import { ResponsiveService } from '../../shared/services/responsive-service/responsive-service';

@Component({
  selector: 'app-drag-drop-list',
  imports: [CdkDropList, CdkDrag, TrackCard],
  templateUrl: './drag-drop-list.html',
  styleUrl: './drag-drop-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DragDropList {
  private screen = inject(ResponsiveService);
  public readonly tracks = input.required<Track[]>();
  public readonly orderChanged = output<Track[]>();

  public readonly viewMode = signal<'tabs' | 'search' | 'slider'>('search');

  public readonly showWave = computed<boolean>(() => {
    if (this.screen.isLarge()) return true;
    return false;
  });

  public readonly itemTemplate =
    contentChild<TemplateRef<{ $implicit: Track; index: number }>>('itemTemplate');

  public readonly currentTracks = linkedSignal<Track[], Track[]>({
    source: () => this.tracks(),
    computation: (source) => [...source],
  });

  public readonly isOrderChanged = computed<boolean>(() => {
    const originalIds = this.tracks().map((t) => t.id);
    const currentIds = this.currentTracks().map((t) => t.id);
    return JSON.stringify(originalIds) !== JSON.stringify(currentIds);
  });

  public drop(event: CdkDragDrop<Track[]>): void {
    const updatedArray = [...this.currentTracks()];
    moveItemInArray(updatedArray, event.previousIndex, event.currentIndex);
    this.currentTracks.set(updatedArray);
  }

  public onSaveOrder(): void {
    this.orderChanged.emit(this.currentTracks());
  }
}
