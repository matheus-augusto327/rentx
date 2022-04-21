import 'reflect-metadata';
import { AuthenticateUserUserCase } from '@modules/accounts/useCases/authenticateUser/AuthenticateUserUserCase';
import { UsersRepositoryInMemory } from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import { CreateUserUserCase } from '@modules/accounts/useCases/createUser/CreateUserUserCase';
import { ICreateUserDTO } from '@modules/accounts/dtos/ICreateUserDTO';
import { AppError } from '@shared/errors/AppError';

let authenticateUserUseCase: AuthenticateUserUserCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUserCase: CreateUserUserCase;

describe('Authenticate User', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUserCase(
      usersRepositoryInMemory,
    );
    createUserUserCase = new CreateUserUserCase(usersRepositoryInMemory);
  });

  it('should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      name: 'Test User',
      password: '1234',
      email: 'user@test.com',
      driver_license: '00123',
    };

    await createUserUserCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty('token');
  });

  it('should not be able to authenticate an non existent user', async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'false@email.com',
        password: 'false',
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with incorrect password', async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'Test Error',
        password: '1234',
        email: 'user@user.com',
        driver_license: '9999',
      };

      await createUserUserCase.execute(user);
      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'incorrectPassword',
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
