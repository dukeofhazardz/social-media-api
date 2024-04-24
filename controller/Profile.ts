import { Response } from "express";
import { CustomRequest } from "../auth/jwt";
import { JwtPayload } from "jsonwebtoken";
import Post from "../schema/posts.model";
import User from "../schema/user.model";
import { redisClient } from "../cache/redis";
import { IUser } from "../schema/user.model";
import moment from "moment";


const Profile = {
    async getProfile(req: CustomRequest, res: Response) {
        try {
            // Get Current User
            const email = (req.user as JwtPayload).email;
            const currentUser = await User.findOne({ email: email }).exec();
            const userId = currentUser._id;
    
            const page = parseInt(req.query.page as string) || 1; // Current page, default is 1
            const limit = parseInt(req.query.limit as string) || 10; // Number of items per page, default is 10
            const startIndex = (page - 1) * limit;

            // Check if profile posts data for the current page exists in Redis cache
            const cachedProfilePosts = await redisClient.get(`profile:${userId}:${page}:${limit}`)  as string | null;
            const cachedTotalPages = await redisClient.get(`totalPages${userId}`)  as string | null;
            if (cachedProfilePosts && cachedTotalPages) {
                // If cached data exists, parse and send it
                const userPosts = JSON.parse(cachedProfilePosts);
                const totalPages = JSON.parse(cachedTotalPages);
                return res.render("profile", { currentUser, userPosts, moment, totalPages, currentPage: page, limit });
            }
            
            // Fetch total number of pages
            const totalUserPostsCount = await Post.countDocuments({ userId: userId }).exec();
            const totalPages = Math.ceil(totalUserPostsCount / limit);
    
            // If not cached, fetch data from MongoDB
            const userPosts = await Post.find({ userId: userId })
                .sort({ createdAt: -1 })
                .skip(startIndex)
                .limit(limit)
                .exec();
    
            // Cache the profile posts data in Redis
            await redisClient.set(`profile:${userId}:${page}:${limit}`, JSON.stringify(userPosts), 3600); // Cache for 1 hour
            await redisClient.set(`totalPages${userId}`, JSON.stringify(totalPages), 3600); // Cache for 1 hour
    
            // Render the profile page
            return res.render("profile", { currentUser, userPosts, moment, totalPages, currentPage: page, limit });
        } catch(error) {
            req.flash("error", "Error getting profile")
            return res.status(403).redirect("/login");
        }
    },

    async getUserProfile(req: CustomRequest, res: Response) {
        try {
            // Get Current User
            const email = (req.user as JwtPayload).email;
            const currentUser = await User.findOne({ email: email }).exec();
    
            // Get Specific User
            const userId = req.params.id;
            const user = await User.findById(userId).exec();
    
            const page = parseInt(req.query.page as string) || 1; // Current page, default is 1
            const limit = parseInt(req.query.limit as string) || 10; // Number of items per page, default is 10
            const startIndex = (page - 1) * limit;
    
            // Check if user's posts data for the current page exists in Redis cache
            const cachedUserPosts = await redisClient.get(`userPosts:${userId}:${page}:${limit}`) as string | null;
            const cachedTotalPages = await redisClient.get(`totalPages:${userId}`) as string | null;
            if (cachedUserPosts && cachedTotalPages) {
                // If cached data exists, parse and send it
                const userPosts = JSON.parse(cachedUserPosts);
                const totalPages = JSON.parse(cachedTotalPages);
                return res.render("user-profile", { user, currentUser, userPosts, moment, totalPages, currentPage: page, limit });
            }
            
            // Fetch user's posts
            const userPostsCount = await Post.countDocuments({ userId }).exec();
            const totalPages = Math.ceil(userPostsCount / limit);
    
            // If not cached, fetch data from MongoDB
            const userPosts = await Post.find({ userId })
                .sort({ createdAt: -1 })
                .skip(startIndex)
                .limit(limit)
                .exec();
    
            // Cache the user's posts data in Redis
            await redisClient.set(`userPosts:${userId}:${page}:${limit}`, JSON.stringify(userPosts), 3600); // Cache for 1 hour
            await redisClient.set(`totalPages:${userId}`, JSON.stringify(totalPages), 3600); // Cache for 1 hour
    
            // Render the user profile page
            return res.render("user-profile", { user, currentUser, userPosts, moment, totalPages, currentPage: page, limit });
        } catch(error) {
            req.flash("error", "Error getting profile")
            return res.status(403).redirect("/login");
        }
    },

    async getUsers(req: CustomRequest, res: Response) {
        try {
            const email = (req.user as JwtPayload).email;
            const currentUser = await User.findOne({ email: email }).exec();

            const page = parseInt(req.query.page as string) || 1; // Current page, default is 1
            const limit = parseInt(req.query.limit as string) || 10; // Number of items per page, default is 10
            const startIndex = (page - 1) * limit;
    
            // Check if people data for the current page exists in Redis cache
            const cachedPeople = await redisClient.get(`${email}:people:${page}:${limit}`) as string | null;
            const cachedTotalPages = await redisClient.get(`${email}:totalPages`) as string | null;
            if (cachedPeople && cachedTotalPages) {
                // If cached data exists, parse and send it
                const people = JSON.parse(cachedPeople);
                const totalPages = JSON.parse(cachedTotalPages);
                return res.render("people", { currentUser, allUsers: people, totalPages, currentPage: page, limit });
            }

            // Fetch total number of pages
            const allUsersCount = await User.countDocuments({}).exec();
            const totalPages = Math.ceil(allUsersCount / limit);
    
            // If not cached, fetch data from MongoDB
            const allUsers: IUser[] = await User.find({})
                .skip(startIndex)
                .limit(limit)
                .exec();

            // Cache the people data in Redis
            await redisClient.set(`${email}:people:${page}:${limit}`, JSON.stringify(allUsers), 3600); // Cache for 1 hour
            await redisClient.set(`${email}:totalPages`, JSON.stringify(totalPages), 3600); // Cache for 1 hour
    
            // Render the people page
            return res.render("people", { currentUser, allUsers, totalPages, currentPage: page, limit });
        } catch(error) {
            req.flash("error", "Error getting users");
            return res.status(403).redirect("/login");
        }
    },

    async makePost(req: CustomRequest, res: Response) {
        // Delete all stored cache
        await redisClient.delAll();
        
        const email = (req.user as JwtPayload).email;
        const { content } = req.body;
        if (!content) {
            req.flash("error", "Content area cannot be blank");
            return res.status(422).redirect("/profile");
        }
        let mediaFile = '';
        if (req.file) {
            mediaFile = req.file.filename;
        }
        const currentUser = await User.findOne({ email: email }).exec()
        const newPost = new Post({
            userId: currentUser._id,
            text: content,
            media: mediaFile,
            createdAt: new Date(),
            likes: [],
            comments: [],
        });
        await User.updateOne({ _id: currentUser._id }, { $push: { posts: newPost._id } }).exec();
        newPost.save();
        req.flash("message", "Your post have been uploaded");
        return res.status(201).redirect("/profile");
    }

}


export default Profile;