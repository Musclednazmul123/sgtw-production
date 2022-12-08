import Controller from '../app/Controller.js';
import PaymentsModel from '../models/PaymentsModel.js';
import { AdminApi } from '../helpers/Helper.js';
import { DataType } from '@shopify/shopify-api';

class PaymentController extends Controller {
    createInvoice(req, res){
        if (plans.hasOwnProperty(req.query.plan)) {
            const plan = plans[req.query.plan]; 
            AdminApi({
                shop: req.query.shop,
                type: "post",
                fetch: {
                    path: "recurring_application_charges",
                    data: {
                        "recurring_application_charge": {
                            name: plan.title,
                            price: plan.price,
                            trial_days: plan.trial_days,
                            // capped_amount: plan.capped_amount,
                            // terms: plan.terms,
                            test: process.env.TEST_CHARGES === 'True',
                            return_url: process.env.HOST+"/payment/invoice/accept.json?shop="+req.query.shop+"&pid="+plan.id
                        }
                    },
                    type: DataType.JSON
                }
            }, function(error, response){
                if (error) {
                    return res.send(error);
                }
                if (response && response.body && response.body.recurring_application_charge) {
                    const { recurring_application_charge } = response.body;
                    if (recurring_application_charge.confirmation_url) {
                        return res.redirect(recurring_application_charge.confirmation_url);
                    }
                    else{
                        res.statusCode = 403;
                        return res.send(recurring_application_charge);
                    }
                }
            });  
        }
        else{
            res.statusCode = 403;
            return res.send({
                error: true,
                trace: "Plan was not found"
            });
        }
    }
    invoiceCallback(req, res){
        var redirect_app_admin = `https://${req.query.shop}/admin/apps/${process.env.APP_HANDLE}/${process.env.AFTER_PAYMENTS_REDIRECT}?shop=${req.query.shop}`;
        if (req.query.charge_id) {
            AdminApi({
                shop: req.query.shop,
                type: "get",
                fetch: {
                    path: "recurring_application_charges/"+req.query.charge_id,
                    type: DataType.JSON
                }
            }, function(error, response){
                if (response && response.body && response.body.recurring_application_charge) {
                    const { recurring_application_charge } = response.body;
                    PaymentsModel.count(req.query.shop, function(error, count){
                        if (Number(count) === 0) {
                            var data = recurring_application_charge;
                            data["shop"] = req.query.shop;
                            data["charge_id"] = recurring_application_charge.id;
                            data["id"] = req.query.pid;
                            PaymentsModel.store(data, function (payment_error, payment_saved) {
                                return res.redirect(redirect_app_admin+"&_pstatus=success");
                            });
                        }
                        else{
                            // update charges
                            var data = {
                                "charge_id": recurring_application_charge.id,
                                "id": req.query.pid,
                                "name": recurring_application_charge.name,
                                "price": recurring_application_charge.price,
                                "status": recurring_application_charge.status,
                                "test": recurring_application_charge.test,
                                "cancelled_on": recurring_application_charge.cancelled_on,
                                "trial_days": recurring_application_charge.trial_days,
                                "trial_ends_on": recurring_application_charge.trial_ends_on,
                                "updated_at": recurring_application_charge.updated_at,
                            };
                            // store charges
                            PaymentsModel.updateOneByShop(req.query.shop, data, function (payment_error, payment_saved) {
                                return res.redirect(redirect_app_admin);
                            });
                        }
                    });
                }
                else{
                    return res.redirect(redirect_app_admin+"&_pstatus=failed");
                }
            });
        }
        else{
            return res.redirect(redirect_app_admin+"&_pstatus=failed&cid=missing");
        }
    }
    index(req, res) {
        PaymentsModel.all(function(error, data){
            return res.send({
                error, data
            });
        })
    }
    get(req, res) {
        PaymentsModel.getByShop(req.query.shop, function(error, data){
            return res.send({
                error, data
            });
        })
    }
    status(req, res) {
        PaymentsModel.findOneByField(
            {
                shop: req.query.shop,
                status: "active"
            },
            { 
                status: 1,
                shop: 1,
                name: 1,
                id: 1,
            },  function(error, payment){
                return res.send({
                    error, payment
                });
            }
        );
    }
    store(req, res) {
        PaymentsModel.store(req.body, function(error, data){
            return res.send({
                error, data
            });
        })    }
    udpate(req, res) {
        PaymentsModel.update(req.body, function(error, data){
            return res.send({
                error, data
            });
        })
    }
    delete(req, res) {
        PaymentsModel.delete(function(error, data){
            return res.send({
                error, data
            });
        })
    }
    remove(req, res) {
        PaymentsModel.deleteall({shop: req.query.shop}, function(error, data){
            return res.send({
                error, data
            });
        })
    }
    plan(req, res){
        PaymentsModel.getByShop(req.query.shop, function(error, data){
            var plan_name={
                plan : data.name
            }
            return res.send(plan_name);
        });
    }
}

const plans = {
    "a10a010d0e0001": {
        "id": "a10a010d0e0001",
        "title": "Basic",
        "price": 15,
        "trial_days": 7,
        "capped_amount": 1000,
        "terms": "$0.5 for an order",
        "usage_price": 0.5,
        "details": [
            "Unlimited Upsell Offers",
            "Unlimited Frequently Bought Together Offers",
            "Product/Cart Page Upsell & FBT",
            "Analytics",
            "24/7 Support"
        ]
    },
    "a10a010d0e0002": {
        "id": "a10a010d0e0002",
        "title": "Standard",
        "price": "19.99",
        "trial_days": "7",
        "capped_amount": 1000,
        "terms": "$0.15 for an order",
        "usage_price": 0.15,
        "details": [
            "Unlimited Upsell Offers",
            "Unlimited Frequently Bought Together Offers",
            "Product/Cart Page Upsell & FBT",
            "Analytics",
            "24/7 Support"
        ]
    },
    "a10a010d0e0003": {
        "id": "a10a010d0e0003",
        "title": "Premium",
        "price": "24.99",
        "trial_days": "7",
        "capped_amount": 1000,
        "terms": "$0.01 for an order",
        "usage_price": 0.01,
        "details": [
            "Unlimited Upsell Offers",
            "Unlimited Frequently Bought Together Offers",
            "Product/Cart Page Upsell & FBT",
            "Analytics",
            "24/7 Support"
        ]
    }
};

export default new PaymentController();