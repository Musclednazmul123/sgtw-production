import RecentlyModel from '../models/RecentlyModel.js';
import { createMetafield } from '../helpers/MetafieldHelper.js';
import { updateMetafield } from '../helpers/MetafieldHelper.js';

class RecentlyController{

    update(req, res){
        const { shop } = req.body;
        // return res.send(req.body);
        // fetch count ??
        // if count > 0 ? update else create
        RecentlyModel.count(shop, function(error, fetched){
            if(fetched > -1){
                
                RecentlyModel.getByShop(shop, function(error, data){
                    if(data && data.metafield && data.metafield.id){
                        var params_update = {
                            "metafield" : {
                                key: data.metafield.key,
                                value: JSON.stringify(req.body.data)
                            }
                        };
                        updateMetafield(shop, data.metafield.id, params_update, function(error, updated){
                            if(updated){
                                
                                req.body["metafield"] = {
                                    id: data.metafield.id,
                                    key: data.metafield.key,
                                    value: JSON.stringify(req.body)
                                };
                                RecentlyModel.updateOneByShop(shop, req.body, function(error, success){
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
                                namespace: "upsell_recently",
                                key: "recently",
                                value: JSON.stringify(req.body.recently),  
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
                                RecentlyModel.updateOneByShop(shop, req.body, function(error, success){
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
            else{
                var metafield = {
                    "metafield" : {
                        namespace: "upsell_recently",
                        key: "recently",
                        value: JSON.stringify(req.body.recently),  
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
                        RecentlyModel.store(req.body, function(error, success){
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
        RecentlyModel.getByShop(req.query.shop, function(error, data){
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
}
export default new RecentlyController();