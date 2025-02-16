import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        minlength: [3, 'Name must be at least 3 characters.'],
        maxlength: [255, 'Name cannot exceed 255 characters.'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Email format is invalid.'],
        minlength: [6, 'Email must be at least 6 characters.'],
        maxlength: [255, 'Email cannot exceed 255 characters.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [6, 'Password must be at least 6 characters.'],
        maxlength: [1024, 'Password cannot exceed 1024 characters.']
    },
    role: {
        type: String,
        enum: ['admin', 'project_manager', 'developer', 'tester'],
        default: 'developer'
    },
    jobTitle: {
        type: String,
        required: [true, 'Job title is required.'],
    },
    phone: {    
        type: String,
        required: [true, 'Phone number is required.'],
    },
    address: {
        
        type: String,
        required: [true, 'Address is required.'],
    },
    bio: {
        
        type: String,
        required: false
    },
    projects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    }],
    profilePicture: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('User', userSchema);
