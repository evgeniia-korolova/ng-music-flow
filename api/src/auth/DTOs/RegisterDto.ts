import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator/types';

export class RegisterDto {
  @IsEmail({}, { message: 'Must be a correct email' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @Length(3, 15, { message: 'Username must be between 3 and 15 letters' })
  @Matches(/^[\w-]+$/, {
    message:
      'Username can only include letters, numbers, underscore and hyphen',
  })
  @Matches(/^[a-zA-Z]/, {
    message: 'Username must start with a letter',
  })
  username!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @Length(8, 24, { message: 'Password must be between 8 and 24 letters' })
  @Matches(/.*[A-Z].*/, { message: 'Must include uppercase letter' })
  @Matches(/.*[a-z].*/, { message: 'Must include lowercase letter' })
  @Matches(/.*\d.*/, { message: 'Must include number' })
  @Matches(/.*[@$!%*?&].*/, { message: 'Must include special character' })
  @Matches(/^\S+$/, { message: 'Must not include spaces' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Retype your password' })
  confirmPassword!: string;
}
