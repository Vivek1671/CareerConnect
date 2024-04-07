const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
   
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    
    
});

adminSchema.pre('save', async function(next) {
    const admin = this;
    if (!admin.isModified('password')) {
        return next();
    }
    admin.password = await bcrypt.hash(admin.password, 8);
    next();
});

mongoose.model("Admin", adminSchema);
