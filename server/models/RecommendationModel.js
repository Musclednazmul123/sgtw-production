import Model from '../app/Model.js';
import table from '../databases/recommendation_table.js';

class RecommendationModel extends Model{
  constructor(){
    super(table);
  }
}

export default new RecommendationModel;