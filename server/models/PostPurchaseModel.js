import Model from '../app/Model.js';
import table from '../databases/post_purchases_table.js';

class PostPurchaseModel extends Model{
  constructor(){
    super(table);
  }
  updateByUid(uid, data, callback){
    this.db.updateOne({uid: uid}, data, callback);
  }
}

export default new PostPurchaseModel;