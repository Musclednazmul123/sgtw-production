
class frequently_boughts_table {
    model = "frequently_boughts";
    fields = {
        shop: {
          type: String,
          required: true
        },
        uid: {
          type: String,
          required: true,
          unique: true
        },
        views: {
          type: Number, 
          default: 0 
        }, 
        clicks: {
          type: Number,
          default: 0
        },
        name: {
          type: String,
          default: "Default"
        },
        upsell_product_page: {
            type: Boolean,
            default: false
        },
        upsell_in_cart: {
            type: Boolean,
            default: false
        },
        upsell_post_purchase: {
            type: Boolean,
            default: false
        },
        matching_products: {
          type: Array,
          default: []
        },
        trigger_products: {
          type: Array,
          default: []
        },
        active: {
          type: Boolean,
          default: true
        },
        randomize: {
          type: Boolean,
          default: true
        },
        channel: {
          type: String,
          default: "app"
        },
        metafield: {
          type: Object,
          default: {}
        },
        created_at: {
          type: Date,
          default: new Date()
        },
        updated_at: {
          type: Date,
          default: null
        }
    };
  }
  
  export default new frequently_boughts_table;