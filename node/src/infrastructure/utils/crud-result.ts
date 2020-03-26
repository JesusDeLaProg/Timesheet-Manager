import { ICrudResult } from "../../../../types/viewmodels";

export class CrudResult<T = any> implements ICrudResult<T> {
  public static Success<U>(result: U, message: string = "") {
    return new CrudResult<U>({
      message,
      result,
      success: true
    });
  }

  public static Failure<U>(error: U, message?: string) {
    if (message === undefined && error instanceof Error) {
      message = error.message;
    }
    return new CrudResult<U>({
      message: message || "",
      result: error,
      success: false
    });
  }

  public readonly message: string;
  public readonly result: T | null;
  public readonly success: boolean;

  constructor(crudResult: ICrudResult<T>) {
    this.message = crudResult.message;
    this.result = crudResult.result;
    this.success = crudResult.success;
  }
}
