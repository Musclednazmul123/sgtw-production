import recommendations from "../json/recommendations.json" assert {type: "json"};

class recommendation_table {
    model = "upsell_recommendation";
    fields = {
        shop: {
          type: String,
          required: true,
          unique: true
        },
        recommendations: {
            type: Array,
            default: recommendations
        },
      metafield : {
            type: Object,
            default: {}
        }
    };
  }
  
  export default new recommendation_table;