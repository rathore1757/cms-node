import { ContactUS } from "../../helpers/validateContactUs.js";
import ContactusObj from "../../services/user/ContactUsServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

class ContactUs {
  async ContactUs(req, res) {
    try {
      let { error } = ContactUS.validate(req?.body, options);
      if (error) {
        return res.status(400).json({
          message: error.details[0]?.message,
          success: false,
          statusCode: 400,
        });
      }

      ContactusObj.ContactUS(req, res);
    } catch (error) {
      console.log(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
}

const ContactUsObj = new ContactUs();
export default ContactUsObj;
