import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Older password is required' })
  oldPassword!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @Length(8, 24, { message: 'Password must be between 8 and 24 letters' })
  @Matches(/.*[A-Z].*/, { message: 'Password must include uppercase letter' })
  @Matches(/.*[a-z].*/, { message: 'Password must include lowercase letter' })
  @Matches(/.*\d.*/, { message: 'Password must include number' })
  @Matches(/.*[@$!%*?&].*/, {
    message: 'Password must include special character',
  })
  @Matches(/^\S+$/, { message: 'Password must not include spaces' })
  newPassword!: string;
}
