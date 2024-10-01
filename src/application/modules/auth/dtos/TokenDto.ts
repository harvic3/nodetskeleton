export type TokenDtoType = {
  token: string;
  expiresIn: number;
};

export class TokenDto {
  token: string;
  expiresIn: number;

  constructor(props: TokenDtoType) {
    this.token = props.token;
    this.expiresIn = props.expiresIn;
  }
}
