import RecommendationModel from '../models/RecommendationModel.js';
import { createMetafield } from '../helpers/RecommendationHelper.js';
import { updateMetafield } from '../helpers/RecommendationHelper.js';
import { deleteMetafield } from '../helpers/RecommendationHelper.js';


class RecommendedController{
    create(req, res){

    }
  
    update(req, res){
        const { shop } = req.body;
        // fetch count ??
        // if count > 0 ? update else create
        RecommendationModel.count(shop, function(error, fetched){
            if(fetched > 0){
                RecommendationModel.getByShop(shop, function(error, data){
                    console.log("Found");
                    if(data && data.metafield && data.metafield.id){
                        var params_update = {
                            "metafield" : {
                                key: data.metafield.key,
                                value: JSON.stringify(req.body.recommendations)
                            }
                        };
                        updateMetafield(shop, data.metafield.id, params_update, function(error, updated){
                            if(updated){
                                req.body["metafield"] = {
                                    id: data.metafield.id,
                                    key: data.metafield.key,
                                    value: JSON.stringify(req.body.recommendations)
                                };
                                RecommendationModel.updateOneByShop(shop, req.body, function(error, success){
                                    if(success){
                                        console.log("UPDATED");
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
                            else{
                                return res.send(
                                    {
                                        satus: 404,
                                        error:error
                                    }
                                ); 
                            } 

                        });
                    }
                    else{
                        var metafield = {
                            "metafield" : {
                                namespace: "upsell_recommendations",
                                key: "recommendation",
                                value: JSON.stringify(req.body.recommendations),  
                                type: "json" 
                            }
                        };
                        createMetafield(req.body.shop, metafield, function (error, metafield_response) {
                            if (metafield_response && metafield_response.body && metafield_response.body.metafield) {
                                const { id, key, namespace } = metafield_response.body.metafield;
                                req.body["metafield"] = {
                                    id: id,
                                    key: key,
                                    namespace: namespace
                                };
                                RecommendationModel.updateOneByShop(shop, req.body, function(error, success){
                                    if(success){
                                        console.log("UPDATED");
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
                });
            }
            else{
                var metafield = {
                    "metafield" : {
                        namespace: "upsell_recommendations",
                        key: "recommendation",
                        value: JSON.stringify(req.body.recommendations),  
                        type: "json" 
                    }
                };

                createMetafield(req.body.shop, metafield, function (error, metafield_response) {
                    if (metafield_response && metafield_response.body && metafield_response.body.metafield) {
                        const { id, key, namespace } = metafield_response.body.metafield;
                        req.body["metafield"] = {
                            id: id,
                            key: key,
                            namespace: namespace
                        };
                        RecommendationModel.store(req.body, function(error, success){
                            if(success){
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
        });
    }

    get(req, res) {
        RecommendationModel.getByShop(req.query.shop, function(error, data){
            console.log("data", data);
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

    delete(req, res){
        const { id, shop } = req.query;
        RecommendationModel.get(id, function(error, data){
            if(data && data.metafield && data.metafield.id){
                deleteMetafield(shop, data.metafield.id, function(error, deleted){
                    if(deleted){
                        RecommendationModel.delete(id, function(error, deleted){
                            res.send({
                                error, deleted
                            });
                        });
                    } 
                    else{
                        console.log("METAFIELD NOT DELETED");
                        RecommendationModel.delete(id, function(error, deleted){
                            res.send({
                                error, deleted
                            });
                        });
                    }
                });
            }
            else{
                return res.send({
                    error: error,
                    status: 0
                });
            }
        });
    }
    
}

export default new RecommendedController();