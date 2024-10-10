import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { JwtAuthGuard } from 'src/auth/guards/JwtAuth.guard';
import { Wish } from 'src/wishes/wish.entity';
import { FindUsersDTO } from './dto/findUser.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getProfileData(@Req() req): Promise<User> {
    return await this.usersService.findUserById(req.user.id);
  }

  @Patch('me')
  async updateProfileData(@Req() req, @Body() updateUserDTO: UpdateUserDTO) {
    return await this.usersService.updateProfileData(
      req.user.id,
      updateUserDTO,
    );
  }

  @Get('me/wishes')
  async getMyWishes(@Req() req): Promise<Wish[]> {
    return (
      await this.usersService.findOne({
        where: { id: req.user.id },
        relations: { wishes: true },
      })
    ).wishes;
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string) {
    return await this.usersService.findUserByUsername(username);
  }

  @Get(':username/wishes')
  async getWishesByUsername(
    @Param('username') username: string,
  ): Promise<Wish[]> {
    return (
      await this.usersService.findOne({
        where: { username },
        relations: { wishes: true },
      })
    ).wishes;
  }

  @Post('find')
  async searchUsers(@Body() findUsersDTO: FindUsersDTO) {
    const { email, username } = findUsersDTO;
    return await this.usersService.findMany({
      where: [{ email }, { username }],
    });
  }
}
