class billing_plans_table {
    model = "billing_plans";
    fields = {
        name: {
            type: String,
            required: true,
            unique: true
        },
        type: {
            type: String,
            default: "custom"
        },
        trial_days: {
            type: Number,
            default: 7
        },
        plans: {
            type: Array,
            default: [
                {
                    id: "1001e01a010001",
                    title: "Tier I",
                    price: 9.99,
                    discounted_yearly_price: 99.99,
                    capped_amount: 2000,
                    terms: "",
                    details: ""
                }
            ]
        }
    };
}

export default new billing_plans_table;