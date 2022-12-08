import Controller from '../app/Controller.js';
import ContactUsModel from '../models/ContactUsModel.js';


class ContactUsController extends Controller {
    
    index(req, res) {
        ContactUsModel.all(function(error, data){
            return res.send({
                error, data
            });
        })
    }
    get(req, res) {
        ContactUsModel.get(req.query.id, function(error, data){
            return res.send({
                error, data
            });
        })
    }
    store(req, res) {
        ContactUsModel.store(req.body, function(error, data){
            return res.send({
                error, data
            });
        })
    }
    udpate(req, res) {
        ContactUsModel.update(req.body, function(error, data){
            return res.send({
                error, data
            });
        })
    }
    delete(req, res) {
        ContactUsModel.delete(function(error, data){
            return res.send({
                error, data
            });
        })
    }
}

export default new ContactUsController();