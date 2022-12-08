import Model from '../app/Model.js';
import table from '../databases/frequently_boughts_table.js';

class FrequentlyModel extends Model{
  constructor(){ 
    super(table);
  }
  updateByUid(uid, data, callback){
    this.db.updateOne({uid: uid}, data, callback);
  }
}

export default new FrequentlyModel;