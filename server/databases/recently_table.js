import recently from "../json/recently.json" assert {type: "json"};

class recently_table {
    model = "upsell_recently";
    fields = {
        shop: {
          type: String,
          required: true,
          unique: true
        },
        recently: {
            type: Object,
            default: recently
        },
      metafield : {
            type: Object,
            default: {}
        }
    };
  }
  
  export default new recently_table;