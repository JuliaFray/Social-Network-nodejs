import mongoose from 'mongoose';
import PostUserFavorite from "./PostUserFavorite.js";
import Comment from "./Comment.js";
import File from './File.js'
import Profile from "./Profile.js";
import PostUserRating from "./PostUserRating.js";

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
    imageId: {
        type: mongoose.Schema.ObjectId
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: Profile,
        required: true
    },
    viewsCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

PostSchema.virtual('likes', {
    ref: PostUserFavorite,
    localField: '_id',
    foreignField: 'post',
    count: true
})

PostSchema.virtual('rating', {
    ref: PostUserRating,
    localField: '_id',
    foreignField: 'post',
}).get(arr => {
    return Array.isArray(arr) ? arr.reduce((sum, el) => sum + el.rating, 0) : 0
})

PostSchema.virtual('userRating', {
    ref: PostUserRating,
    localField: '_id',
    foreignField: 'post',
    justOne: true
}).get(el => el ? el.rating : 0);

PostSchema.virtual('comments', {
    ref: Comment,
    localField: '_id',
    foreignField: 'post'
})

PostSchema.virtual('image', {
    ref: File.Chunk,
    localField: 'imageId',
    foreignField: 'files_id',
    justOne: true
})

PostSchema.pre('findOneAndDelete',
    {document: true, errorHandler: true},
    async (error, post, next
    ) => {
        await PostUserFavorite.deleteMany({post: post._id})
            .then(() => {
                console.log('likes were deleted');
                Comment.deleteMany({post: post._id})
                    .then(() => {
                        console.log('Comment were deleted');
                        next();
                    })
            })
            .catch(err => next(new Error(err)));
    });

export default mongoose.model('Post', PostSchema);
