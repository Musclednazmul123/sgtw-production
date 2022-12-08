import Model from '../app/Model.js';
import table from '../databases/billing_plans_table.js';

class BillingPlansModel extends Model{
  constructor(){
    super(table);
  }
}

export default new BillingPlansModel;