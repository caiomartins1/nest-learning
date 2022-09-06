import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      findByEmail: (email: string) => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('should create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('should create a new user with a hashed password', async () => {
    const user = await service.signup('test@gmail.com', 'test-password');
    const [salt, hash] = user.password.split('.');

    expect(user.password).not.toEqual('test-password');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should throw an error when user signs up with an email already in use', async () => {
    fakeUsersService.findByEmail = () =>
      Promise.resolve([
        { id: 1, email: 'a', password: 'test-password' } as User,
      ]);

    const promise = service.signup('test@test.com', 'pass');
    await expect(promise).rejects.toBeInstanceOf(BadRequestException);
  });
});
