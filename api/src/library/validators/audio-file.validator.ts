import { PipeTransform, Injectable } from '@nestjs/common';
import { NestMulterFile } from '../DTOs/track.dto';
import { validateMagicBytes } from 'src/common/utils/validate-audio';
import { ApiException } from 'src/common/exceptions/api.exception';

interface FileValidatorOptions {
  maxSize: number;
  allowedMimeTypes: string[];
}

@Injectable()
export class AudioFileValidator implements PipeTransform {
  private readonly defaultOptions: FileValidatorOptions = {
    maxSize: 50 * 1024 * 1024,
    allowedMimeTypes: [
      'audio/mpeg',
      'audio/wav',
      'audio/x-wav',
      'audio/mp4',
      'audio/x-m4a',
      'audio/aac',
      'audio/ogg',
      'audio/webm',
      'audio/flac',
      'audio/x-flac',
    ],
  };

  constructor(private readonly options?: Partial<FileValidatorOptions>) {}

  transform(file: NestMulterFile): NestMulterFile {
    const config = { ...this.defaultOptions, ...this.options };

    if (!file?.buffer || file.size === 0) {
      throw new ApiException(
        {
          message: 'File upload failed: No valid file provided.',
          code: 'FILEUPLOAD.INVALID_FORMAT',
        },
        500,
      );
    }

    if (file.size > config.maxSize) {
      const sizeInMb = (config.maxSize / (1024 * 1024)).toFixed(0);
      throw new ApiException(
        {
          message: `File upload failed: File size exceeds the maximum limit of ${sizeInMb}MB.`,
          code: 'FILEUPLOAD.TOO_LARGE',
        },
        500,
      );
    }

    if (!config.allowedMimeTypes.includes(file.mimetype)) {
      throw new ApiException(
        {
          message: `File upload failed: Unsupported file type (${file.mimetype}). Allowed types are: ${config.allowedMimeTypes.join(', ')}`,
          code: 'FILEUPLOAD.INVALID_FORMAT',
        },
        500,
      );
    }

    const isRealAudio = validateMagicBytes(file.buffer);
    if (!isRealAudio) {
      throw new ApiException(
        {
          message:
            'File validation failed: The file contents do not match a valid audio signature.',
          code: 'FILEUPLOAD.INVALID_FORMAT',
        },
        500,
      );
    }

    return file;
  }
}
