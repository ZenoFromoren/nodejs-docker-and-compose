import { IsBoolean, IsNumber, IsPositive } from 'class-validator';
import { User } from 'src/users/user.entity';
import { Wish } from 'src/wishes/wish.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @IsNumber()
  @IsPositive()
  amount: number;

  @Column({ default: false })
  @IsBoolean()
  hidden: boolean;

  @ManyToOne(() => User, (user) => user.offers)
  owner: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
}
