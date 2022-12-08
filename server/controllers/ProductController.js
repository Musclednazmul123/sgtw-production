import { DataType } from "@shopify/shopify-api";
import { AdminApi } from "../helpers/Helper.js";
import { productByHandle } from "../helpers/ShopifyGraphQL.js";

class ProductController{
    id(req, res){
        AdminApi({
            shop: req.query.shop,
            type: "get",
            fetch: {
                path: "products/"+req.query.id,
                type: DataType.JSON
            }
        }, function(error, response){
            if (response && response.body && response.body.product) {
                return res.send(response.body);  
            }
            else{
                return res.send({
                    error,response
                });
            }
        });
    }
    handle(req, res){
        productByHandle(req.query.shop, req.query.handle, (error, product) => {
            return res.send({
                error: error,
                product: product
            });
        });
    }
}

export default new ProductController();