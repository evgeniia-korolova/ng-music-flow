import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity/user.entity';
import { RegisterDto } from 'src/auth/DTOs/RegisterDto';
import { ApiException } from 'src/common/exceptions/api.exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(registerDto: RegisterDto): Promise<UserEntity> {
    const { email, username, password, confirmPassword } = registerDto;

    if (password !== confirmPassword) {
      throw new ApiException(
        {
          code: 'AUTH.PASSWORD.MISMATCH',
          message: 'Passwords do not match',
        },
        HttpStatus.BAD_REQUEST,
      );
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

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

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

  async findByEmailWithPassword(email: string): Promise<UserEntity | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
  }
}
