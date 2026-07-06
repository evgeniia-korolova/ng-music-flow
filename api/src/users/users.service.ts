import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity/user.entity';
import { RegisterDto } from 'src/auth/DTOs/register.dto';
import { ApiException } from 'src/common/exceptions/api.exception';
import { UpdateResult } from 'typeorm/browser';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(registerDto: RegisterDto): Promise<UserEntity> {
    const { email, username, password, confirmPassword } = registerDto;

    if (password !== confirmPassword) {
      if (password !== confirmPassword) {
        throw new ApiException(
          {
            code: 'AUTH.PASSWORD.MISMATCH',
            message: 'Passwords do not match',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const userByEmail = await this.userRepository.findOneBy({ email });

    if (userByEmail) {
      throw new ApiException(
        {
          code: 'AUTH.EMAIL.TAKEN',
          message: 'Email is already in use',
        },
        HttpStatus.CONFLICT,
      );
    }

    const userByName = await this.userRepository.findOneBy({ username });

    if (userByName) {
      throw new ApiException(
        {
          code: 'AUTH.USERNAME.TAKEN',
          message: 'Username is already in use',
        },
        HttpStatus.CONFLICT,
      );
    }

    const hashedPassword = await this.hashPassword(password);

    if (!hashedPassword) {
      throw new BadRequestException('Failed to hash password');
    }

    const newUser = this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    });

    return await this.userRepository.save(newUser);
  }

  async findById(userId: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ id: userId });
  }

  async update(
    userId: string,
    updateInfo: Partial<UserEntity>,
  ): Promise<UpdateResult> {
    const safeUpdateInfo = { ...updateInfo };
    delete safeUpdateInfo.password;

    return await this.userRepository.update(userId, safeUpdateInfo);
  }

  async updatePassword(
    userId: string,
    newPassword: string,
  ): Promise<UpdateResult> {
    const password = await this.hashPassword(newPassword);

    return await this.userRepository.update(userId, { password });
  }

  async findByEmailWithPassword(email: string): Promise<UserEntity | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }
}
