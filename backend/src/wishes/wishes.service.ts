import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Wish } from './wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import { CreateWishDTO } from './dto/createWish.dto';
import { UpdateWishDTO } from './dto/updateWish.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async findOne(query: FindOneOptions) {
    const wish = await this.wishesRepository.findOne(query);

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    return wish;
  }

  async findMany(query: FindManyOptions) {
    const wishes = await this.wishesRepository.find(query);

    if (!wishes) {
      throw new NotFoundException('Подарки не найдены');
    }

    return wishes;
  }

  async findById(id: number, relations = null): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations,
    });

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    return wish;
  }

  async findManyByIds(ids: number[]): Promise<Wish[]> {
    const wishes = await this.wishesRepository.findBy({ id: In(ids) });

    if (!wishes) {
      throw new NotFoundException('Подарок не найден');
    }

    return wishes;
  }

  async createWish(
    createWishDTO: CreateWishDTO,
    userId: number,
  ): Promise<Wish> {
    const owner = await this.usersService.findUserById(userId);
    const newWish = this.wishesRepository.create({
      ...createWishDTO,
      owner: owner,
    });

    return await this.wishesRepository.save(newWish);
  }

  async updateById(
    wishId: number,
    userId: number,
    updateWishDTO: UpdateWishDTO,
  ) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: { owner: true },
    });

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Нельзя изменять чужие подарки');
    }

    if (wish.raised > 0) {
      throw new ForbiddenException('Нельзя подарки, на которые уже скинулись');
    }

    return this.wishesRepository.update(wishId, updateWishDTO);
  }

  async raiseWish(wishId: number, amount: number) {
    const wish = await this.findById(wishId);

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    const updatedRaised = wish.raised + amount;

    return await this.wishesRepository.update(wishId, {
      raised: updatedRaised,
    });
  }

  async removeById(wishId: number, userId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: { owner: true },
    });

    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Нельзя удалять чужие подарки');
    }

    return this.wishesRepository.remove(wish);
  }

  async copyWish(wishId: number, userId: number) {
    const wish = await this.wishesRepository.findOne({
      where: { id: wishId },
      relations: { owner: true },
    });

    if (wish.owner.id === userId) {
      throw new ForbiddenException('Нельзя копировать свои подарки');
    }

    const { copied, id, ...wishData } = wish;
    wish.copied++;
    await this.wishesRepository.save(wish);

    return this.createWish(wishData, userId);
  }
}
