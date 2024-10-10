import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateOfferDTO {
  @IsNumber()
  @Min(1)
  amount: number;

  @IsBoolean()
  @IsOptional()
  hidden: boolean;

  @IsNumber()
  itemId: number;
}
