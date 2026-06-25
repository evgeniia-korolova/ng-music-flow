import { ChangeDetectionStrategy, Component, inject, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Track } from '../../../entities/track/model/track.model';
import { Button } from '../../../shared/ui/button/button';
import { Icon } from '../../../shared/ui/icon/icon.component';
import { TracksStore } from '../../../entities/track/model/track.store';
import { LibraryPlaylist } from '../../../entities/playlist/model/playlist.model';
import { Router } from '@angular/router';
import { PlaylistsStore } from '../../../pages/library/model/playlists.store';

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
  readonly playlistsStore = inject(PlaylistsStore);
  private readonly router = inject(Router);
  readonly selectedTracks = signal<Track[]>([]);
  readonly cancelForm = output<void>();
  readonly savedPlayList = output<LibraryPlaylist>();

  playlistForm = new FormGroup({
    name: new FormControl('', [
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

    this.playlistsStore.loadPlaylists();
  }

  onSubmit() {
    if (this.playlistForm.invalid || this.selectedTracks().length === 0) return;

    const playlistPayload: LibraryPlaylist = {
      name: this.playlistForm.controls.name.value ?? '',
      description: this.playlistForm.controls.description.value ?? '',
      tracks: this.selectedTracks(),
    };

    // const name = this.playlistForm.value.name ?? '';
    // const description = this.playlistForm.value.description ?? '';
    // const tracks = this.selectedTracks();

    this.playlistsStore
      .createPlaylist(playlistPayload)
      .then(() => {
        console.log('Playlist created');
        this.router.navigate(['/library/custom-tracks']);
      })
      .catch((err) => console.error('Failed to save:', err));

    // this.savedPlayList.emit({ name, description, tracks });
    this.playlistForm.reset();
    this.selectedTracks.set([]);

    this.closeForm();
  }

  closeForm() {
    //this.cancelForm.emit();
    this.router.navigate(['/library/custom-tracks']);
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

  public onCancel(): void {
    this.router.navigate(['/library/custom-tracks']);
  }
}
