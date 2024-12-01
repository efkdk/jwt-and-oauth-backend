import type { GoogleOauthToken, GoogleUserResult } from "types/google";
import axios from "axios";
import QueryString from "qs";

const REDIRECT_URI = `${process.env.API_URL}/api/sessions/oauth/google`;

export const getGoogleOauthToken = async ({
  code,
}: {
  code: string;
}): Promise<GoogleOauthToken> => {
  const rootURL = "https://oauth2.googleapis.com/token";

  const options = {
    code,
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  };
  try {
    const { data } = await axios.post<GoogleOauthToken>(
      rootURL,
      QueryString.stringify(options),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return data;
  } catch (error) {
    console.log("Failed to fetch Google Oauth Tokens: ", error);
    throw new Error(error);
  }
};

export async function getGoogleUser(
  access_token: string
): Promise<GoogleUserResult> {
  try {
    const { data } = await axios.get<GoogleUserResult>(
      `https://www.googleapis.com/oauth2/v3/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    if (!data || !data.email) {
      throw new Error("UserInfo response is empty or invalid.");
    }

    return data;
  } catch (error) {
    console.log("Get google user failed: ", error);
    throw new Error(error);
  }
}
