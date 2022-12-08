import Model from '../app/Model.js';
import table from '../databases/frequently_stats_table.js';

class FrequentlyStatsModel extends Model{
  constructor(){
    super(table);
  }  
}
 
export default new FrequentlyStatsModel; 