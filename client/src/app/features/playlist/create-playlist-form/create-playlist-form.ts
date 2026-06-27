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
import { Track } from '../../../entities/track/model/track.model';
import { Button } from '../../../shared/ui/button/button';
import { Icon } from '../../../shared/ui/icon/icon.component';
import { TracksStore } from '../../../entities/track/model/track.store';
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

    if (this.isEditMode()) {
      const playlistPayload = {
        name: formValues.name ?? '',
        description: formValues.description ?? '',
        tracks: this.selectedTracks(),
      };
      this.playlistsStore.updatePlaylist(this.playlistId(), playlistPayload).then(() => {
        this.playlistForm.reset();
        this.selectedTracks.set([]);
        void this.router.navigate(['/library/playlists', this.playlistId()]);
        this.closeForm();
      });
    } else {
      const playlistPayload = {
        name: formValues.name ?? '',
        description: formValues.description ?? '',
        tracks: this.selectedTracks(),
      };

      this.playlistsStore
        .createPlaylist(playlistPayload)
        .then(() => {
          const updatedLists = this.playlistsStore.playlists();
          const freshPlaylist = updatedLists[0];

          if (freshPlaylist && freshPlaylist.id) {
            console.log('New route:', freshPlaylist.id);

            this.playlistForm.reset();
            this.selectedTracks.set([]);

            void this.router.navigate(['/library/playlists', freshPlaylist.id]);
          } else {
            void this.router.navigate(['/library/custom-tracks']);
          }
        })
        .catch((err) => console.error('Ошибка создания:', err));
    }
  }

  closeForm(): void {
    // if (this.isEditMode()) {
    //   void this.router.navigate(['/library/playlists', this.playlistId()]);
    // } else {
    //   void this.router.navigate(['/library/custom-tracks']);
    // }
    this.router.navigate(['/library/playlists', this.playlistId()]);
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
