import Controller from '../app/Controller.js';
import Shop from '../models/ShopModel.js';
import RecommendationModel from '../models/RecommendationModel.js';
import RecentlyModel from '../models/RecentlyModel.js';
import PostPurchaseStatsModel from '../models/PostPurchaseStatsModel.js';
import PostPurchaseModel from '../models/PostPurchaseModel.js';
import StatsModel from '../models/StatsModel.js';
import OffersModel from '../models/OffersModel.js';
import PaymentsModel from '../models/PaymentsModel.js';
import FrequentlyStatsModel from '../models/FrequentlyStatsModel.js';
import FrequentlyModel from '../models/FrequentlyModel.js';
import EventsHelper from "../helpers/EventsHelper.js";
import { Shopify } from '@shopify/shopify-api';
import { AdminApi } from '../helpers/Helper.js';
import { DataType } from '@shopify/shopify-api';

async function saveShopInfo(shop, accessToken){
    AdminApi({
        shop: shop,
        type: "post",
        fetch: {
            path: "webhooks",
            data: {
                "webhook": {
                    topic: "app/uninstalled",
                    address: process.env.HOST+"/webhook/callback/app/uninstall"
                }
            },
            type: DataType.JSON
        }
    }, function(errorsdf, webhook_sresponse){
        if (errorsdf) console.log("webhook_error already subscribed");
        if (webhook_sresponse && webhook_sresponse.body) {
            console.log("webhook_response", webhook_sresponse.body);
        }
    });
    const client = new Shopify.Clients.Rest(
        shop,
        accessToken
    );
    const response = await client.get({path: 'shop'});
    try {
        if (response && response.body && response.body.shop) {
            Shop.updateOneByShop(shop, {
                info: response.body.shop
            }, function(error, saved){
                if (error) {
                    console.log(error);
                    return error;
                }
                return saved;
            })
        }
    } catch (e) {
        return e;
    }
}

EventsHelper.on("app/installed", (data) => {
    const { shop, access_token, scope } = data;
    console.log("New installation", shop, access_token);
    if (shop, access_token) {
        saveShopInfo(shop, access_token).then(saved => {}).catch(error => { });
        RecommendationModel.count(shop, function(error, count){
            if (Number(count) === 0) {
                RecommendationModel.store({shop:shop}, function(e,s){ });
            }
        });
        RecentlyModel.count(shop, function(error, count){
            if (Number(count) === 0) {
                RecentlyModel.store({shop:shop}, function(e,s){ });
            }
        });
    }
    else{
        console.error("Missing parameters", data, " << app/installed >> App was installed by ", shop,);
    }
});

EventsHelper.on("shop/uninstalled", (data) => {
    const { shop } = data;
    console.log("App was removed from ", shop, ";time:", new Date());
    if (shop) {
        Shop.updateOneByShop(shop, {
            access_token: null,
            access_scope: null,
            $set: {
                updated_at: new Date(),
                uninstalled_at: new Date(),
                status: "uninstalled",
                setup_help_point: 1,
                setup_help: true,
                app_version: process.env.APP_VERSION || "1.0.0",
                enabled_features: {
                    upsell: true
                },
                exempt_billing: false
            },
            $inc: {
                __v: 1
            }
        }, function(s_error, s_success){
            if(s_error) console.log(s_error);
            
        });
        PaymentsModel.updateOneByShop(shop, {
            access_token: null,
            access_scope: null,
            $set: {
                updated_at: new Date(),
                charge_id: null,
                status: "pending",
                cancelled_on: new Date()
            },
            $inc: {
                __v: 1
            }
        }, function(s_error, s_success){
            if(s_error) console.log(s_error);
        });
        RecommendationModel.deleteAll(shop, function(error, deleted){});
        RecentlyModel.deleteAll(shop, function(error, deleted){});
        FrequentlyModel.deleteAll(shop, function(error, deleted){});
        FrequentlyStatsModel.deleteAll(shop, function(error, deleted){});
        OffersModel.deleteAll(shop, function(error, deleted){});
        StatsModel.deleteAll(shop, function(error, deleted){});
        PostPurchaseModel.deleteAll(shop, function(error, deleted){});
        PostPurchaseStatsModel.deleteAll(shop, function(error, deleted){});

        

    }
    else{
        console.error("Missing parameters", data, " << shop/uninstalled >> App was re-installed by ", shop,);
    }
});

