import { BestSellerSchema } from "../../helpers/validateBestSeller.js";
import DashboardDataServicesObj from "../../services/admin/DashboardDataServices.js";

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};
import { Sequelize } from "sequelize";

class DashboardDataController {
  async get_data(req, res) {
    try {
      DashboardDataServicesObj?.getDashboardData(req, res);
    } catch (error) {
      console.log(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async get_order_data(req, res) {
    try {
      DashboardDataServicesObj?.get_order_variant_count_data(req, res);
    } catch (error) {
      console.log(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async get_user_data(req, res) {
    try {
      let filters = {};
      const today = new Date();
      let fromDate;
      let toDate;
      if (req.query.today) {
        const startDateToday = new Date(today);
        startDateToday.setHours(0, 0, 0, 0); // Set to the start of today
        fromDate = startDateToday
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format

        const endDateToday = new Date();
        endDateToday.setHours(23, 59, 59, 999); // Set to the end of today
        toDate = endDateToday
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
      }

      if (req.query.this_week) {
        const startOfLastSevenDays = new Date(today);
        startOfLastSevenDays.setUTCHours(0, 0, 0, 0);
        startOfLastSevenDays.setUTCDate(today.getUTCDate() - 6); // Subtract 6 days to get the start of the last seven days
        fromDate = startOfLastSevenDays
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
        const endOfToday = new Date(today);
        endOfToday.setUTCHours(23, 59, 59, 999);
        toDate = endOfToday
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
      }

      if (req.query.this_month) {
        const today = new Date();
        const startOfLast30Days = new Date(today);
        startOfLast30Days.setUTCDate(today.getUTCDate() - 29); // Subtract 29 days to get the start of the last 30 days
        startOfLast30Days.setUTCHours(0, 0, 0, 0); // Set to the start of the day

        fromDate = startOfLast30Days
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
        const endOfToday = new Date(today);
        endOfToday.setUTCHours(23, 59, 59, 999); // Set to the end of today

        toDate = endOfToday
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
      }

      // Filter for this year
      if (req.query.this_year) {
        const today = new Date();
        const startOfLast365Days = new Date(today);
        startOfLast365Days.setUTCDate(today.getUTCDate() - 364); // Subtract 364 days to get the start of the last 365 days
        startOfLast365Days.setUTCHours(0, 0, 0, 0); // Set to the start of the day

        fromDate = startOfLast365Days
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
        const endOfToday = new Date(today);
        endOfToday.setUTCHours(23, 59, 59, 999); // Set to the end of today

        toDate = endOfToday
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
      }
      filters.fromDate = fromDate;
      filters.toDate = toDate;
      DashboardDataServicesObj?.getUserData(req, res, filters);
    } catch (error) {
      console.log(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }

  async get_best_seller_product(req, res) {
    try {
      if (!req.query.country_code) {
        return res.status(400).json({
          message: "Country_code is mandatory",
          statusCode: 400,
          success: false,
        });
      }
      let filters = {};
      const today = new Date();
      let fromDate;
      let toDate;
      if (req.query.today) {
        const startDateToday = new Date(today);
        startDateToday.setHours(0, 0, 0, 0); // Set to the start of today
        fromDate = startDateToday
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format

        const endDateToday = new Date();
        endDateToday.setHours(23, 59, 59, 999); // Set to the end of today
        toDate = endDateToday
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
      }

      if (req.query.this_week) {
        const startOfLastSevenDays = new Date(today);
        startOfLastSevenDays.setUTCHours(0, 0, 0, 0);
        startOfLastSevenDays.setUTCDate(today.getUTCDate() - 6); // Subtract 6 days to get the start of the last seven days
        fromDate = startOfLastSevenDays
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
        const endOfToday = new Date(today);
        endOfToday.setUTCHours(23, 59, 59, 999);
        toDate = endOfToday
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
      }

      if (req.query.this_month) {
        const today = new Date();
        const startOfLast30Days = new Date(today);
        startOfLast30Days.setUTCDate(today.getUTCDate() - 29); // Subtract 29 days to get the start of the last 30 days
        startOfLast30Days.setUTCHours(0, 0, 0, 0); // Set to the start of the day

        fromDate = startOfLast30Days
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
        const endOfToday = new Date(today);
        endOfToday.setUTCHours(23, 59, 59, 999); // Set to the end of today

        toDate = endOfToday
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
      }

      // Filter for this year
      if (req.query.this_year) {
        const today = new Date();
        const startOfLast365Days = new Date(today);
        startOfLast365Days.setUTCDate(today.getUTCDate() - 364); // Subtract 364 days to get the start of the last 365 days
        startOfLast365Days.setUTCHours(0, 0, 0, 0); // Set to the start of the day

        fromDate = startOfLast365Days
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
        const endOfToday = new Date(today);
        endOfToday.setUTCHours(23, 59, 59, 999); // Set to the end of today

        toDate = endOfToday
          .toISOString()
          .slice(0, 19)
          .replace("T", " "); // Convert to MySQL TIMESTAMP format
      }
      filters.fromDate = fromDate;
      filters.toDate = toDate;

      DashboardDataServicesObj?.getBestSellerProductWithDetails(
        req,
        res,
        filters
      );
    } catch (error) {
      console.log(error, "Error ");
      return res
        .status(500)
        .json({ message: error?.message, success: false, statusCode: 500 });
    }
  }
}

const DashboardControllerObj = new DashboardDataController();
export default DashboardControllerObj;
