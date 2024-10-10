import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Offer } from './offer.entity';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOfferDTO } from './dto/createOffer.dto';
import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offerRepository: Repository<Offer>,
    private wishesService: WishesService,
    private usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<Offer[]> {
    return await this.offerRepository.find();
  }

  async findOne(query: FindOneOptions) {
    const offer = await this.offerRepository.findOne(query);

    if (!offer) {
      throw new NotFoundException('Заявка не найдена');
    }

    return offer;
  }

  async findById(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (!offer) {
      throw new NotFoundException('Заявка не найдена');
    }

    return offer;
  }

  async create(createOfferDTO: CreateOfferDTO, userId: number): Promise<Offer> {
    const { amount, itemId } = createOfferDTO;

    const wish = await this.wishesService.findOne({
      where: { id: itemId },
      relations: { owner: true },
    });
    const offerOwner = await this.usersService.findUserById(userId);

    if (!wish) {
      throw new NotFoundException('Заявка не найдена');
    }

    if (wish.owner.id === userId) {
      throw new ForbiddenException('Нельзя скидываться на свои подарки');
    }

    if (wish.raised + amount > wish.price) {
      throw new BadRequestException('Собрано больше, чем требовалось');
    }

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      wish.raised += amount;
      await this.wishesService.raiseWish(wish.id, amount);

      const offer = this.offerRepository.create({
        ...createOfferDTO,
        owner: offerOwner,
        item: wish,
      });

      return await this.offerRepository.save(offer);
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
