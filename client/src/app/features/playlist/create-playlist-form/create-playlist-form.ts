import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LibraryPlaylistTrack } from '../../../entities/track/model/track.model';
import { Button } from '../../../shared/ui/button/button';
import { Icon } from '../../../shared/ui/icon/icon.component';
import { TracksStore } from '../../../entities/track/model/track.store';
import { Router } from '@angular/router';
import { PlaylistsStore } from '../../../entities/playlist/model/playlists.store';
import { Location } from '@angular/common';

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
  private readonly location = inject(Location);
  readonly selectedTracks = signal<LibraryPlaylistTrack[]>([]);
  readonly cancelForm = output<void>();

  public readonly playlistId = input<string>();
  public readonly isEditMode = computed(() => !!this.playlistId());

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

    if (this.isEditMode()) {
      const currentPlaylist = this.playlistsStore
        .playlists()
        .find((p) => p.id === this.playlistId());

      if (currentPlaylist) {
        this.playlistForm.setValue({
          name: currentPlaylist.name,
          description: currentPlaylist.description || '',
        });
        this.selectedTracks.set(currentPlaylist.tracks);
      }
    }
  }

  onSubmit() {
    if (this.playlistForm.invalid || this.selectedTracks().length === 0) return;
    const formValues = this.playlistForm.getRawValue();
    const id = this.playlistId();

    // const cleanTracksPayload = this.selectedTracks().map((track, index) => ({
    //   trackId: track.id,
    //   origin: track.origin ?? 'JAMENDO',
    //   order: index + 1,
    // }));

    if (this.isEditMode() && id) {
      const updatePayload = {
        name: formValues.name ?? '',
        description: formValues.description ?? '',
        tracks: this.selectedTracks(),
      };

      console.log('Sending secure payload to backend:', updatePayload);

      this.playlistsStore
        .updatePlaylist(id, updatePayload)
        .then(() => {
          this.playlistForm.reset();
          this.selectedTracks.set([]);
          void this.router.navigate(['/library/playlists', id]);
        })
        .catch((err) => console.error('Failed to update playlist:', err));
    } else {
      const createPayload = {
        name: formValues.name ?? '',
        description: formValues.description ?? '',
        tracks: this.selectedTracks(),
      };

      this.playlistsStore
        .createPlaylist(createPayload)
        .then(() => {
          const updatedLists = this.playlistsStore.playlists();
          const freshPlaylist = updatedLists[0];

          this.playlistForm.reset();
          this.selectedTracks.set([]);

          if (freshPlaylist && freshPlaylist.id) {
            void this.router.navigate(['/library/playlists', freshPlaylist.id]);
          } else {
            this.navigateToPreviousOrFallback();
          }
        })
        .catch((err) => console.error('failed to create playlist:', err));
    }
  }

  private navigateToPreviousOrFallback(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      void this.router.navigate(['/library/custom-tracks']);
    }
  }

  closeForm(): void {
    this.navigateToPreviousOrFallback();
  }

  onAddJamendoTrack(trackId: string) {
    const foundedTrack = this.tracksStore.tracks().find((track) => track.id === trackId);

    if (foundedTrack) {
      const alreadyAdded = this.selectedTracks().some((t) => t.id === trackId);
      if (alreadyAdded) return;

      this.selectedTracks.update((tracks) => [
        ...tracks,
        {
          ...foundedTrack,
          origin: 'JAMENDO',
          order: tracks.length + 1,
        },
      ]);
    }
  }

  removeTrack(trackId: string) {
    this.selectedTracks.update((tracks) => tracks.filter((track) => track.id !== trackId));
  }
}
