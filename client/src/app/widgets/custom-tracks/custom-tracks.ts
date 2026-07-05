import { Component, inject, OnInit, signal } from '@angular/core';
import { TrackApiService } from '../../entities/track/api/track-api-service';
import { Track } from '../../entities/track/model/track.model';
import { TrackCard } from '../../entities/track/ui/track-card/track-card';
import { Icon } from '../../shared/ui/icon/icon.component';
import { Button } from '../../shared/ui/button/button';

@Component({
  selector: 'app-custom-tracks',
  imports: [TrackCard, Icon, Button],
  templateUrl: './custom-tracks.html',
  styleUrl: './custom-tracks.scss',
})
export class CustomTracks implements OnInit {
  readonly tracksApiService = inject(TrackApiService);

  readonly tracks = signal<Track[]>([]);
  readonly isEditing = signal(false);

  ngOnInit(): void {
    this.tracksApiService.getUserTracks().subscribe({
      next: (response) => {
        const mappedTracks = response.data.tracks.map((item) => {
          if (item.coverUrl === '') {
            item.coverUrl = '/images/track-placeholder.jpg';
          }
          return item;
        });
        this.tracks.set(mappedTracks);
      },
      error: (err) => {
        console.error('Error loading tracks:', err);
      },
    });
  }
  onDeleteTrack(id: string) {
    this.tracksApiService.deleteTrack(id).subscribe({
      next: () => {
        this.tracks.update((currentTracks) => currentTracks.filter((track) => track.id !== id));
      },
      error: (err) => {
        console.log('Error delete track', err);
      },
    });
  }
}
