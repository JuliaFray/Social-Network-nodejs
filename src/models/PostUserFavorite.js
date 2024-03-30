import mongoose from 'mongoose';

const PostUserFavoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        required: true
    },
}, {
    timestamps: true
});

export default mongoose.model('PostUserFavorite', PostUserFavoriteSchema);