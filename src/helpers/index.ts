import { Types } from "mongoose";
import tokenService from "../services/token-service";
import type { IAuthResponse, IUser, IUserId } from "types/user";

async function createAndSaveTokens(
  username: string,
  email: string,
  id: IUserId,
  isVerified: boolean
): Promise<IAuthResponse> {
  const userDto = {
    username,
    email,
    id,
  };

  const tokens = tokenService.generateTokens(userDto);
  const authResponse = { isVerified, ...userDto };
  await tokenService.saveToken(userDto.id, tokens.refreshToken);
  return { ...tokens, user: authResponse };
}

function isIUser(data: any): data is IUser {
  return (
    data &&
    typeof data.username === "string" &&
    typeof data.email === "string" &&
    Types.ObjectId.isValid(data.id)
  );
}

export { createAndSaveTokens, isIUser };
