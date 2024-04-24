import { Response } from "express";
import { CustomRequest } from "../auth/jwt";
import { JwtPayload } from "jsonwebtoken";
import Post from "../schema/posts.model";
import User from "../schema/user.model";
import { IPost } from "../schema/posts.model";
import { IUser } from "../schema/user.model";
import { redisClient } from "../cache/redis";
import moment from "moment";

const Feeds = {
    async getFeeds(req: CustomRequest, res: Response) {
        try {
            const email = (req.user as JwtPayload).email;
            const currentUser = await User.findOne({ email: email }).exec();
    
            const page = parseInt(req.query.page as string) || 1; // Current page, default is 1
            const limit = parseInt(req.query.limit as string) || 10; // Number of items per page, default is 10
            const startIndex = (page - 1) * limit;
    
            // Check if feeds data for the current page exists in Redis cache
            const cachedFeeds = await redisClient.get(`${email}:feeds:${page}:${limit}`)  as string | null;
            const cachedTotalPages = await redisClient.get(`${email}:totalPages`)  as string | null;
            if (cachedFeeds && cachedTotalPages) {
                // If cached data exists, parse and send it
                const feeds = JSON.parse(cachedFeeds);
                const totalPages = JSON.parse(cachedTotalPages);
                return res.render("feeds", { feeds, currentUser, moment, totalPages, currentPage: page, limit });
            }
    
            // If not cached, fetch data from MongoDB
            const following = currentUser.following;
            following.push(currentUser._id);

            // Fetch total number of pages
            const allPostsCount = await Post.countDocuments({}).exec();
            const totalPages = Math.ceil(allPostsCount / limit);
    
            const allPosts: IPost[] = await Post.find({})
                .sort({ createdAt: -1 })
                .skip(startIndex)
                .limit(limit)
                .exec();
    
            const feeds: { post: IPost; poster: IUser }[] = [];
    
            for (const post of allPosts) {
                if (following.includes(post.userId)) {
                    const poster = await User.findById(post.userId).exec();
                    if (poster) {
                        feeds.push({ post, poster });
                    }
                }
            }
    
            // Cache the feeds data and totalPages for currentUser in Redis
            await redisClient.set(`${email}:feeds:${page}:${limit}`, JSON.stringify(feeds), 3600); // Cache for 1 hour
            await redisClient.set(`${email}:totalPages`, JSON.stringify(totalPages), 3600); // Cache for 1 hour
    
            // Render the feeds page
            return res.render("feeds", { feeds, currentUser, moment, totalPages, currentPage: page, limit });
        } catch(error) {
            req.flash("error", "Error fetching posts");
            return res.status(500).redirect("/");
        }
    }

}


export default Feeds;