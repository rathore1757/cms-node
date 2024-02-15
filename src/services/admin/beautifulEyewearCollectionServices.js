import BeautifulEyewearCollection from "../../models/BeautifulEyewearCollection.js";
class BeautifulEyewearCollectionServices {
  async addBeautifulEyewear(req, res) {
    try {
      if (req.query.id) {
        let obj;
        if (req?.file?.filename) {
          obj = {
            name: req.body.name,
            slug: req.body.slug,
            image: req.file.filename,
          };
        } else {
          obj = {
            name: req.body.name,
            slug: req.body.slug,
          };
        }
        BeautifulEyewearCollection.update(obj, { where: { id: req.query.id } })
          .then((response) => {
            return res
              .status(201)
              .json({ success: true, message: "Values updated" });
          })
          .catch((error2) => {
            return res
              .status(500)
              .json({ success: false, message: error2?.message });
          });
      } else {
        const data = await BeautifulEyewearCollection.findOne({
          where: {
            name: req.body.name,
          },
          raw: true,
        });
        console.log(data);
        if (data) {
          return res
            .status(400)
            .json({ success: false, message: "Data already exist" });
        } else {
          BeautifulEyewearCollection.create({
            name: req.body.name,
            slug: req.body.slug,
            image: req.file.filename,
          })
            .then((response) => {
              return res
                .status(201)
                .json({ success: true, message: "New collection created" });
            })
            .catch((error1) => {
              return res
                .status(500)
                .json({ success: false, message: error1?.message });
            });
        }
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err?.message });
    }
  }
  async deleteBeautifulEyewear(req, res) {
    try {
      BeautifulEyewearCollection.destroy({ where: { id: req.params.id } })
        .then((response) => {
          return res
            .status(201)
            .json({ success: false, message: "deleted successfully" });
        })
        .catch((error1) => {
          return res
            .status(500)
            .json({ success: false, message: error1?.message });
        });
    } catch (error) {
      return res.status(500).json({ success: false, message: error?.message });
    }
  }
}

const beautifulEyewearCollectionServicesObj =
  new BeautifulEyewearCollectionServices();

export default beautifulEyewearCollectionServicesObj;
