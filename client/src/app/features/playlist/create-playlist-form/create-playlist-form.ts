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
import { LibraryPlaylistTrack, Track } from '../../../entities/track/model/track.model';
import { Button } from '../../../shared/ui/button/button';
import { Icon } from '../../../shared/ui/icon/icon.component';
import { TracksStore } from '../../../entities/track/model/track.store';
import { Router } from '@angular/router';
import { PlaylistsStore } from '../../../entities/playlist/model/playlists.store';
import { FormNavigationService } from '../../../shared/services/form-navigation-service/form-navigation-service';
import { FormError } from '../../../shared/ui/form-error/form-error';
import { TrackApiService } from '../../../entities/track/api/track-api-service';
// import { Location } from '@angular/common';

@Component({
  selector: 'app-create-playlist-form',
  imports: [ReactiveFormsModule, Button, Icon, FormError],
  providers: [TracksStore],
  templateUrl: './create-playlist-form.html',
  styleUrl: './create-playlist-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePlaylistForm implements OnInit {
  readonly tracksStore = inject(TracksStore);
  readonly playlistsStore = inject(PlaylistsStore);
  private readonly router = inject(Router);
  // private readonly location = inject(Location);
  private readonly formNavigateService = inject(FormNavigationService);
  private trackApiService = inject(TrackApiService);
  readonly selectedTracks = signal<LibraryPlaylistTrack[]>([]);
  readonly cancelForm = output<void>();
  readonly customTracks = signal<Track[]>([]);
  readonly duplicateError = signal<string | null>(null);

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
    this.trackApiService.getUserTracks().subscribe({
      next: (response) => {
        this.customTracks.set(response.data.tracks);
      },
      error: (err) => console.error('Failed to load custom tracks', err),
    });
  }

  onSubmit() {
    if (this.playlistForm.invalid || this.selectedTracks().length === 0) return;
    const formValues = this.playlistForm.getRawValue();
    const id = this.playlistId();

    if (this.isEditMode() && id) {
      const updatePayload = {
        name: formValues.name ?? '',
        description: formValues.description ?? '',
        tracks: this.selectedTracks(),
      };

      this.playlistsStore.updatePlaylist({
        playlistId: id,
        playlistData: updatePayload,
        onSuccess: () => {
          console.log('Playlist successfully updated! Navigating back...');

          this.playlistForm.reset();
          this.selectedTracks.set([]);
          void this.router.navigate(['/library/playlists', id]);
        },
        onError: (err: unknown) => console.error('Failed to update playlist in form:', err),
      });
    } else {
      const createPayload = {
        name: formValues.name ?? '',
        description: formValues.description ?? '',
        tracks: this.selectedTracks(),
      };

      this.playlistsStore.createPlaylist({
        playlistData: createPayload,
        onSuccess: () => {
          this.playlistForm.reset();
          this.selectedTracks.set([]);
          const freshPlaylist = this.playlistsStore.playlists()[0];

          this.playlistsStore.loadPlaylists();

          if (freshPlaylist && freshPlaylist.id) {
            console.log('Redirecting to the exact newly created playlist ID:', freshPlaylist.id);
          } else {
            // this.navigateToPreviousOrFallback();
            this.formNavigateService.goBackOrFallback('/library/custom-tracks');
          }
        },
        onError: (err) => console.error('failed to create playlist:', err),
      });
    }
  }

  // private navigateToPreviousOrFallback(): void {
  //   if (window.history.length > 1) {
  //     this.location.back();
  //   } else {
  //     void this.router.navigate(['/library/custom-tracks']);
  //   }
  // }

  closeForm(): void {
    this.formNavigateService.goBackOrFallback('/library/custom-tracks');
  }

  onAddJamendoTrack(trackId: string) {
    const foundedTrack = this.tracksStore.tracks().find((track) => track.id === trackId);

    if (foundedTrack) {
      const alreadyAdded = this.selectedTracks().some((t) => t.id === trackId);
      if (alreadyAdded) {
        this.duplicateError.set('This track is already added');
        return;
      }
      this.duplicateError.set(null);
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
  onAddCustomTrack(trackId: string) {
    const foundedTrack = this.customTracks().find((track) => track.id === trackId);
    console.log(foundedTrack);
    if (foundedTrack) {
      const alreadyAdded = this.selectedTracks().some((track) => track.id === trackId);
      if (alreadyAdded) {
        this.duplicateError.set('This track is already added');
        return;
      }
      this.duplicateError.set(null);
      this.selectedTracks.update((tracks) => [
        ...tracks,
        {
          ...foundedTrack,
          // coverUrl: '/images/track-placeholder.jpg',
          origin: 'LOCAL',
          order: tracks.length + 1,
        },
      ]);
    }
  }
  removeTrack(trackId: string) {
    this.selectedTracks.update((tracks) => tracks.filter((track) => track.id !== trackId));
  }
}
