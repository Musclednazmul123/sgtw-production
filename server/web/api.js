import express from 'express';
import api_middleware from '../middleware/api.js';import { DataType } from '@shopify/shopify-api';
import "dotenv/config";
import OfferController from '../controllers/OfferController.js';
import FrequentlyController from '../controllers/FrequentlyController.js';
import PostPurchaseController from '../controllers/PostPurchaseController.js';
//import controllers here
const api = express.Router(); 
api.use("/api/*",api_middleware);
import { AdminApi } from '../helpers/Helper.js';
const PORT = parseInt(process.env.PORT || "3822", 10);

api.get("/api/test", (req, res) => {
    return res.send("Test api working...");
});

api.post("/api/v/1/add_view", OfferController.addView); 
api.post("/api/v/1/add_click", OfferController.addClick);
api.post("/api/v/1/add_frequently_view", FrequentlyController.frequentlyAddView);
api.post("/api/v/1/frequently_added_cart", FrequentlyController.frequentlyAddedCart);
api.post("/api/v/1/add_post_purchase_view", PostPurchaseController.postAddView);
api.post("/api/v/1/post_purchase_added_cart", PostPurchaseController.postAddedCart);

api.post("/api/v/1/thankyou.js", function(req, res){
    var script_tag = {
        "script_tag" : {
            "src": process.env.HOST+"/pages/thankyou.js",
            "event": "onload",
            "display_scope": "order_status",
            "cache": false   
        }
    };
    AdminApi({
        shop: req.query.shop,
        type: "post",
        fetch: {
            path: "script_tags",
            data: script_tag,
            type: DataType.JSON
        }
    }, function(error, data){
        if(data){
            return res.send({data});
        }
        else{
            return res.send({
                error: error,
                status: 0
            });
        }
    });  
});

export default api;