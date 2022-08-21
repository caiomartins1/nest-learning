import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  create(email: string, password: string) {
    const user = this.usersRepository.create({ email, password });
    return this.usersRepository.save(user);
  }

  findById(id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.usersRepository.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findById(id);

    if (!user) throw new Error('User not found');

    Object.assign(user, attrs);

    return this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.findById(id);
    if (!user) throw new Error('User not found');
    return this.usersRepository.remove(user);
  }
}
