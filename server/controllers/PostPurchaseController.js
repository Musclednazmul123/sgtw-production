import Controller from '../app/Controller.js';
import PostPurchaseStatsModel from '../models/PostPurchaseStatsModel.js';
import PostPurchaseModel from '../models/PostPurchaseModel.js';
import UUID from "../helpers/UUID.js";
import { createMetafield } from '../helpers/MetafieldHelper.js';
import { deleteMetafield } from '../helpers/MetafieldHelper.js';
import { updateMetafield } from '../helpers/MetafieldHelper.js';

class PostPurchaseController extends Controller {
    
    createPostPurchase(req, res){
        var metaKey = UUID.short();
        var metafield = {
            "metafield" : {
                namespace: "post_purchase",
                key: metaKey,
                value: JSON.stringify(
                    {
                        uid: metaKey,
                        matching_products: req.body.matching_products,
                        trigger_products: req.body.trigger_products,
                        trigger_tags: req.body.trigger_tags,
                        trigger_type: req.body.trigger_type
                    }
                ),
                type: "json"  
            }
        };
        createMetafield(req.query.shop, metafield, function (error, metafield_response) {
            if (metafield_response && metafield_response.body && metafield_response.body.metafield) {
                const {  id, key } = metafield_response.body.metafield;
                req.body["metafield"] = {
                    id: id,
                    key: key
                };
                req.body["uid"] = metaKey;
                PostPurchaseModel.store(req.body, function (error, success) {
                    return res.send({error, success});
                });
            }
            else{ // display error
                return res.send({
                    error: error,
                    status: 0
                });
            }
        });
    }

    deletePostPurchase(req, res){
        const { id, shop } = req.query;
        PostPurchaseModel.get(id, function(error, data){
            if(data && data.metafield && data.metafield.id){
                deleteMetafield(shop, data.metafield.id, function(error, deleted){
                   
                    if(deleted){
                        PostPurchaseModel.delete(id, function(error, deleted){
                            PostPurchaseStatsModel.deleteByUid(data.uid, function(error, deleted){
                                return res.send({
                                    error, deleted
                                });
                            });
                        });
                    }
                    else{
                        PostPurchaseModel.delete(id, function(error, deleted){
                            PostPurchaseStatsModel.deleteByUid(data.uid, function(error, deleted){
                                return res.send({
                                    error, deleted
                                });
                            });
                        });
                    }
                });    
            }
            else{ 
                PostPurchaseModel.delete(id, function(error, deleted){
                    PostPurchaseStatsModel.deleteByUid(data.uid, function(error, deleted){
                        return res.send({
                            error, deleted
                        });
                    });
                }); 
            }
        });
    }

    delete(req, res){
        const { id, shop } = req.query;
        deleteMetafield(shop, id, function(error, deleted){
            res.send({
                error, deleted
            });
        });
    }
 
    getPostPurchases(req, res) {
        const { shop } = req.query;
        PostPurchaseModel.paginate(req, function(error, data){
            if(data){
                return res.send(data);
            }
            else{
                return res.send({
                    error: error, 
                    status: 0
                });
            }
        });
    }

    getPostPurchase(req, res){
        PostPurchaseModel.get(req.query.id, function(error, data){
            if(data){
                return res.send(data);
            }
            else{
                return res.send({
                    error: error,
                    status: 0
                });
            }
        });
    }

    updatePostPurchase(req, res){
        const { id, shop } = req.query;
        PostPurchaseModel.get(id, function(error, data){
            if(data && data.metafield && data.metafield.id){
                var params_update = {
                    "metafield" : {
                        id: data.metafield.id,
                        key: data.metafield.key,
                        value: JSON.stringify(
                            {
                                uid: data.uid,
                                upsell_in_cart: req.body.upsell_in_cart,
                                upsell_product_page: req.body.upsell_product_page,
                                upsell_post_purchase: req.body.upsell_post_purchase,
                                matching_products: req.body.matching_products,
                                trigger_products: req.body.trigger_products,
                                trigger_tags: req.body.trigger_tags,
                                trigger_type: req.body.trigger_type
                            }
                        ) 
                    }
                };
                updateMetafield(shop, data.metafield.id, params_update, function(error, updated){
                    if(updated){
                        req.body["metafield"] = {
                            id: data.metafield.id,
                            key: data.metafield.key
                        };
                        PostPurchaseModel.updateOne({_id: id}, req.body, function(error, saved) {
                            return res.send({
                                error, saved
                            });
                        });
                    }
                });
            }
            else{
                return res.send({
                    error, data
                });
            }
        });
    }
    stats(req, res){
        PostPurchaseModel.get(req.query.id, function(error, data){
            if(data){
                var conversion = Math.round(data.clicks/data.views);
                var stats = {
                    views: data.views,
                    clicks: data.clicks,
                    conversion: conversion,
                    conversion_rate: Number(conversion) * 10
                };
                return res.send(stats);
            }
            else{
                return res.send({
                    error: error,
                    status: 0
                });
            }
        });
    }

    AddView(req, res) {
        console.log(req.body)
        const { shop, uid, product_id } = req.body;
        PostPurchaseStatsModel.queryOne({
            uid: uid
        }, function(error, offer_data){
            if (offer_data && offer_data.matching_products) {
                var mp =  offer_data.matching_products.map(product => {
                    if(product.id == product_id){
                        product.views += 1; 
                    }
                    return product;
                });
                offer_data["matching_products"] = mp;
                offer_data["views"] += 1;
                PostPurchaseStatsModel.updateByUid(uid, offer_data, function(error, success){
                    return res.send(
                        {error, success}
                    );
                });
            }
            else{
                return res.send(
                    {
                        satus: 404,
                        message: "not found"
                    }
                );
            }
        });
    }

