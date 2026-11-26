const isProtection = process.env.NODE_ENV === "production";

const COOKIE_NAME = "aclc_session";

const cookieOptions = {
  httpOnly: true,
  secure: isProtection,
  sameSite: isProtection ? "none" : "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
};

const clearCookieOptions = {
  httpOnly: true,
  secure: isProtection,
  sameSite: isProtection ? "none" : "lax",
  path: "/",
};

module.exports = {
  COOKIE_NAME,
  cookieOptions,
  clearCookieOptions,
};
