import User from "../modals/User.modal.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

/**
 * Register a new user.
 * This function:
 *  - Validates that all required fields are provided.
 *  - Checks if the user already exists.
 *  - Creates a new user record.
 *  - Generates a verification token.
 *  - Saves the token in the user's record.
 *  - Sends a verification email to the user.
 */
const registerUser = async (req, res) => {
  // Extract data from the request body
  const { name, email, password } = req.body;
  try {
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    // Create new user record
    const user = await User.create({
      name,
      email,
      password,
    });
    console.log(user);
    if (!user) {
      return res.status(400).json({
        message: "Failed to crate user.",
      });
    }
    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    console.log(token);

    // Save the token in the user's record
    user.verificationToken = token;
    console.log(user.verificationToken);

    // Save the updated user record
    await user.save();

    // Send verification email
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.MAILTRAP_SENDEREMAIL,
      to: user.email,
      subject: "Verify your email", // Subject line
      text: `Please click on the following link:
        ${process.env.BASE_URL}/api/v1/user/verify/${token}
        `,
    };

    await transporter.sendMail(mailOption);

    // Add a success response here
    return res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
      success: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: "user not registerd successfully",
      error: error.message,
      sucess: false,
    });
  }
};

/**
 * Verify a user's email.
 * This function:
 *  - Retrieves the verification token from the URL parameters.
 *  - Finds the user corresponding to that token.
 *  - Sets the user's verified status to true.
 *  - Removes the verification token from the user's record.
 */

const verifyUser = async (req, res) => {
  // Extract the token from the URL parameters
  const { token } = req.params;
  try {
    // Check that a token was provided
    if (!token) {
      return res.status(400).json({
        message: "Invalid Token",
      });
    }

    // Find the user corresponding to the token
    const user = await User.findOne({ verificationToken: token });

    // Check if the user was not found
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Mark the user as verified and remove the token

    user.isVerified = true;
    user.verificationToken = undefined;

    // Save the updated user record
    await user.save();

    // Send a success response
    return res.status(200).json({
      message: "User verified successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: "User not verified successfully",
      error: error.message,
      success: false,
    });
  }
};

/**
 * Login a user.
 * This function:
 *  - Validates that the email and password are provided.
 *  - Checks the database for a matching user.
 *  - Compares the provided password with the stored hashed password.
 *  - Generates a JWT token if authentication is successful.
 *  - Sends the token in an HTTP-only cookie along with user details.
 */

const loginUser = async (req, res) => {
  // Extract email and password from the request body
  const { email, password } = req.body;
  try {
    // Check that email and password were provided
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    // Find the user in the database by email
    const user = await User.findOne({ email });

    // Check if the user was not found
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Compare the given password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    // Check if the passwords do not match
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Set up options for the cookie where the token will be stored
    const cookieOption = {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    // Set the token as a cookie in the response
    res.cookie("token", token, cookieOption);
    // Set up options for the cookie where the token will be stored
    const cookieOptions = {
      httpOnly: true, // Accessible only by the web server
      secure: true, // Ensure secure transmission (HTTPS) in production
      maxAge: 24 * 60 * 60 * 1000, // Cookie lifespan of 24 hours
    };

    // Set the token as a cookie in the response
    res.cookie("token", token, cookieOptions);

    // Send a successful response including the token and user info
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    // Handle any errors during the login process
    res.status(400).json({
      message: "An error occurred during login",
      error,
      success: false,
    });
  }
};

/**
 * Get the details of the currently authenticated user.
 * This function assumes that an authentication middleware has added the user's ID to req.user.
 * It excludes the password field from the returned user data.
 */
const getMe = async (req, res) => {
  try {
    // Find the user by ID and exclude the password from the returned data
    const user = await User.findById(req.user.id).select("-password");
    console.log(user);

    // If the user is not found, return an error response
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Respond with the user data
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    // Log the error and respond with a server error message
    console.log("Error in getMe", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

/**
 * Log out the user.
 * This function clears the JWT token stored in the cookie, effectively logging out the user.
 */
const logoutUser = async (req, res) => {
  try {
    // Clear the token cookie by setting it to an empty string
    res.cookie("token", "", {});
    // Respond with a success message
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    // Handle any errors that occur during logout
    res.status(500).json({
      success: false,
      message: "Error during logout",
      error,
    });
  }
};

/**
 * Initiate the forgot password process.
 * This function should:
 *  - Receive the user's email.
 *  - Generate a reset token and expiry time.
 *  - Save these details in the user's record.
 *  - Send an email with the reset link.
 * Currently, it provides a placeholder response.
 */
const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email is required",
        });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User with this email does not exist",
        });
      }
  
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
  
      // Set token and expiry on user
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
      await user.save();
  
      // Send email with reset link
      const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        auth: {
          user: process.env.MAILTRAP_USERNAME,
          pass: process.env.MAILTRAP_PASSWORD,
        },
      });
  
      const resetUrl = `${process.env.BASE_URL}/reset-password/${resetToken}`;
  
      const mailOptions = {
        from: process.env.MAILTRAP_SENDEREMAIL,
        to: user.email,
        subject: "Reset your password",
        text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}\n\nThis link will expire in 10 minutes.`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({
        success: true,
        message: "Password reset email sent",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error while initiating password reset",
        error: error.message,
      });
    }
  };
  

/**
 * Reset the user's password.
 * This function should:
 *  - Retrieve the reset token from the URL parameters.
 *  - Validate the new password (and confirmation password) from the request body.
 *  - Find the user with the valid reset token and ensure it has not expired.
 *  - Update the user's password.
 *  - Clear the reset token and expiry fields.
 */
const resetPassword = async (req, res) => {
  try {
    // Extract reset token from URL and new passwords from request body
    const { token } = req.params;
    const { password, confPassword } = req.body;

    // Check if the provided password and confirm password match
    if (password !== confPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    try {
      // Find the user with the valid reset token that hasn't expired
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      // If no user is found, the token is invalid or expired
      if (!user) {
        return res.status(400).json({
          message: "Invalid or expired reset token",
        });
      }

      // Update the user's password (assuming the model handles hashing)
      user.password = password;
      // Clear reset token and expiry fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      // Save the updated user document
      await user.save();

      // Respond with a success message
      res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      // Handle errors specific to finding the user or updating the password
      res.status(400).json({
        message: "Error during password reset",
        error,
        success: false,
      });
    }
  } catch (error) {
    // Handle any unexpected errors during the outer process
    res.status(500).json({
      message: "Server error during password reset",
      error,
      success: false,
    });
  }
};

// Export all functions so that they can be used in routing or elsewhere in the application
export {
  registerUser,
  verifyUser,
  loginUser,
  getMe,
  logoutUser,
  resetPassword,
  forgotPassword,
};
