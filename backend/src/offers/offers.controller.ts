import { UsersService } from 'src/users/users.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Offer } from './offer.entity';
import { OffersService } from './offers.service';
import { CreateOfferDTO } from './dto/createOffer.dto';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuth.guard';

@UseGuards(JwtAuthGuard)
@Controller('offers')
export class OffersController {
  constructor(
    private offersService: OffersService
  ) {}

  @Post()
  async create(
    @Body() createOfferDTO: CreateOfferDTO,
    @Req() req,
  ): Promise<Offer> {
    return await this.offersService.create(createOfferDTO, req.user.id);
  }

  @Get()
  async findAll(): Promise<Offer[]> {
    return await this.offersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Offer> {
    return await this.offersService.findOne({
      where: { id },
      relations: { owner: true },
    });
  }
}
