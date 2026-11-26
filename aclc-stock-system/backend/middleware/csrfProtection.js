const crypto = require("crypto");

const CSRF_COOKIE = "aclc_csrf";

const CSRF_SECRET = process.env.CSRF_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

const isProduction = process.env.NODE_ENV === "production";

const csrfCookieOptions = {
  httpOnly: false,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
};

const createCsrfToken = () => {
  if (!CSRF_SECRET || CSRF_SECRET.length < 32) {
    throw new Error("CSRF_SECRET must contain at least 32 characters.");
  }

  const nonce = crypto.randomBytes(32).toString("hex");

  const signature = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(nonce)
    .digest("hex");

  return `${nonce}.${signature}`;
};

const verifyCsrfToken = (token) => {
  if (typeof token !== "string") return false;

  const parts = token.split(".");

  if (parts.length !== 2) return false;

  const [nonce, signature] = parts;

  if (!/^[a-f0-9]{64}$/.test(nonce) || !/^[a-f0-9]{64}$/.test(signature)) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", CSRF_SECRET)
    .update(nonce)
    .digest("hex");

  const actual = Buffer.from(signature, "hex");
  const expected = Buffer.from(expectedSignature, "hex");

  return crypto.timingSafeEqual(actual, expected);
};

// Generate a CSRF token
exports.getCsrfToken = (req, res) => {
  try {
    const token = createCsrfToken();

    res.cookie(CSRF_COOKIE, token, csrfCookieOptions);

    return res.status(200).json({
      success: true,
      csrfToken: token,
    });
  } catch (error) {
    console.error("CSRF token generation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to initialize security token.",
    });
  }
};

// Protect state-changing requests
exports.csrfProtection = (req, res, next) => {
  const safeMethods = ["GET", "HEAD", "OPTIONS"];

  if (safeMethods.includes(req.method)) {
    return next();
  }

  try {
    const allowedOrigin = new URL(FRONTEND_URL).origin;
    const requestOrigin = req.get("origin");

    // Require the expected browser origin
    if (!requestOrigin || requestOrigin !== allowedOrigin) {
      return res.status(403).json({
        success: false,
        message: "Request origin is not allowed.",
      });
    }

    const cookieToken = req.cookies?.[CSRF_COOKIE];
    const headerToken = req.get("X-CSRF-Token");

    if (
      !cookieToken ||
      !headerToken ||
      cookieToken !== headerToken ||
      !verifyCsrfToken(headerToken)
    ) {
      return res.status(403).json({
        success: false,
        message: "Invalid security token. Please refresh and try again.",
      });
    }

    next();
  } catch (error) {
    console.error("CSRF validation error:", error);

    return res.status(403).json({
      success: false,
      message: "Unable to validate request security.",
    });
  }
};

exports.CSRF_COOKIE = CSRF_COOKIE;
