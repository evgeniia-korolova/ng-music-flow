import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { LibraryPlaylistTrack } from '../../entities/track/model/track.model';
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
  public readonly tracks = input.required<LibraryPlaylistTrack[]>();
  public readonly orderChanged = output<LibraryPlaylistTrack[]>();

  public readonly viewMode = signal<'tabs' | 'search' | 'slider'>('search');

  public readonly isEditMode = input<boolean>(false);

  public readonly showWave = linkedSignal<boolean>(() => this.screen.isLarge());

  public readonly currentTracks = linkedSignal<LibraryPlaylistTrack[], LibraryPlaylistTrack[]>({
    source: () => this.tracks(),
    computation: (source) => [...source],
  });

  public readonly isOrderChanged = computed<boolean>(() => {
    const originalIds = this.tracks().map((t) => t.id);
    const currentIds = this.currentTracks().map((t) => t.id);
    return JSON.stringify(originalIds) !== JSON.stringify(currentIds);
  });

  public drop(event: CdkDragDrop<LibraryPlaylistTrack[][]>): void {
    const updatedArray = [...this.currentTracks()];
    moveItemInArray(updatedArray, event.previousIndex, event.currentIndex);

    const reorderedArray = updatedArray.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    this.currentTracks.set(reorderedArray);
    this.orderChanged.emit(reorderedArray);
  }

  public removeTrack(trackId: string): void {
    const filtered = this.currentTracks().filter((t) => t.id !== trackId);

    const reordered = filtered.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    this.currentTracks.set(reordered);
    this.orderChanged.emit(reordered);
  }
}
