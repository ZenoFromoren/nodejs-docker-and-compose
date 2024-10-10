import { WishesService } from 'src/wishes/wishes.service';
import { UsersService } from 'src/users/users.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Wishlist } from './wishlist.enitity';
import { CreateWishlistDTO } from './dto/createWishlist.dto';
import { UpdateWishlistDTO } from './dto/updateWishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    private usersService: UsersService,
    private wishesService: WishesService,
  ) {}

  async findOne(query: FindOneOptions) {
    const wishlist = await this.wishlistsRepository.findOne(query);

    if (!wishlist) {
      throw new NotFoundException('Список подарков не найден');
    }

    return wishlist;
  }

  async findMany(query: FindManyOptions) {
    const wishlists = await this.wishlistsRepository.find(query);

    if (!wishlists) {
      throw new NotFoundException('Списки подарков не найдены');
    }

    return wishlists;
  }

  async findAll(): Promise<Wishlist[]> {
    return await this.findMany({ relations: ['owner', 'items'] });
  }

  async findById(id: number, relations = null): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id },
      relations,
    });

    if (!wishlist) {
      throw new NotFoundException('Список подарков не найден');
    }

    return wishlist;
  }

  async createWishlist(
    createWishlistDTO: CreateWishlistDTO,
    userId: number,
  ): Promise<Wishlist> {
    const { itemsId, ...createWishlistData } = createWishlistDTO;

    const owner = await this.usersService.findUserById(userId);
    const items = await this.wishesService.findManyByIds(itemsId);

    const newWishlist = this.wishlistsRepository.create({
      ...createWishlistData,
      owner,
      items,
    });

    return await this.wishlistsRepository.save(newWishlist);
  }

  async updateById(
    wishlistId: number,
    userId: number,
    updateWishlistDTO: UpdateWishlistDTO,
  ) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id: wishlistId },
      relations: { owner: true },
    });

    if (!wishlist) {
      throw new NotFoundException('Список подарков не найден');
    }

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Нельзя изменять чужие списки подарков');
    }

    return this.wishlistsRepository.update(wishlistId, updateWishlistDTO);
  }

  async removeById(wishlistId: number, userId: number) {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id: wishlistId },
      relations: { owner: true },
    });

    if (!wishlist) {
      throw new NotFoundException('Список подарков не найден');
    }

    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('Нельзя удалять чужие списки подарков');
    }

    return this.wishlistsRepository.remove(wishlist);
  }
}
