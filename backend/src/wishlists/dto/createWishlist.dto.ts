import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateWishlistDTO {
  @IsString()
  @MaxLength(250)
  @IsOptional()
  name: string;

  @IsUrl()
  @IsOptional()
  image: string;

  @IsNotEmpty()
  itemsId: number[];
}
