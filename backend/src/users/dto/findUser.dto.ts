import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class FindUsersDTO {
  @IsString()
  @IsOptional()
  @Length(2, 30)
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;
}
