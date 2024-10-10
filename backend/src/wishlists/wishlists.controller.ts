import { WishlistsService } from './wishlists.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Wishlist } from './wishlist.enitity';
import { CreateWishlistDTO } from './dto/createWishlist.dto';
import { UpdateWishlistDTO } from './dto/updateWishlist.dto';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuth.guard';

@UseGuards(JwtAuthGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @Post()
  async create(
    @Body() createWishlistDTO: CreateWishlistDTO,
    @Req() req,
  ): Promise<Wishlist> {
    return await this.wishlistsService.createWishlist(
      createWishlistDTO,
      req.user.id,
    );
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Wishlist> {
    return await this.wishlistsService.findById(id, ['owner', 'items']);
  }

  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() updateWishlistDTO: UpdateWishlistDTO,
    @Req() req,
  ) {
    return this.wishlistsService.updateById(id, req.user.id, updateWishlistDTO);
  }

  @Delete(':id')
  removeById(@Param('id') id: number, @Req() req) {
    return this.wishlistsService.removeById(id, req.user.id);
  }
}
