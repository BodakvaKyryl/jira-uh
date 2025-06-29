export const AUTH_COOKIE = "jira-uh-session";

export const cookieMaxAge = 60 * 60 * 24 * 30;

export const COOKIE_OPTIONS = {
  path: "/",
  httpOnly: false,
  secure: true,
  sameSite: "strict" as const,
  maxAge: cookieMaxAge,
};
