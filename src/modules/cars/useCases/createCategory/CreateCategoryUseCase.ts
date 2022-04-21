import { inject, injectable } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { ICategoriesRepository } from '@modules/cars/repositories/ICategoriesRepository';
import { CategoriesRepository } from '@modules/cars/infra/typeorm/repositories/CategoriesRepository';

interface IRequest {
  name: string;
  description: string;
}

@injectable()
class CreateCategoryUseCase {
  constructor(
    @inject(CategoriesRepository)
    private categoriesRepository: ICategoriesRepository,
  ) {}

  async execute({ description, name }: IRequest): Promise<void> {
    const CategoryAlreadyExists = await this.categoriesRepository.findByName(
      name,
    );

    if (CategoryAlreadyExists) {
      throw new AppError('Category Already exists');
    }

    this.categoriesRepository.create({ name, description });
  }
}

export { CreateCategoryUseCase };
