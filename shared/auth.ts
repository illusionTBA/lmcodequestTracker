export interface Auth {
  authenticated: boolean;
  user: User;
  tokens: Tokens;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  verified: boolean;
  data: Data;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  roles: string[];
}

export interface Data {
  DOMJudgeTeamID: string;
  DOMJudgeToken: string;
  DOMJudgeUserID: string;
}
