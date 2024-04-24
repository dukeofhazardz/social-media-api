import { Schema, model, Document, Types } from "mongoose";

export interface INotifications {
    senderId: Types.ObjectId;
    notificationType: string;
    postId?: Types.ObjectId;
    createdAt: Date;
};

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNo: string;
    address: string;
    profilePicture?: string;
    createdAt: Date;
    followers: Types.ObjectId[];
    following: Types.ObjectId[];
    posts: Types.ObjectId[];
    notifications: INotifications[];
}

const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phoneNo: { type: String, required: true },
    address: { type: String, required: true },
    profilePicture: { type: String, required: false },
    createdAt: { type: Date, required: true },
    followers: { type: [Types.ObjectId], required: false },
    following: { type: [Types.ObjectId], required: false },
    posts: { type: [Types.ObjectId], required: false },
    notifications: { type: [{ senderId: Types.ObjectId, notificationType: String, postId: Types.ObjectId, createdAt: Date }], required: false },
});


const User = model<IUser>('User', userSchema);

export default User;
