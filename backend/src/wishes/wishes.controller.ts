import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { Wish } from './wish.entity';
import { CreateWishDTO } from './dto/createWish.dto';
import { UpdateWishDTO } from './dto/updateWish.dto';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuth.guard';

@Controller('wishes')
export class WishesController {
  constructor(private wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createWishDTO: CreateWishDTO, @Req() req) {
    return await this.wishesService.createWish(createWishDTO, req.user.id);
  }

  @Get('last')
  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesService.findMany({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  @Get('top')
  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesService.findMany({
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: number): Promise<Wish> {
    return await this.wishesService.findById(id, ['owner', 'offers']);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishDTO: UpdateWishDTO,
    @Req() req,
  ) {
    return await this.wishesService.updateById(id, req.user.id, updateWishDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeById(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return await this.wishesService.removeById(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  async copyWish(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return await this.wishesService.copyWish(id, req.user.id);
  }
}
