import Controller from '../app/Controller.js';
import FrequentlyModel from '../models/FrequentlyModel.js';
import StatsModel from '../models/StatsModel.js';
import FrequentlyStatsModel from '../models/FrequentlyStatsModel.js';

import UUID from "../helpers/UUID.js";
import { createMetafield } from '../helpers/MetafieldHelper.js';
import { deleteMetafield } from '../helpers/MetafieldHelper.js';
import { updateMetafield } from '../helpers/MetafieldHelper.js';

class FrequentlyController extends Controller {
      
    createFrequentlyBought(req, res){
        console.log(req.query.body); 
        var metaKey = UUID.short();
        var metafield = {
            "metafield" : {
                namespace: "upsell_frequently",
                key: metaKey, 
                value: JSON.stringify(
                    {
                        uid: metaKey,
                        upsell_in_cart: req.body.upsell_in_cart,
                        upsell_product_page: req.body.upsell_product_page,
                        upsell_post_purchase: req.body.upsell_post_purchase,
                        matching_products: req.body.matching_products,
                        trigger_products: req.body.trigger_products,
                        randomize: req.body.randomize
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
                FrequentlyModel.store(req.body, function (error, success) {
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

    deleteFrequentlyBought(req, res){
        const { id, shop } = req.query;
        FrequentlyModel.get(id, function(error, data){
            if(data && data.metafield && data.metafield.id){
                deleteMetafield(shop, data.metafield.id, function(error, deleted){
                    if(deleted){
                        FrequentlyModel.delete(id, function(error, deleted){
                            FrequentlyStatsModel.deleteByUid(data.uid, function(error, deleted){
                                return res.send({
                                    error, deleted
                                });
                            });
                        });
                    }
                    else{
                        FrequentlyModel.delete(id, function(error, deleted){
                            FrequentlyStatsModel.deleteByUid(data.uid, function(error, deleted){
                                return res.send({
                                    error, deleted
                                });
                            });
                        });
                    }
                });    
            }
            else{ 
                FrequentlyModel.delete(id, function(error, deleted){
                    FrequentlyStatsModel.deleteByUid(data.uid, function(error, deleted){
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

    getFrequentlyBought(req, res) {
        const { shop } = req.query;
        FrequentlyModel.paginate(req, function(error, data){
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

    getFrequentlyBoughtShop(req, res){
        const { shop } = req.query;
        FrequentlyModel.getAllByShop(shop, function(error, data){
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

    frequentlyStatus(req, res){
        const {id, uid} = req.body;
        if(req.body.active == true){
            FrequentlyModel.get(id, function(error, data){
                var params_update = {
                    "metafield" : {
                        namespace: "upsell_frequently",
                        key: data.uid,
                        type: "json",
                        value: JSON.stringify(
                            {
                                uid: data.uid,
                                upsell_in_cart: data.upsell_in_cart,
                                upsell_product_page: data.upsell_product_page,
                                upsell_post_purchase: data.upsell_post_purchase,
                                matching_products: data.matching_products,
                                trigger_products: data.trigger_products
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
                        FrequentlyModel.updateOne(id, req.body, function(error, saved) {
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
            FrequentlyModel.get(id, function(error, data){
                // return res.send({
                //     error, data
                // });
                deleteMetafield(data.shop, data.metafield.id, function(error, deleted){
                    if(deleted){
                        const {id, uid} = req.body;
                        req.body["metafield"] = null;
                        FrequentlyModel.updateOne(id, req.body, function(error, saved) {
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

    getOneFrequently(req, res){ 
        FrequentlyModel.get(req.query.id, function(error, data){
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

    updateOneFrequently(req, res){
        const { id, shop } = req.query;
        FrequentlyModel.get(id, function(error, data){
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
                                randomize: req.body.randomize
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
                        FrequentlyModel.updateOne({_id: id}, req.body, function(error, saved) {
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
        OffersModel.get(req.query.id, function(error, data){
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

    frequentlyAddedCart(req, res){
        req.body["views"] = 0;
        req.body["clicks"] = 1;
        req.body["type"] = "added_to_cart";
        FrequentlyStatsModel.store(req.body, function (error, success) {
            if(success){
                console.log("STATS ADDED SUCCESS"); 
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

    frequentlyAddView(req, res){
        req.body["views"] = 1;
        req.body["clicks"] = 0;
        req.body["type"] = "view"; 
        req.body["product_price"] = 0;
        FrequentlyStatsModel.store(req.body, function (error, success) {
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
 
    shopSummaryFrequently(req, res){ 
        FrequentlyStatsModel.aggregateByShop(req.query.shop,function(error,stats){ 
            if(stats && stats.length > 0){
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
        // StatsModel.getAllByShop(req.query.shop, function(error, stats){
        //     if(stats){
        //         console.log(stats);
        //         return res.send(stats);
        //     }
        //     else{ 
        //         return res.send(
        //             {
        //                 satus: 404,
        //                 message: "not found"
        //             }
        //         );
        //     }  
        // });
    }

    frequentlyStats(req, res){
        console.log(req.query.uid);
        FrequentlyModel.getByUid(req.query.uid, function(error, data){
            FrequentlyStatsModel.aggregateByUid(req.query.uid,function(error,stats){ 
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
                    FrequentlyModel.getByUid(req.query.uid, function(error, data){
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

    offerSummaryByProduct(req, res){
        StatsModel.aggregateByProductId(req.query.product_id,function(error,stats){ 
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
}

export default new FrequentlyController();