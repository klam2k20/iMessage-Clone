export interface CreateUsernameResponse {
  createUsername: {
    success: boolean;
    error: string;
  }
}

export interface CreateUsernameVariables {
  username: string;
}