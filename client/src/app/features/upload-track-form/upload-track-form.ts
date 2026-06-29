import { Component, inject } from '@angular/core';
import { Button } from '../../shared/ui/button/button';
import { Icon } from '../../shared/ui/icon/icon.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormNavigationService } from '../../shared/services/form-navigation-service/form-navigation-service';
import { FormError } from '../../shared/ui/form-error/form-error';

@Component({
  selector: 'app-upload-track-form',
  imports: [Button, Icon, ReactiveFormsModule, FormError],
  templateUrl: './upload-track-form.html',
  styleUrl: './upload-track-form.scss',
})
export class UploadTrackForm {
  private readonly formNavigateService = inject(FormNavigationService);

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

    const formData = new FormData();
    formData.append('title', this.uploadTrackForm.value.title!);
    formData.append('artists', this.uploadTrackForm.value.artist!);
    formData.append('genre', this.uploadTrackForm.value.genre!);
    formData.append('file', this.uploadTrackForm.value.file!);
  }
  closeForm() {
    this.formNavigateService.goBackOrFallback('/library/custom-tracks');
  }
}