    postAddedCart(req, res){
        const { shop, uid, product_id } = req.body;
        req.body["clicks"] = 1;
        req.body["views"] = 0;
        req.body["type"] = "click";
        PostPurchaseStatsModel.store(req.body, function (error, success) {
            if(success){
                console.log("CLICKS ADDED SUCCESS");
                return res.send({success});
            }
            else{
                return res.send(
                    {
                        satus: 404,
                        message: "not found"
                    }
                );
            }
        });
    }
    postAddView(req, res){
        req.body["views"] = 1;
        req.body["clicks"] = 0;
        req.body["type"] = "view";
        req.body["product_price"] = 0;
        PostPurchaseStatsModel.store(req.body, function (error, success) {
            if(success){
                console.log("VIEWS ADDED SUCCESS");
                return res.send({success});
            }
            else{
                return res.send(
                    {
                        satus: 404,
                        message: "not found"
                    }
                );
            }
        });
    }

    shopSummary(req, res){
        PostPurchaseModel.aggregateByShop(req.query.shop,function(error,stats){ 
            if(stats && stats.length > 0){
                // return res.send({
                //     stats
                // });
                var conversion = Number(Number(stats[0].clicks / stats[0].views).toFixed(2));
                return res.send(
                    {
                        conversion: conversion,
                        conversion_rate: Number(Number(conversion * stats[0].price).toFixed(2)),
                        views: stats[0].views,
                        clicks: stats[0].clicks
                    }
                );
            }
            else{
                return res.send(
                    {
                        conversion: 0,
                        conversion_rate: 0,
                        views: 0,
                        clicks: 0,
                        debug: stats
                    }
                );
            }
        });
    }

    postPurchaseSummary(req, res){
        PostPurchaseModel.getByUid(req.query.uid, function(error, data){
            PostPurchaseStatsModel.aggregateByUid(req.query.uid, function(error,stats){ 
                if(stats && stats.length > 0){
                    // return res.send({
                    //     stats
                    // }); 
                    var conversion = Number(Number(stats[0].clicks / stats[0].views).toFixed(2));
                    return res.send(
                        {
                            offer_name: data.name,
                            conversion: conversion,
                            conversion_rate: Number(Number(conversion * stats[0].price).toFixed(2)),
                            views: stats[0].views,
                            clicks: stats[0].clicks
                        }
                    );
                }
                else{ 
                    PostPurchaseModel.getByUid(req.query.uid, function(error, data){
                        return res.send(
                            {
                                offer_name: data.name,
                                conversion: 0,
                                conversion_rate: 0,
                                views: 0,
                                clicks: 0,
                                debug: stats
                            }
                        );
                    });
                }
            });
        });
    }

    postPurchaseSummaryByProduct(req, res){
        PostPurchaseModel.aggregateByProductId(req.query.product_id,function(error,stats){ 
            if(stats && stats.length > 0){
                // return res.send({
                //     stats
                // });
                var conversion = Number(Number(stats[0].clicks / stats[0].views).toFixed(2));
                return res.send(
                    {
                        conversion: conversion,
                        conversion_rate: Number(Number(conversion * stats[0].price).toFixed(2)),
                        views: stats[0].views,
                        clicks: stats[0].clicks
                    }
                );
            }
            else{
                return res.send(
                    {
                        conversion: 0,
                        conversion_rate: 0,
                        views: 0,
                        clicks: 0,
                        debug: stats
                    }
                );
            }
        });
    }

    postPurchaseStatus(req, res){
        const {id, uid} = req.body;
        if(req.body.active == true){
            PostPurchaseModel.get(id, function(error, data){
                var params_update = {
                    "metafield" : {
                        namespace: "post_purchase",
                        key: data.uid,
                        type: "json",
                        value: JSON.stringify(
                            {
                                uid: data.uid,
                                upsell_in_cart: data.upsell_in_cart,
                                upsell_product_page: data.upsell_product_page,
                                upsell_post_purchase: data.upsell_post_purchase,
                                matching_products: data.matching_products,
                                trigger_products: data.trigger_products,
                                trigger_tags: req.body.trigger_tags,
                                trigger_type: req.body.trigger_type
                            }
                        )
                    }
                };

                createMetafield(data.shop, params_update, function(error, updated){
                    if(updated){
                        req.body["metafield"] = {
                            id: updated.body.metafield.id,
                            key: updated.body.metafield.key
                        };
                        PostPurchaseModel.updateOne(id, req.body, function(error, saved) {
                            return res.send({
                                error, saved
                            });
                        }); 
                    }
                    else{
                        return res.send("ok");
                    }
                });
            });
        }
        else{
            PostPurchaseModel.get(id, function(error, data){
                // return res.send({
                //     error, data
                // });
                deleteMetafield(data.shop, data.metafield.id, function(error, deleted){
                    if(deleted){
                        const {id, uid} = req.body;
                        req.body["metafield"] = null;
                        PostPurchaseModel.updateOne(id, req.body, function(error, saved) {
                            if(saved){
                                return res.send({
                                    error, saved
                                });
                            } 
                            else{
                                return res.send(
                                    {
                                        satus: 404,
                                        message: "not found"
                                    } 
                                );
                            }
                        });
                    }
                    else{
                        return res.send(
                            {
                                satus: 404,
                                message: "not found"
                            }
                        );
                    }
                });
            });
        }
    }

    getPostBundle(req, res){
        PostPurchaseModel.findPost(req, function(error, data){
            return res.send(data);
        });
    }
} 

export default new PostPurchaseController();