EventsHelper.on("app/reinstalled", (data) => {
    const { shop, access_token, scope } = data;
    console.log("App was re-installed by ", shop, ";time:", new Date());
    if (shop, access_token) {
        saveShopInfo(shop, access_token).then(saved => {}).catch(error => { });
        RecommendationModel.count(shop, function(error, count){
            if (Number(count) === 0) {
                RecommendationModel.store({shop:shop}, function(e,s){ });
            }
        });
        RecentlyModel.count(shop, function(error, count){
            if (Number(count) === 0) {
                RecentlyModel.store({shop:shop}, function(e,s){ });
            }
        });
    }
    else{
        console.error("Missing parameters", data, " << app/reinstalled >> App was re-installed by ", shop,);
    }
});

EventsHelper.on("app/oauth/updated", (data) => {
    const { shop, access_token, scope } = data;
    console.log("App logged in ", shop, ";time:", new Date());
    if (shop, access_token) {
        saveShopInfo(shop, access_token).then(saved => {}).catch(error => { });
        RecommendationModel.count(shop, function(error, count){
            if (Number(count) === 0) {
                RecommendationModel.store({shop:shop}, function(e,s){ });
            }
        });
        RecentlyModel.count(shop, function(error, count){
            if (Number(count) === 0) {
                RecentlyModel.store({shop:shop}, function(e,s){ });
            }
        });
    }
    else{
        console.error("Missing parameters", data, " << app/oauth/updated >> App oauth token updated by ", shop,);
    }
});

class Shops extends Controller {
    OAuthCallBack(shop, access_token, scope) {
        if (shop, access_token) {
            Shop.count(shop, function(error, count){
                if (Number(count) === 0) { // new application installed
                    Shop.store({
                        shop: shop,
                        access_token: access_token,
                        access_scope: scope,
                    }, function(s_error, s_success){
                        if(s_error) console.log(s_error);
                        else console.log("A new shop has been registered", shop, new Date());
                        EventsHelper.emit("app/installed", {shop, access_token});
                    });
                }
                else{ // old store
                    Shop.getByShop(shop, function(error, ShopData){
                        if(ShopData && ShopData.status === "uninstalled"){
                            Shop.updateOneByShop(shop, {
                                access_token: access_token,
                                access_scope: scope,
                                $set: {
                                    updated_at: new Date(),
                                    reinstalled_at: new Date(),
                                    uninstalled_at: null,
                                    status: "active",
                                },
                                $inc: {
                                    __v: 1
                                }
                            }, function(s_error, s_success){
                                if(s_error) console.log(s_error);
                                EventsHelper.emit("app/reinstalled", {shop, access_token});
                            });
                        }
                        else{
                            Shop.updateOneByShop(shop, {
                                access_token: access_token,
                                access_scope: scope,
                                $set: {
                                    updated_at: new Date(),
                                    status: "active"
                                },
                                $inc: {
                                    __v: 1
                                }
                            }, function(s_error, s_success){
                                if(s_error) console.log(s_error);
                                EventsHelper.emit("app/oauth/updated", {shop, access_token});
                            });
                        }
                    });
                }
            });
        }
        else{
            console.error("Oauth callback missing either shop OR access_token");
        }
    }
    OAuthCallBackError(error){
        // console.log("Error", error);
    }
    testing(req, res) {
        AdminApi(req.body, function(error, response){
            if (error) {
                return res.send(error);
            }
            return res.send(response);
        });
    }
    index(req, res) {
        Shop.all(function(error, data){
            return res.send({
                error, data
            });
        })
    }
    get(req, res) {
        Shop.get(req.query.id, function(error, data){
            return res.send({
                error, data
            });
        })
    }
    store(req, res) {
        Shop.store(req.body, function(error, data){
            return res.send({
                error, data
            });
        })
    }
    udpate(req, res) {
        Shop.update(req.body.id, req.body, function(error, data){
            return res.send({
                error, data
            });
        })
    }
    delete(req, res) {
        Shop.delete(function(error, data){
            return res.send({
                error, data
            });
        })
    }
}

export default new Shops();