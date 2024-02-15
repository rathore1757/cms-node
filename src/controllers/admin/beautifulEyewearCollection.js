import beautifulEyewearCollectionServicesObj from "../../services/admin/beautifulEyewearCollectionServices.js";
import { BeautifulEyewearCollectionSchema } from "../../helpers/beautifulEyewearCollectionSchema.js";
const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};
class BeautifulEyewearCollection {
  async addBeautifulEyewearCollection(req, res) {
    const { error } = BeautifulEyewearCollectionSchema.validate(
      req.body,
      options
    );
    if (error) {
      return res.status(400).json({ success: false, message: error?.message });
    }
    beautifulEyewearCollectionServicesObj.addBeautifulEyewear(req, res);
  }
  async deleteBeautifulEyewearCollection(req, res) {
    beautifulEyewearCollectionServicesObj.deleteBeautifulEyewear(req, res);
  }
}
const beautifulEyewearCollectionControllerObj =
  new BeautifulEyewearCollection();
export default beautifulEyewearCollectionControllerObj;
