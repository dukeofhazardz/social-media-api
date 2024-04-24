import { Response } from "express";
import { CustomRequest } from "../auth/jwt";
import { JwtPayload } from "jsonwebtoken";
import User, { INotifications } from "../schema/user.model";
import { redisClient } from "../cache/redis";
import moment from "moment";

const Notifications = {
    async getNotifications(req: CustomRequest, res: Response) {
        try {
            // Get current user
            const email = (req.user as JwtPayload).email;
            const currentUser = await User.findOne({ email: email }).exec();
    
            // Pagination parameters
            const page = parseInt(req.query.page as string) || 1; // Current page, default is 1
            const limit = parseInt(req.query.limit as string) || 10; // Number of items per page, default is 10
            const startIndex = (page - 1) * limit;
    
            // Check if notifications data for the current page exists in Redis cache
            const cachedNotifications = await redisClient.get(`${email}:notifications:${page}:${limit}`)  as string | null;
            const cachedTotalNotifications = await redisClient.get(`${email}:totalNotifications`) as string | null;
    
            if (cachedNotifications && cachedTotalNotifications) {
                // If cached data exists, parse and send it
                const notifications = JSON.parse(cachedNotifications);
                const totalNotifications = parseInt(cachedTotalNotifications);
                const totalPages = Math.ceil(totalNotifications / limit);
                return res.render("notifications", { currentUser, notifications, moment, totalPages, currentPage: page, limit });
            }
    
            // If not cached, fetch data from MongoDB
            const allNotifications: INotifications[] = currentUser.notifications;
            const mappedNotifications = await Promise.all(allNotifications.map(async (notification) => {
                const user = await User.findById(notification.senderId).exec();
                if (user) {
                    return {
                        user,
                        notificationType: notification.notificationType,
                        postId: notification.postId,
                        createdAt: notification.createdAt
                    };
                }
                return null;
            }));
    
            // Calculate total number of notifications
            const totalNotifications = mappedNotifications.length;
    
            // Slice notifications for the current page and return them according to the latest entry
            const notifications = (mappedNotifications.slice(startIndex, startIndex + limit)).reverse();
    
            // Cache the notifications data and total count in Redis
            await redisClient.set(`${email}:notifications:${page}:${limit}`, JSON.stringify(notifications), 3600); // Cache for 1 hour
            await redisClient.set(`${email}:totalNotifications`, totalNotifications.toString(), 3600); // Cache for 1 hour
    
            // Calculate total number of pages
            const totalPages = Math.ceil(totalNotifications / limit);
    
            // Render the notifications page
            return res.render("notifications", { currentUser, notifications, moment, totalPages, currentPage: page, limit });
        } catch(error) {
            req.flash("error", "Error fetching notifications");
            return res.status(500).redirect("/");
        }
    }
}


export default Notifications;