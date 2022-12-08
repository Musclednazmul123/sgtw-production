import Controller from "../app/Controller.js";
import BillingPlans from "../models/BillingPlansModel.js";

class BillingPlansController extends Controller {
    index(req, res) {
        BillingPlans.all(function(error, plans){
            return res.send({
                error, plans
            });
        })
    }
    get(req, res) {
        BillingPlans.get(req.query.id, function(error, plan){
            return res.send({
                error, plan
            });
        })
    }
    store(req, res) {
        BillingPlans.store(req.body, function(error, plan){
            return res.send({
                error, plan
            });
        })
    }
    udpate(req, res) {
        BillingPlans.update(req.body.id, req.body, function(error, plan){
            return res.send({
                error, plan
            });
        })
    }
    delete(req, res) {
        BillingPlans.delete(function(error, plan){
            return res.send({
                error, plan
            });
        })
    }
}

export default new BillingPlansController();