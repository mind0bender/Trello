export interface SuccessApiResponse<T> {
  success: true;
  data: T;
}

export interface FailureApiResponse {
  success: false;
  errors: string[];
}

export type ApiResponse<T> = SuccessApiResponse<T> | FailureApiResponse;

export const successResponse = <T>(data: T): SuccessApiResponse<T> => {
  return {
    success: true,
    data,
  };
};

export const failureResponse = (errors: string[] = []): FailureApiResponse => {
  return {
    success: false,
    errors,
  };
};
