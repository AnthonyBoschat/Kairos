export type ErrorResponse = { success: false; message: string }

export function responseError(message: string): ErrorResponse {
  return { success: false, message }
}


