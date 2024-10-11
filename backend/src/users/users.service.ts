import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FindManyOptions, FindOneOptions, Not, Repository } from 'typeorm';
import { CreateUserDTO } from './dto/createUser.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDTO: CreateUserDTO) {
    const { username, email, password } = createUserDTO;

    const isUserExist = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (isUserExist) {
      throw new ConflictException('Пользователь уже зарегистрирован');
    }

    const hash = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      ...createUserDTO,
      password: hash,
    });

    return this.userRepository.save(user);
  }

  async findOne(query: FindOneOptions) {
    const user = await this.userRepository.findOne(query);

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async findMany(query: FindManyOptions) {
    const users = await this.userRepository.find(query);

    if (!users.length) {
      throw new NotFoundException('Пользователи не найдены');
    }

    return users;
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async updateProfileData(id: number, updateUserDTO: UpdateUserDTO) {
    const user = await this.userRepository.findOneBy({ id });

    console.log(updateUserDTO);

    if (!user) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }

    const { username, email } = updateUserDTO;

    if (username) {
      const isUsernameExist = await this.userRepository.findOne({
        where: {id: Not(id), username },
      });

      if (isUsernameExist) {
        throw new ConflictException('Данное имя пользователя уже занято');
      }
    }
    
    if (email) {
      const isEmailExist = await this.userRepository.findOne({
        where: { id: Not(id), email },
      });

      if (isEmailExist) {
        throw new ConflictException(
          'Данный адрес электронной почты уже зарегистрирован',
        );
      }
    }
    
    if (updateUserDTO.password) {
      updateUserDTO.password = await bcrypt.hash(updateUserDTO.password, 10);
    }

    return await this.userRepository.update({ id }, updateUserDTO);
  }
}
