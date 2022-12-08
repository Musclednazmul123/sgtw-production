
class contact_us_table {
  model = "ContactUs";
  fields = {
      shop: {
        type: String,
        required: true,
      },
      data: {
        type: Object,
        default: {}
      },
      created_at: {
        type: Date,
        default: new Date()
      }
  };
}

export default new contact_us_table;