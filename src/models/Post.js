import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        default: []
    },
    imageUrl: String,
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    viewsCount: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
});

export default mongoose.model('Post', PostSchema);