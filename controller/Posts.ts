import { Request, Response } from "express";
import Post, { IComment } from "../schema/posts.model";
import { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../auth/jwt";
import User, { INotifications } from "../schema/user.model";
import { redisClient } from "../cache/redis";
import { Types } from "mongoose";
import moment from "moment";


const Posts = {
    async likePost(req: CustomRequest, res: Response) {
        // Delete all stored cache
        await redisClient.delAll();

        const postId = req.body.postId;
        try {
            const email = (req.user as JwtPayload).email;
            const currentUser = await User.findOne({ email: email }).exec();
            const post = await Post.findById(postId).exec();
            // Add currentUser to likes Array
            await Post.updateOne({ _id: Types.ObjectId(postId) }, { $push: { likes: currentUser._id } }).exec();

            // Create a new notification object and update database
            const newNotification: INotifications = {
                senderId: currentUser._id,
                notificationType: "like",
                postId: postId,
                createdAt: new Date(),
            }
            await User.updateOne({ _id: post?.userId }, { $push: { notifications: newNotification } }).exec();
            return res.redirect(`/post/${postId}`);
        } catch (error) {
            req.flash("error", "Error liking post")
            return res.status(500).redirect(`/post/${postId}`);
        }
    },

    async unlikePost(req: CustomRequest, res: Response) {
        // Delete all stored cache
        await redisClient.delAll();
        
        const postId = req.body.postId;
        try {
            const email = (req.user as JwtPayload).email;
            const currentUser = await User.findOne({ email: email }).exec();
            await Post.updateOne({ _id: Types.ObjectId(postId) }, { $pull: { likes: currentUser._id } }).exec();
            return res.redirect(`/post/${postId}`);
        } catch (error) {
            req.flash("error", "Error unliking post")
            return res.status(500).redirect(`/post/${postId}`);
        }
    },

    async getPostDetails(req: CustomRequest, res: Response) {
        try {
            // Current user
            const email = (req.user as JwtPayload).email;
            const currentUser = await User.findOne({ email: email }).exec();
            // Find Post
            const postId = req.params.id;
            const post = await Post.findById(postId).exec();
            if (!post) {
                // If the post is not found, return a 404 Not Found response
                return res.status(404).redirect("/feeds");
            }
            // Find Poster
            const poster = await User.findById(post.userId).exec();
            // Get Comments
            const comments = post.comments;
            const allComments: Object[] = [];
            await Promise.all(comments.map(async (comment: IComment) => {
                const commenter = await User.findById(comment.userId).exec();
                allComments.push({
                    commenter: commenter,
                    comment: comment.text,
                    posted: comment.createdAt
                });
            }));
            // Render the post details page with the retrieved post
            res.render("post-details", { post, poster, currentUser, allComments, moment });
        } catch (error) {
            req.flash("error", "Error fetching post details");
            return res.status(500).redirect("/feeds");
        }
    },

    async addComment(req: CustomRequest, res: Response) {
        // Delete all stored cache
        await redisClient.delAll();

        const postId = req.body.postId;
        try {
            const { content } = req.body;
            const email = (req.user as JwtPayload).email;
            const currentUser = await User.findOne({ email: email }).exec();
            
            const post = await Post.findById(postId).exec();
            const comment: IComment = {
                userId: currentUser._id,
                text: content,
                createdAt: new Date(),
            };
            await Post.updateOne({ _id: Types.ObjectId(postId) }, { $push: { comments: comment } }).exec();

            // Create a new notification object and update database
            const newNotification: INotifications = {
                senderId: currentUser._id,
                notificationType: "comment",
                postId: postId,
                createdAt: new Date(),
            }
            await User.updateOne({ _id: post?.userId }, { $push: { notifications: newNotification } }).exec();
            return res.redirect(`/post/${postId}`);
        } catch (error) {
            req.flash("error", "Error commenting on post");
            return res.status(500).redirect(`/post/${postId}`);
        }
    }
}


export default Posts;