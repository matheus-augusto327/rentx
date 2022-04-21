import { inject, injectable } from 'tsyringe';
import 'reflect-metadata';
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { AppError } from '@errors/AppError';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: { name: string; email: string };
  token: string;
}

@injectable()
class AuthenticateUserUserCase {
  constructor(
    @inject('UsersRepository')
    private UsersRepository: IUsersRepository,
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    //verificar se o usuario existe
    const user = await this.UsersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email or password incorrect');
    }

    //senha está correta?
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError('Email or password incorrect');
    }

    //gerar jswonwebtoken
    const token = sign({}, '15c227979956878f68a08a8ce9623b48', {
      subject: user.id,
      expiresIn: '1d',
    });

    const tokenReturn: IResponse = {
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    };

    return tokenReturn;
  }
}

export { AuthenticateUserUserCase };
