import ProductModel from "../../models/ProductModel.js";
import ProductVariantModel from "../../models/ProductVariantModel.js";
import WishlistModel from "../../models/WishlistModel.js";
import dbConnection from "../../config/dbConfig.js";
import filterProduct from "../../models/filterDataModel.js";

class WishlistService {
  async AddToWishlist(req, res) {
    try {
      const { product_id } = req.query;

      if (!product_id) {
        return res.status(400).json({
          message: "Product data is Required",
          success: false,
          statusCode: 400,
        });
      } else {
        const user_id = req.id;
        const existCheck = await WishlistModel.findOne({
          where: { user_id, product_id },
        });
        if (existCheck) {
          await WishlistModel.destroy({
            where: {
              user_id: user_id,
              product_id,
            },
          });

          return res.status(200).json({
            success: true,
            message: "Product removed from wishlist successfully",
            statusCode: 200,
          });
        } else {
          let obj = {
            user_id,
            product_id,
          };
          await WishlistModel.create(obj, { raw: true });
          return res.status(201).json({
            message: "Product wishlisted successfully",
            success: true,
            statusCode: 201,
          });
        }
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }

  async getShorlistedData(req, res) {
    try {
      const user_id = req.id;
      if (!user_id) {
        return res.status(404).json({
          message: " Data Not Found",
          statusCode: 404,
          success: false,
        });
      }

      //       let query = `SELECT wishlists.*,  product_variants.variant_name, product_variants.thumbnail_url ,product_variants.variant_price,
      //       products.base_price
      //       FROM wishlists
      //       LEFT JOIN product_variants ON wishlists.product_variant_id = product_variants.variant_id
      //       LEFT JOIN products ON wishlists.product_id = products.id;
      // `;
      //correct below
      //       let query = `SELECT
      //       wishlists.*,
      //       products.title AS product_title,
      //       products.thumbnail_img AS product_thumbnail,
      //       products.condition AS product_condition,
      //       product_variants.variant_name,
      //   product_variants.thumbnail_url AS variant_thumbnail,
      //   -- product_variants.variant_price,
      //   product_variants.sku,
      //  -- product_variants.weight,
      //   product_variants.is_available AS variant_is_available,
      //   product_variants.color_id AS variant_color_id,
      //   product_variants.variant_price_details,
      //   product_variants.material_id AS variant_material_id,
      //   product_variants.is_featured AS variant_is_featured,
      //   product_variants.status AS variant_status,
      //   product_variants.weight_group_id,
      //   product_variants.size_id
      //     FROM
      //       wishlists
      //     LEFT JOIN
      //       products ON wishlists.product_id = products.id
      //       LEFT JOIN
      //       product_variants ON wishlists.product_id = product_variants.product_id;
      // `;
      let query = `
SELECT
  wishlists.user_id,
  products.id AS product_id,
  products.title AS product_title,
  products.thumbnail_img AS product_thumbnail,
  products.condition AS product_condition,
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'variant_name', product_variants.variant_name,
      'thumbnail_url', product_variants.thumbnail_url,
      'sku', product_variants.sku,
      'is_available', product_variants.is_available,
      'color_id', product_variants.color_id,
      'variant_price_details', product_variants.variant_price_details,
     -- 'material_id', product_variants.material_id,
      'is_featured', product_variants.is_featured,
      'status', product_variants.status,
     -- 'weight_group_id', product_variants.weight_group_id,
      'size_id', product_variants.size_id
    )
  ) AS variants
FROM
  wishlists
LEFT JOIN
  products ON wishlists.product_id = products.id
LEFT JOIN
  product_variants ON wishlists.product_id = product_variants.product_id
WHERE
  wishlists.user_id = ${req.id}
GROUP BY
  wishlists.user_id, products.id;
`;

      let productList = await dbConnection.query(query, {
        type: dbConnection.QueryTypes.SELECT,
      });

      let get = await filterProduct.findAll();
      let colorArray = get[0]?.color;

      if (productList && productList?.length) {
        let i = 0;
        for (let ele of productList) {
          if (req.query && req.query.country_code !== "") {
            // console.log(req.query.country_code, "req.query.country_code,");
            ele.variants = ele.variants?.map((variant) => {
              if (variant.variant_price_details) {
                let filterData = variant?.variant_price_details.filter(
                  (detail) => detail?.country_code === req?.query?.country_code
                );

                variant.variant_price_details = filterData;
              }
              return variant;
            });
          }
          // let existcheck = colorArray.find((el) => el?.id == ele?.color_id);
          // ele.colorData = existcheck;
          // ele = JSON.parse(JSON.stringify(ele));
        }
      }
      return res.status(200).json({
        message: "Product Fetches successfully",
        success: true,
        statusCode: 200,
        data1: productList,
      });
    } catch (err) {
      console.log(err, "E delete");
      return res
        .status(500)
        .json({ message: err?.message, success: false, statusCode: 500 });
    }
  }
}

const WishListServicesObj = new WishlistService();
export default WishListServicesObj;
