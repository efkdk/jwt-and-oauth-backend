import tokenService from "../services/token-service";
import type { IAuthResponse, IUserId } from "types/user";

async function createAndSaveTokens(
  username: string,
  email: string,
  id: IUserId
): Promise<IAuthResponse> {
  const userDto = {
    username,
    email,
    id,
  };

  const tokens = tokenService.generateTokens(userDto);
  await tokenService.saveToken(userDto.id, tokens.refreshToken);
  return { ...tokens, user: userDto };
}

export { createAndSaveTokens };
