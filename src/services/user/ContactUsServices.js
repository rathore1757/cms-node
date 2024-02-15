import { sendQueryMailToUser } from "../../helpers/common.js";
import ContactUS from "../../models/ContactusModel.js";

class Contactus {
  async ContactUS(req, res) {
    try {
      // console.log(req.body.full_name);
      let full_name = req.body.full_name?.trim();
      let email = req.body.email?.trim();
      let phone = req.body.phone?.trim();
      let subject = req.body.subject?.trim();
      let message = req.body.message?.trim();

      const existCheck = await ContactUS.findOne({ where: { email } });
      if (existCheck) {
        return res.status(409).json({
          message: "Email Already Exist",
          success: false,
          statusCode: 409,
        });
      } else {
        const obj = {
          full_name,
          email,
          phone,
          subject,
          message,
        };
        // for smtp
        let data = {
          name: full_name,
          email,
          phone: phone,
        };
        const userData = await ContactUS.create(obj, { raw: true });
        if (userData) {
          await sendQueryMailToUser(res, data);
        }
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}

const ContactusObj = new Contactus();
export default ContactusObj;
