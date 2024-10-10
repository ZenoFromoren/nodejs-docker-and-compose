import { IsString } from 'class-validator';

export class SigninUserResponseDTO {
  @IsString()
  access_token: string;
}
