import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './wish.entity';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Wish]), UsersModule],
  providers: [WishesService, JwtStrategy],
  controllers: [WishesController],
  exports: [WishesService],
})
export class WishesModule {}
