import { Response } from "express";
import { CustomRequest } from "../auth/jwt";
import { Types } from "mongoose";
import { INotifications } from "../schema/user.model";
import { redisClient } from "../cache/redis";
import { JwtPayload } from "jsonwebtoken";
import User, { IUser } from "../schema/user.model";

const Following = {
    async Follow(req: CustomRequest, res: Response) {
        try {
            // Delete all stored cache
            await redisClient.delAll();

            // Get current user
            const email = (req.user as JwtPayload).email;
            const currentUser = await User.findOne({ email: email }).exec();
            const userId = req.body.userId;
            const user: IUser | null = await User.findById(userId).exec();

            if (user) {
                await User.updateOne({ _id: userId }, { $push: { followers: currentUser?._id } }).exec();
                await User.updateOne({ _id: currentUser?._id }, { $push: { following: user._id } }).exec();
            }
            const newNotification: INotifications = {
                senderId: currentUser._id,
                notificationType: "follow",
                createdAt: new Date(),
            }
            await User.updateOne({ _id: userId }, { $push: { notifications: newNotification } }).exec();
            return res.status(201).redirect("/users");
        } catch (error) {
            req.flash("error", "Error occurred");
            return res.status(500).redirect("/users");
        }  
    },

    async Unfollow(req: CustomRequest, res: Response) {
        try {
            // Delete all stored cache
            await redisClient.delAll();

            // Get current user
            const email = (req.user as JwtPayload).email;
            const currentUser = await User.findOne({ email: email }).exec();
            const userId = req.body.userId;
            const user: IUser | null = await User.findById(userId).exec();

            if (user) {
                await User.updateOne({ _id: userId }, { $pull: { followers: currentUser?._id } }).exec();
                await User.updateOne({ _id: currentUser?._id }, { $pull: { following: user._id } }).exec();
            }
            return res.status(201).redirect("/users");
        } catch (error) {
            req.flash("error", "Error occurred");
            return res.status(500).redirect("/users");
        }  
    },

    async getFollowers(req: CustomRequest, res: Response) {
        try {
            // Get current user
            const email = (req.user as JwtPayload).email;
            const currentUser = await User.findOne({ email: email }).exec();

            // Get specific user followers
            const userId = req.params.id;
            const user = await User.findById(userId).exec();

            if (!user) {
                throw new Error("User not found");
            }
            const followers = user.followers;
            const followerPromises = followers.map((followerId: Types.ObjectId) => User.findById(followerId).exec());
            const followerList = await Promise.all(followerPromises)

            return res.render("followers", { currentUser, followerList });
        } catch(error) {
            req.flash("error", "User not found!");
            return res.status(404).redirect("/");
        }
    },

    async getFollowing(req: CustomRequest, res: Response) {
        try {
            // Get current user
            const email = (req.user as JwtPayload).email;
            const currentUser = await User.findOne({ email: email }).exec();

            // Get specific user followers
            const userId = req.params.id;
            const user = await User.findById(userId).exec();

            if (!user) {
                throw new Error("User not found");
            }
            const following = user.following;
            const followingPromises = following.map((followingId: Types.ObjectId) => User.findById(followingId).exec());
            const followingList = await Promise.all(followingPromises);

            return res.render("following", { currentUser, followingList });
        } catch(error) {
            req.flash("error", "User not found!");
            return res.status(404).redirect("/");
        }
    }
}

export default Following;