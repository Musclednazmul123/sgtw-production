
class offer_stats_table {
    model = "upsell_stats";
    fields = {
        shop: {
          type: String,
          required: true
        },
        uid: {
          type: String,
          required: true,
        },
        product_id: {
          type: String,
          default: null,
        },
        product_price: {
          type: Number,
          default: 0,
        },
        views: {
          type: Number,
          default: 0
        },
        clicks: {
          type: Number,
          default: 0
        },
        type: {
          type: String,
          require: true
        },
        created_at: {
          type: Date,
          default: new Date()
        }
    };
  }

  export default new offer_stats_table;