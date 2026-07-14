import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const userExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (userExists) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashedPassword,
      },
    });

    // const { password, ...userWithoutPassword } = user;
    Reflect.deleteProperty(user, 'password');
    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      where: { ativo: true },
      orderBy: { createdAt: 'desc' },
    });

    return users.map(({ password, ...user }) => user);
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user || !user.ativo) {
      throw new NotFoundException('User not found');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    if (dto.email) {
      const emailInUse = await this.prisma.user.findFirst({
        where: { email: dto.email, NOT: { id } },
      });

      if (emailInUse) {
        throw new ConflictException('Email already registered');
      }
    }

    const data: Record<string, any> = { ...dto };

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async remove(id: string) {
    await this.findOne(id);

    //soft delete only - users w ticket must never be physically removed
    const user = await this.prisma.user.update({
      where: { id },
      data: { ativo: false },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
