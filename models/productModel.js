const mongoose = require("mongoose");

const createProductSlug = name =>
    name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A product must have a name"],
        unique: true,
        trim: true,
        minlength: [3, "A product name must have at least 3 characters"],
        maxlength: [80, "A product name must have 80 characters or less"]
    },
    price: {
        type: Number,
        required: [true, "A product must have a price"],
        min: [1, "A product price must be at least 1"]
    },
    category: {
        type: String,
        required: [true, "A product must have a category"],
        trim: true,
        enum: {
            values: ["Electronics", "Clothes", "Books", "Food", "Home", "Services", "Sports", "Others"],
            message: "Category must be Electronics, Clothes, Books, Food, Home, Services, Sports, or Others"
        }
    },
    description: {
        type: String,
        trim: true,
        maxlength: [160, 'A product description must be 160 characters or less']
    },
    seller: {
        type: String,
        required: [true, "A product must have a seller"],
        trim: true,
        minlength: [2, "A seller name must have at least 2 characters"],
        maxlength: [80, "A seller name must have 80 characters or less"]
    },
    postedDate: {
        type: Date,
        default: Date.now
    },
    productSlug: String,
    premiumProducts: {
        type: Boolean,
        default: false
    },
    priceDiscount: {
        type: Number,
        min: [0, "Discount price cannot be negative"],
        validate: {
            validator: function(val) {
                return val == null || val < this.price;
            },
            message: "Discount price ({VALUE}) should be below the regular price"
        }
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

productSchema.virtual('daysPosted').get(function() {
    if (!this.postedDate) return 0;
    return Math.floor((Date.now() - this.postedDate.getTime()) / (1000 * 60 * 60 * 24));
});

productSchema.pre('save', function() {
    if (this.isModified('name')) {
        this.productSlug = createProductSlug(this.name);
    }
});

productSchema.pre('findOneAndUpdate', function() {
    const update = this.getUpdate();
    const name = update.name || (update.$set && update.$set.name);

    if (!name) return;

    if (update.$set) {
        update.$set.productSlug = createProductSlug(name);
    } else {
        update.productSlug = createProductSlug(name);
    }

    this.setUpdate(update);
});

productSchema.pre(/^find/, function() {
    this.find({ premiumProducts: { $ne: true } });
});

productSchema.pre('aggregate', function() {
    this.pipeline().unshift({ $match: { premiumProducts: { $ne: true } } });
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
