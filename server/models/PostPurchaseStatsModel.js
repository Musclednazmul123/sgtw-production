import Model from '../app/Model.js';
import table from '../databases/post_purchase_stats_table.js';

class PostPurchaseStatsModel extends Model{
  constructor(){
    super(table);
  }
}

export default new PostPurchaseStatsModel;