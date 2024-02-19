import fs from "fs";
import Location from "./src/models/LocationModel.js";
const jsonData = fs.readFileSync("./pincodes.json");
const data = JSON.parse(jsonData);
// console.log(data);
async function saveData() {
  const locationsArr = [];
  data.forEach(async (val) => {
    // let locationData = await Location.findOne({
    //   where: { pincode: val?.pincode },
    // });
    let dataObj = {};
    dataObj.office_name = val?.officeName;
    dataObj.pincode = val?.pincode;
    dataObj.taluk = val?.taluk;
    dataObj.district_name = val?.districtName;
    dataObj.state_name = val?.stateName;
    locationsArr.push(dataObj);
  });
  console.log(locationsArr);
  await Location.bulkCreate(locationsArr);
}
saveData();
