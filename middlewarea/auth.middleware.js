import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();


export const isLoggedIn = async (req, res, next) => {
  try {
    console.log(req.cookies);

    //get token from cookie
    let token = req.cookies?.token;
    console.log(`from middleware: ${token}`);

    console.log("Token Found: ", token ? "YES" : "NO");
  //validate token
    if (!token) {
      console.log("NO token");
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }
  //get the decoded  of token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded data: ", decoded);
    req.user = decoded;
    next();

  } catch (error) {
    console.log("Auth middleware failure");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default isLoggedIn;