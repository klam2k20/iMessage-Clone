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
  searchUser: Array<SearchUser>;
}

export interface SearchUserVariables {
  username: string;
}

export interface SearchUser {
  id: string;
  username: string;
}