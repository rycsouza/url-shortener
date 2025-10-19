import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { IsNull, Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(email: string, name: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    const user = this.usersRepo.create({ email, name, password: hash });
    return this.usersRepo.save(user);
  }

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email, deletedAt: IsNull() } });
  }

  async findById(id: string) {
    return this.usersRepo.findOne({ where: { id, deletedAt: IsNull() } });
  }
}
