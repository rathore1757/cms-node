import Joi from "joi";
import jwt from "jsonwebtoken";

export const addProductchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(50)
    .trim()
    .required()
    .label("Title"),
  sku: Joi.string()
    .required()
    .label("sku"),
  summary: Joi.string()
    .min(10)
    .max(500)
    .trim()
    .required()
    .label("Summary"),
  description: Joi.string()
    .min(10)
    .max(3000)
    .trim()
    .required()
    .label("description"),
  cat_id: Joi.string()
    .trim()
    .required()
    .label("category"),
  shape_id: Joi.string()
    .trim()
    .required()
    .label("shape"),
  material_id: Joi.string()
    .trim()
    .required()
    .label("material_id"),
  description: Joi.string()
    .min(10)
    .max(325)
    .trim()
    .required()
    .label("description"),
  gender: Joi.array()
    .items(Joi.string().trim())
    .required()
    .label("Gender"),
  weight_group_id: Joi.string()
    .trim()
    .required(),
  size_id: Joi.string()
    .trim()
    .required(),
  frame_width: Joi.string().custom((value, helpers) => {
    if (value < 0) {
      return helpers.message("frame_width cannot be negative");
    }
    return value;
  }),
  lens_width: Joi.string()
    .trim()
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("lens_width cannot be negative");
      }
      return value;
    }),
  lens_height: Joi.string()
    .trim()
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("lens_height cannot be negative");
      }
      return value;
    }),
  bridge_width: Joi.string()
    .trim()
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("bridge_width cannot be negative");
      }
      return value;
    }),
  temple_length: Joi.string()
    .trim()
    .custom((value, helpers) => {
      if (value < 0) {
        return helpers.message("temple_length cannot be negative");
      }
      return value;
    }),
  // variantData: Joi.array()
  //   .min(1)
  //   .items(
  //     Joi.object({
  //       color_id: Joi.string()
  //         .trim()
  //         .required(),
  //     })
  //   )
  //   .required()
  //   .label("Variant Data"),
});

export const editProductchema = Joi.object({
  title: Joi.string()
    .min(3)
    .max(50)
    .trim()
    .label("Title"),
  sku: Joi.string()
    .trim()
    .label("sku"),
  summary: Joi.string()
    .min(10)
    .max(125)
    .trim()
    .label("Summary"),
  product_id: Joi.string()
    .trim()
    .required()
    .label("product_id"),
  description: Joi.string()
    .min(10)
    .max(325)
    .trim()
    .label("description"),
  gender: Joi.array()
    .items(Joi.string().trim())
    .label("Gender"),
});

export const addProductVariantchema = Joi.object({
  product_id: Joi.string()
    .required()
    .label("Product id"),
  color_id: Joi.string()
    .required()
    .label("color id"),

  // variantData: Joi.array()
  //   .min(1)
  //   .items(
  //     Joi.object({
  //       color_id: Joi.string()
  //         .trim()
  //         .required(),
  //     }).required()
  //   )
  //   .required()
  //   .label("Variant Data"),
});

export const editProductVariantchema = Joi.object({
  variant_id: Joi.string()
    .required()
    .label("variant_id"),
});

export const addProductVariantImageschema = Joi.object({
  product_id: Joi.string()
    .required()
    .label("Product id"),
  variant_id: Joi.string()
    .required()
    .label("Variant id"),
});

export const editProductVariantImageschema = Joi.object({
  variantImageName: Joi.string()
    .required()
    .label("varaintImageName"),
  variant_id: Joi.string()
    .required()
    .label("Variant id"),
});

export const addProductVariantStockschema = Joi.object({
  // product_id: Joi.string()
  //   .required()
  //   .label("product_id"),
  variant_id: Joi.string()
    .required()
    .label("variant_id"),
  country_code: Joi.string()
    .required()
    .label("country_code"),
  stock: Joi.number()
    .required()
    .custom((value, helpers) => {
      if (value <= 0) {
        return helpers.message("Stock cannot be negative or zero");
      }
      return value;
    })
    .label("stock"),
});

export const addProductCountryschema = Joi.object({
  variant_id: Joi.string()
    .required()
    .label("variant_id"),
  country_code: Joi.string()
    .required()
    .label("country_code"),
  price: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (value <= 0) {
        return helpers.message("Price cannot be negative or zero");
      }
      return value;
    })
    .label("price"),
  // country: Joi.string()
  //   // .required()
  //   .label("country"),
  discount: Joi.number()
    .required()
    .custom((value, helpers) => {
      if (value <= 0) {
        return helpers.message("Disocunt cannot be negative or zero");
      }
      return value;
    })
    .label("discount"),
  // currency_symbol: Joi.string()
  //   // .required()
  //   .label("currency_symbol"),
  status: Joi.string()
    .valid("active", "inactive")
    .label("status"),
  stock: Joi.number()
    .required()
    .custom((value, helpers) => {
      if (value <= 0) {
        return helpers.message("Stock cannot be negative or zero");
      }
      return value;
    })
    .label("stock"),
});

export const addProductCountryOnlyschema = Joi.object({
  variant_id: Joi.string()
    .required()
    .label("variant_id"),
  country_data: Joi.array()
    .items(
      Joi.object({
        country_code: Joi.string()
          .required()
          .label("country_code"),
        country: Joi.string()
          .required()
          .label("country"),
        currency_symbol: Joi.string()
          .required()
          .label("currency_symbol"),
        status: Joi.string()
          .valid("active", "inactive")
          .label("status"),
      })
    )
    .min(1)
    .required()
    .label("country_details"),
});

export const editVariantCountryStatusschema = Joi.object({
  variant_id: Joi.string()
    .required()
    .label("variant_id"),
  country_code: Joi.string()
    .required()
    .label("country_code"),
  status: Joi.string()
    .valid("active", "inactive")
    .label("status"),
});
