
class shops_table {
  model = "Shops";
  fields = {
      shop: {
        type: String,
        required: true,
        unique: true
      },
      info: {
        type: Object,
        default: {}
      },
      session: {
        type: Object,
        default: {}
      },
      access_token: {
        type: String,
        default: null
      },
      access_scope: {
        type: String,
        default: null
      },
      setup_help: {
        type: Boolean,
        default: true
      },
      setup_help_point: {
        type: Number,
        default: 1
      },
      exempt_billing: {
        type: Boolean,
        default: false
      },
      billing_plan_id: {
        type: String,
        default: null
      },
      status: {
        type: String,
        default: "active"
      },
      enabled_features: {
        type: Object,
        default: {
          upsell: true
        }
      },
      uninstalled_at: {
        type: Date,
        default: null
      },
      reinstalled_at: {
        type: Date,
        default: null
      },
      app_version: {
        type: String,
        default: process.env.APP_VERSION || "1.0.0"
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

export default new shops_table;