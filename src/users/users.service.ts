import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findOne(email: string): Promise<UserDocument> {
    return await this.userModel.findOne({ email });
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    let user: UserDocument = await this.findOne(createUserDto.email);

    if (user) {
      throw new BadRequestException('User with that email already exist.');
    }

    user = (await this.userModel.create(createUserDto)) as UserDocument;

    user.password = user.hashPassword(createUserDto.password);

    await user.save();

    return user;
  }
}
