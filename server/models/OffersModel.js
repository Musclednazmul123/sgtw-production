import Model from '../app/Model.js';
import table from '../databases/upsell_offers_table.js';

class OffersModel extends Model{
  constructor(){
    super(table);
  }
  updateByUid(uid, data, callback){
    this.db.updateOne({uid: uid}, data, callback);
  }
}

export default new OffersModel;