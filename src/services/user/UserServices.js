import UserModel from "../../models/UserModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import CartModel from "../../models/CartModel.js";
import WishlistModel from "../../models/WishlistModel.js";
import CouponModel from "../../models/couponModel.js";
import {
  sendPasswordViaEmail,
  forgotPasswordEmail,
  encryptStringWithKey,
} from "../../helpers/common.js";
import { Op, where } from "sequelize";
import userOtpModel from "../../models/userOtpModel.js";
import { environmentVars } from "../../config/environmentVar.js";
import { generateAccessToken } from "../../helpers/validateUser.js";
import jwt from "jsonwebtoken";

let salt = environmentVars.salt;
class UserServices {
  async createUser(req, res) {
    try {
      let email = req.body.email.trim();
      let phone = req.body.phone;
      let country = req.body.country;

      let salt = environmentVars.salt;

      // let randomPassword = crypto.randomBytes(10).toString("base64");
      let randomPassword = encryptStringWithKey(
        req.body.email.toLowerCase()?.slice(0, 6)
      );
      // console.log(randomPassword);
      let hashPassword = await bcrypt.hash(`${randomPassword}`, `${salt}`);

      //for creating the user in database
      console.log(country);
      let obj = {
        name: req.body.name?.trim(),
        email: email,
        phone: phone,
        country: country,
        password: hashPassword,
        is_verified: false,
      };
      //for smtp
      let data = {
        name: req.body.name?.trim(),
        email: email,
        phone: phone,
        country: country,
        userPassword: `${randomPassword}`,
      };
      let findEmailExist = await UserModel.findOne({
        where: { email: email },
      });
      if (findEmailExist) {
        return res.status(400).json({
          success: false,
          message: "Email already exist!",
          statusCode: 400,
        });
        // } else if (
        //   findEmailExist &&
        //   findEmailExist.email &&
        //   findEmailExist.is_verified == false
        // ) {
        //   await sendPasswordViaEmail(res, data);
        //   return;
      } else {
        const userData = await UserModel.create(obj, { raw: true });
        if (userData) {
          await sendPasswordViaEmail(res, data);
        }
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async loginUser(req, res) {
    try {
      let { email, password } = req.body;
      let emailExistCheck = await UserModel.findOne({
        where: { email },
        raw: true,
      });
      if (!emailExistCheck) {
        return res.status(400).json({
          message: "Email not found",
          success: false,
          statusCode: 400,
        });
      }
      let checkpassword = await bcrypt.compare(
        password,
        emailExistCheck?.password
      );

      if (!checkpassword) {
        return res.status(400).json({
          message: "Password invalid",
          success: false,
          statusCode: 400,
        });
      }
      delete emailExistCheck?.password;
      // console.log(emailExistCheck, "emailExistCheck22222emailExistCheck");
      let token = generateAccessToken(emailExistCheck);
      res
        .cookie("_token", token, {
          httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
          secure: true, // Requires HTTPS connection
          sameSite: "strict", // Restricts the cookie to be sent only in same-site requests
        })
        .status(200)
        .json({
          success: true,
          message: "Logged in successfully!",
          statusCode: 200,
        });
      // console.log(emailExistCheck?.is_verified,"emailExistCheck?.is_verifiedemailExistCheck?.is_verified")
      if (emailExistCheck?.is_verified == 0) {
        await UserModel.update(
          { is_verified: true },
          { where: { id: emailExistCheck?.id } }
        );
      }
      return;
    } catch (err) {
      console.log(err, "Error in login api");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async sendForgotPasswordEmail(req, res) {
    try {
      let email = req.body.email?.trim();
      let findEmailExist = await UserModel.findOne({
        where: { email },
        attributes: ["email", "id", "name"],
      });

      if (!findEmailExist) {
        return res.status(404).json({
          message: "Email not found",
          success: false,
          statusCode: 400,
        });
      } else {
        let getRandomNumber = Math.round(Math.random() * 10000);
        let obj = {
          user_id: findEmailExist?.id,
          otp_code: getRandomNumber,
          email: findEmailExist?.email,
          name: findEmailExist?.name,
        };
        // console.log(obj,"EEEEEEEEEEEEEEEEEEEEEEEEEEEE")
        let getEmailCheck = await userOtpModel.findOne({
          where: { user_id: findEmailExist?.id },
          attributes: ["id"],
        });
        if (getEmailCheck && getEmailCheck?.id) {
          await userOtpModel.update(
            { otp_code: getRandomNumber, creation_time: Date.now() },
            { where: { user_id: findEmailExist?.id } }
          );
        } else {
          await userOtpModel.create(obj);
        }
        await forgotPasswordEmail(req, res, obj);
      }
    } catch (err) {
      // console.log(err);
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async verify_otp_data(req, res) {
    try {
      let { email, otp_code } = req.body;
      email = req.body.email?.trim();
      let emailExist = await UserModel.findOne({ where: { email }, raw: true });
      if (!emailExist) {
        res
          .status(400)
          .json({ message: "User not found", success: false, statusCode: 400 });
        return;
      }
      let fetchDoc = await userOtpModel.findOne({
        where: { user_id: emailExist?.id },
      });

      if (!fetchDoc) {
        return res.status(400).json({
          message: "Internal server error",
          success: false,
          statusCode: 400,
        });
      }
      let creation_time = fetchDoc?.creation_time;
      let current_time = Date.now();
      const differenceInMilliseconds = current_time - creation_time;
      const differenceInMinutes = Math.floor(
        differenceInMilliseconds / (1000 * 60)
      );
      if (differenceInMinutes > 5) {
        return res
          .status(400)
          .json({ message: "OTP expired", success: false, statusCode: 400 });
      }
      if (fetchDoc?.otp_code != otp_code) {
        return res
          .status(400)
          .json({ message: "Invalid OTP", success: false, statusCode: 400 });
      }
      return res.status(200).json({
        message: "Verify otp successfully",
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      // console.log(err, "Error ");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async resetUserPassword(req, res) {
    try {
      let password = req.body.password;
      let emailData = "";

      if (req.body.email) {
        let email = req.body?.email?.trim();
        emailData = email;
        let emailExist = await UserModel.findOne({
          where: { email: emailData },
          attributes: ["email", "id", "password"],
        });
        if (!emailExist) {
          return res.status(400).json({
            message: "User not found",
            success: false,
            statusCode: 400,
          });
        }
        let checkpassword = await bcrypt.compare(
          password,
          emailExist?.password
        );
        if (checkpassword) {
          return res.status(400).json({
            message: "Password must be unique, previous password not allowed",
            statusCode: 400,
            success: false,
          });
        }
      } else {
        let _secrate = req?.cookies?._token;
        const proof = jwt.verify(_secrate, process.env.JWT_SECRET, {
          algorithm: "HS512",
        });
        emailData = proof?.email;
      }
      // console.log(emailData,"emailDataemailDataemailDataemailData")

      let hashPassword = await bcrypt.hash(password, salt);
      await UserModel.update(
        { password: hashPassword },
        { where: { email: emailData } }
      );
      return res.status(200).json({
        message: "Password change successfully",
        success: true,
        statusCode: 200,
      });
    } catch (err) {
      // console.log(err, "Error");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getAllUSerData(req, res) {
    try {
      let fetchArray = await UserModel.findAll();
      res
        .status(200)
        .json({
          message: "fetch user data",
          data: fetchArray,
          success: true,
          statusCode: 200,
        });
      return;
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async updateUserDetails(id, data, res) {
    try {
      UserModel.update(data, { where: { id: id } })
        .then((response) => {
          return res
            .status(201)
            .json({ success: true, message: "values updated" });
        })
        .catch((error) => {
          return res
            .status(500)
            .json({ success: false, message: error?.message });
        });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }

  async getUserAccountInfo(req, res) {
    try {
      const carts = await CartModel.count({
        where: { user_id: req.userData.id },
      });
      const wishlists = await WishlistModel.count({
        where: { user_id: req.userData.id },
      });
      const coupons = await CouponModel.count();
      return res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        data: { carts, wishlists, coupons },
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
}

const UserServicesObj = new UserServices();
export default UserServicesObj;
