const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    regno: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
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
    dob: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    sslc: {
        type: Number,
        required: true
    },
    hsc: {
        type: Number,
        required: true
    },
    ug: {
        type: Number,
        required: true
    },
    pg: {
        type: Number,
    },
    role: {
        type: String, // Define a 'role' field
        enum: ['Student', 'Admin'], // Set allowed roles
        default: 'Student' // Set a default role, such as 'User'
    }
});

studentSchema.pre('save', async function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    user.password = await bcrypt.hash(user.password, 8);
    next();
});

mongoose.model("Student", studentSchema);
