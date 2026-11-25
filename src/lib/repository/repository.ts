import {
  isValidObjectId,
  type HydratedDocument,
  type Model,
  type ProjectionType,
  type QueryFilter,
  type QueryOptions,
  type Types,
} from "mongoose";
import AppError from "../../pkg/error/error.js";

export default abstract class Repository<T> {
  protected constructor(private readonly model: Model<T>) {}

  async create(data: T): Promise<HydratedDocument<T> | null> {
    return this.model.create(data);
  }

  async update(
    filter: QueryFilter<T>,
    newData: Partial<T>,
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findOneAndUpdate(filter, newData, { returnDocument: "after" });
  }

  async deleteById(id: Types.ObjectId) {
    return this.model.deleteOne({ _id: id });
  }

  async findById(id: Types.ObjectId | string, projection?: ProjectionType<T> | null): Promise<HydratedDocument<T> | null> {
    if (!isValidObjectId(id)) {
      throw new AppError("Invalid object id", 500);
    }
    return this.model.findById(id, projection);
  }

  async findOne(filter:QueryFilter<T> , projection?: ProjectionType<T>): Promise<HydratedDocument<T> | null> {
    return this.model.findOne(filter , projection)
  }
}
