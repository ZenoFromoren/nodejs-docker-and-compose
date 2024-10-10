import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Offer } from 'src/offers/offer.entity';
import { User } from 'src/users/user.entity';
import { Wish } from 'src/wishes/wish.entity';
import { Wishlist } from 'src/wishlists/wishlist.enitity';

@Injectable()
export class ConfigFactory implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('database.host'),
      port: this.configService.get<number>('database.port'),
      username: this.configService.get<string>('database.username'),
      password: this.configService.get<string>('database.password'),
      database: this.configService.get<string>('database.name'),
      schema: this.configService.get<string>('database.schema'),
      entities: [User, Wish, Wishlist, Offer],
      synchronize: true,
    };
  }
}
