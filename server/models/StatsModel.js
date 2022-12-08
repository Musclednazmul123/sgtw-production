import Model from '../app/Model.js';
import table from '../databases/offer_stats_table.js';

class StatsModel extends Model{
  constructor(){
    super(table);
  }
}

export default new StatsModel;