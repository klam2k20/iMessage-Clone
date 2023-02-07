export interface CreateUsernameResponse {
  createUsername: {
    success: boolean;
    error: string;
  }
}

export interface CreateUsernameVariables {
  username: string;
}

export interface SearchUserResponse {
  searchUsers: Array<SearchedUser>;
}

export interface SearchUserVariables {
  username: string;
}

export interface SearchedUser {
  id: string;
  username: string;
}