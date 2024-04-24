import { Schema, model, Document, Types } from "mongoose";

export interface IComment {
    userId: Types.ObjectId;
    text: string;
    createdAt: Date;
};

export interface IPost extends Document {
    userId: Types.ObjectId;
    text: string;
    media: string;
    createdAt: Date;
    likes: Types.ObjectId[];
    comments: IComment[];
}

const postSchema = new Schema<IPost>({
    userId: { type: Types.ObjectId, required: true },
    text: { type: String, required: true },
    media: { type: String, required: false },
    createdAt: { type: Date, required: true },
    likes: { type: [Types.ObjectId], required: false, default: [] },
    comments: { type: [{ userId: Schema.Types.ObjectId, text: String, createdAt: Date }], required: false, default: [] },
});


const Post = model<IPost>('Post', postSchema);

export default Post;
