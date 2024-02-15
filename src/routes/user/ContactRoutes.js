import express from "express";
import ContactUsObj from "../../controllers/user/ContactUsController.js";

const ContactUs = express.Router();

ContactUs.post("/query", ContactUsObj.ContactUs);

export default ContactUs;
