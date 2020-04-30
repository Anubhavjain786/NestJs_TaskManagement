import { v1 as uuidv1 } from 'uuid';
import * as bycrpt from 'bcryptjs';
import { User } from './user.entity';
import { Repository, EntityRepository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import {
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    const { username, password } = authCredentialDto;

    const user = new User();
    user.uuid = uuidv1();
    user.salt = await bycrpt.genSalt();
    user.username = username;
    user.password = await this.hashPassword(password, user.salt);

    console.log(user.password);

    try {
      await user.save();
    } catch (error) {
      if (error.code == 23505) {
        throw new ConflictException(`Username ${username} is already exsists`);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredentialDto: AuthCredentialDto,
  ): Promise<string> {
    const { username, password } = authCredentialDto;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return await user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bycrpt.hash(password, salt);
  }
}
