import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormNavigationService } from '../../shared/services/form-navigation-service/form-navigation-service';
import { FormError } from '../../shared/ui/form-error/form-error';
import { TrackApiService } from '../../entities/track/api/track-api-service';

@Component({
  selector: 'app-upload-track-form',
  imports: [Button, Icon, ReactiveFormsModule, FormError],
  templateUrl: './upload-track-form.html',
  styleUrl: './upload-track-form.scss',
})
export class UploadTrackForm {
  private readonly formNavigateService = inject(FormNavigationService);
  readonly trackApiService = inject(TrackApiService);

  readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  readonly error = signal('');

  uploadTrackForm = new FormGroup({
    title: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20),
    ]),
    artist: new FormControl('', [Validators.required]),
    genre: new FormControl('', [Validators.required]),
    file: new FormControl<File | null>(null, [Validators.required]),
  });
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadTrackForm.patchValue({
        file: input.files[0],
      });
    }
  }
  onSubmit() {
    if (this.uploadTrackForm.invalid) return;
    // console.log(this.uploadTrackForm.value.file);
    const formData = new FormData();
    formData.append('title', this.uploadTrackForm.value.title!);
    formData.append('artist', this.uploadTrackForm.value.artist!);
    formData.append('genre', this.uploadTrackForm.value.genre!);
    formData.append('file', this.uploadTrackForm.value.file!);

    this.trackApiService.uploadTrack(formData).subscribe({
      next: () => {
        this.closeForm();
      },
      error: ({ error: { error } }) => {
        if (error.code) {
          switch (error.code) {
            case 'FILEUPLOAD.TOO_LARGE':
            case 'FILEUPLOAD.INVALID_FORMAT': {
              this.resetFileInput();
              break;
            }
          }
        }

        this.error.set(error.message);
      },
    });
  }

  closeForm() {
    this.formNavigateService.goBackOrFallback('/library/custom-tracks');
  }

  private resetFileInput() {
    this.uploadTrackForm.controls.file.setValue(null);

    const inputEl = this.fileInput()?.nativeElement;
    if (inputEl) {
      inputEl.value = '';
    }
  }
}
