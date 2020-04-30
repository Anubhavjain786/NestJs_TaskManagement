import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsAlphanumeric,
  Matches,
} from 'class-validator';

export class AuthCredentialDto {
  @IsString()
  @IsEmail()
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too week',
  })
  password: string;
}
