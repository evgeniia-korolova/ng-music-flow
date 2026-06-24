import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Track } from '../../../entities/track/model/track.model';
import { Button } from '../../../shared/ui/button/button';
import { Icon } from '../../../shared/ui/icon/icon.component';
import { TracksStore } from '../../../entities/track/model/track.store';
import { LibraryTrackList } from '../../../entities/playlist/model/playlist.model';

@Component({
  selector: 'app-create-playlist-form',
  imports: [ReactiveFormsModule, Button, Icon],
  providers: [TracksStore],
  templateUrl: './create-playlist-form.html',
  styleUrl: './create-playlist-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePlaylistForm implements OnInit {
  readonly tracksStore = inject(TracksStore);
  readonly selectedTracks = signal<Track[]>([]);
  readonly cancelForm = output<void>();
  readonly savedPlayList = output<LibraryTrackList>();
  playlistForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    description: new FormControl(''),
  });
  ngOnInit(): void {
    this.tracksStore.loadTracks({
      order: 'popularity_total',
      limit: 20,
    });
  }
  onSubmit() {
    const id = Date.now().toString();
    const title = this.playlistForm.value.title ?? '';
    const descr = this.playlistForm.value.description ?? '';
    const tracksList = this.selectedTracks();

    this.savedPlayList.emit({ id, title, descr, tracksList });
    this.playlistForm.reset();
    this.selectedTracks.set([]);
    this.closeForm();
  }
  closeForm() {
    this.cancelForm.emit();
  }
  onAddTrack(trackId: string) {
    const foundedTrack = this.tracksStore.tracks().find((track) => track.id === trackId);
    if (foundedTrack) {
      this.selectedTracks.update((tracks) => [...tracks, foundedTrack]);
      console.log(foundedTrack);
    }
  }
  removeTrack(trackId: string) {
    this.selectedTracks.update((tracks) => tracks.filter((track) => track.id !== trackId));
  }
}
