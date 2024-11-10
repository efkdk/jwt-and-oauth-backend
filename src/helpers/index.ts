import { Types } from "mongoose";
import tokenService from "../services/token-service";
import type { IAuthResponse, IUser, IUserId } from "types/user";

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

function isIUser(data: any): data is IUser {
  return (
    data &&
    typeof data.username === "string" &&
    typeof data.email === "string" &&
    Types.ObjectId.isValid(data.id)
  );
}

export { createAndSaveTokens, isIUser };
