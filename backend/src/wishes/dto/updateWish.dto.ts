import { PartialType } from '@nestjs/mapped-types';
import { CreateWishDTO } from './createWish.dto';

export class UpdateWishDTO extends PartialType(CreateWishDTO) {}
