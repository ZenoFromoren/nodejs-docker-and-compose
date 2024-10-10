import { PartialType } from '@nestjs/mapped-types';
import { CreateWishlistDTO } from './createWishlist.dto';

export class UpdateWishlistDTO extends PartialType(CreateWishlistDTO) {}
