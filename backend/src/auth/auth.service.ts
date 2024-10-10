import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { CreateUserDTO } from 'src/users/dto/createUser.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signup(createUserDTO: CreateUserDTO) {
    const user = await this.usersService.create(createUserDTO);

    return user;
  }

  async signin(user: User) {
    const { username, id: sub } = user;

    const token = await this.jwtService.signAsync({ username, sub });

    return {
      access_token: token,
    };
  }

  async validateUser(getUsername: string, getPassword: string) {
    const user = await this.usersService.findOne({
      where: { username: getUsername },
      select: { id: true, username: true, password: true },
    });

    if (!user) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }

    const isMatched = await bcrypt.compare(getPassword, user.password);

    if (!isMatched) {
      throw new UnauthorizedException('Неверное имя пользователя или пароль');
    }

    const { password, ...userData } = user;

    return userData;
  }
}
