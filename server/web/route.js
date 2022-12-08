import express from 'express';
import "dotenv/config";
import EventsHelper from "../helpers/EventsHelper.js";
//import controllers here
import PaymentController from "../controllers/PaymentController.js";
import Shops from "../controllers/Shops.js";
import ContactUsController from "../controllers/ContactUsController.js";
import PaymentsModel from "../models/PaymentsModel.js";
import ThemeController from '../controllers/ThemeController.js';
import ProductController from '../controllers/ProductController.js';
import OfferController from '../controllers/OfferController.js';
import RecommendedController from '../controllers/RecommendedController.js';
import RecentlyController from '../controllers/RecentlyController.js';
import FrequentlyController from '../controllers/FrequentlyController.js';
import PostPurchaseController from '../controllers/PostPurchaseController.js';
import shopValidate from "../middleware/shopValidate.js";
const route = express.Router();

route.use(shopValidate);// filter request for x-auth-shop

EventsHelper.on('shop/uninstalled', (data) => {
   PaymentsModel.updateOneByShop(data.shop,{
      status: "pending"
   }, function(error, payment_udpated){});
 
   // update database when uninstall the app
});



// recommendations

route.post("/merchant/recommendations/update", RecommendedController.update);
route.get("/merchant/recommendations/get", RecommendedController.get);

route.get("/merchant/shop_summary", OfferController.shopSummary);
route.get("/merchant/offer_summary", OfferController.offerSummary);
route.get("/merchant/product_summary", OfferController.offerSummaryByProduct);

// recently 

route.post("/merchant/recently/update", RecentlyController.update);
route.get("/merchant/recently/get", RecentlyController.get);

// Frequently Bought

route.put("/merchant/frequently-bought/status", FrequentlyController.frequentlyStatus);
route.get("/merchant/frequently-bought", FrequentlyController.getFrequentlyBought);
route.get("/merchant/frequently-bought-shop", FrequentlyController.getFrequentlyBoughtShop);
route.post("/merchant/add_frequently", FrequentlyController.createFrequentlyBought);
route.delete("/merchant/frequently-bought/delete", FrequentlyController.deleteFrequentlyBought);
route.get("/merchant/frequently-bought/edit", FrequentlyController.getOneFrequently);
route.put("/merchant/frequently-bought/update", FrequentlyController.updateOneFrequently);
route.get("/merchant/frequently-bought/frequently_summary/", FrequentlyController.frequentlyStats);
route.get("/merchant/shop_summary_frequently", FrequentlyController.shopSummaryFrequently);
 
route.get("/merchant/shop_plan", PaymentController.plan);

   
// offer  

route.put("/merchant/offer/status", OfferController.offerStatus);
route.post("/merchant/add_offer", OfferController.createOffer); 
route.get("/merchant/offers", OfferController.getOffers);
route.get("/merchant/get_offer", OfferController.stats);
route.delete("/merchant/delete_offer", OfferController.delete);
route.get("/merchant/edit_offer", OfferController.getOffer);
route.put("/merchant/update_offer", OfferController.updateOffer);
route.delete("/merchant/offers/delete", OfferController.deleteOffer);

// Post Purchase  

route.put("/merchant/post_purchase/status", PostPurchaseController.postPurchaseStatus);
route.post("/merchant/add_post_purchase", PostPurchaseController.createPostPurchase);
route.get("/merchant/post_purchases", PostPurchaseController.getPostPurchases);
route.get("/merchant/get_post_purchase", PostPurchaseController.stats);
route.delete("/merchant/delete_post_purchase", PostPurchaseController.delete);
route.get("/merchant/post_purchase/edit", PostPurchaseController.getPostPurchase);
route.put("/merchant/update_post_purchase", PostPurchaseController.updatePostPurchase);
route.delete("/merchant/post_purchases/delete", PostPurchaseController.deletePostPurchase); 

route.get("/merchant/shop_post_purchase", PostPurchaseController.shopSummary);
route.get("/merchant/post_purchase_summary", PostPurchaseController.postPurchaseSummary);
route.get("/merchant/product_summary", PostPurchaseController.postPurchaseSummaryByProduct);

route.post("/merchant/get_post_bundle", PostPurchaseController.getPostBundle);
// product

route.get("/product/id.json",ProductController.id);
route.get("/product/handle.json",ProductController.handle);
route.get("/shop/get.json", Shops.index);
route.post("/shop/create.json", Shops.store);
route.put("/shop/update.json", Shops.udpate);
route.delete("/shop/delete.json", Shops.delete);    
 
// contact
route.get("/contact/get.json", ContactUsController.get);
route.post("/contact/create.json", ContactUsController.store);
route.put("/contact/update.json", ContactUsController.udpate);
route.delete("/contact/delete.json", ContactUsController.delete);

// payment

route.get("/payment/invoice.json", PaymentController.createInvoice);
route.get("/payment/invoice/accept.json", PaymentController.invoiceCallback);
route.get("/payment/get.json", PaymentController.get);
route.get("/payment/status.json", PaymentController.status);
route.post("/payment/create.json", PaymentController.store);
route.put("/payment/update.json", PaymentController.udpate);
route.delete("/payment/delete.json", PaymentController.delete);

//theme

route.get("/themes/all.json", ThemeController.themes);
route.get("/themes/status.json", ThemeController.status);
route.post("/themes/install.json", ThemeController.install);
route.post("/themes/uninstall.json", ThemeController.uninstall);

export default route;