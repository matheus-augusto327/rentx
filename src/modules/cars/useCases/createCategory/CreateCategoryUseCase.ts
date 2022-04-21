import { inject, injectable } from "tsyringe"; import { AppError } from "../../../../errors/AppError";
"tsyringe"
import { ICategoriesRepository } from "../../repositories/ICategoriesRepository";


interface IRequest {
  name: string,
  description: string
}
// SOLID - a) Single Responsability Principle
@injectable()
class CreateCategoryUseCase {
  constructor(
    @inject("CategoriesRepository")
    private categoriesRepository: ICategoriesRepository
  ) { }
  // constructor(private categoriesRepository: ICategoriesRepository) { }

  async execute({ name, description }: IRequest): Promise<void> {

    const categoryAlreadyExists = await this.categoriesRepository.findByName(
      name
    );

    console.log("cade ", categoryAlreadyExists)
    if (categoryAlreadyExists) {
      throw new AppError("Category Already exists !")
    }

    this.categoriesRepository.create({ name, description });

  }
}

export { CreateCategoryUseCase }