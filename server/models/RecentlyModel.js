import Model from '../app/Model.js';
import table from '../databases/recently_table.js';

class RecentlyModel extends Model{
  constructor(){
    super(table);
  }
}

export default new RecentlyModel;