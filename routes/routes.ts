import { verifyToken, handleTokenExpiration, checkToken } from "../auth/jwt";
import { Request, Response, NextFunction } from "express-serve-static-core";
import express, { Router } from "express";
import flash from "connect-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
import Home from "../controller/Home";
import Signup from "../controller/Signup";
import Login from "../controller/Login";
import Logout from "../controller/Logout";
import Feeds from "../controller/Feeds";
import Profile from "../controller/Profile";
import Posts from "../controller/Posts";
import Following from "../controller/Following";
import Settings from "../controller/Settings";
import multer from "multer";
import Notifications from "../controller/Notifications";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './uploads/media/');
  },
  filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage }).single("media");
const router: Router = express.Router();
router.use(session({
  secret: "social-media-secret",
  resave: false,
  saveUninitialized: false
}));
router.use(express.static("uploads/media"));
router.use(express.static("assets/default-img"));
router.use(express.json());
router.use(flash());
router.use(cookieParser());
router.use(express.urlencoded({ extended: true }));

router.get("/", checkToken, Home.getHome);
router.get("/login", checkToken, Login.getLogin);
router.post("/login", Login.postLogin);
router.get("/signup", checkToken, Signup.getSignup);
router.post("/signup", Signup.postSignup);
router.post("/logout", Logout.postLogout);
router.get("/feeds", verifyToken, handleTokenExpiration, Feeds.getFeeds);
router.get("/profile", verifyToken, handleTokenExpiration, Profile.getProfile);
router.post("/like", verifyToken, handleTokenExpiration, Posts.likePost);
router.post("/unlike", verifyToken, handleTokenExpiration, Posts.unlikePost);
router.get("/post/:id", verifyToken, handleTokenExpiration, Posts.getPostDetails);
router.post("/comment", verifyToken, handleTokenExpiration, Posts.addComment);
router.post("/follow", verifyToken, handleTokenExpiration, Following.Follow);
router.post("/unfollow", verifyToken, handleTokenExpiration, Following.Unfollow);
router.get("/followers/:id", verifyToken, handleTokenExpiration, Following.getFollowers);
router.get("/following/:id", verifyToken, handleTokenExpiration, Following.getFollowing);
router.get("/user/:id", verifyToken, handleTokenExpiration, Profile.getUserProfile);
router.get("/users", verifyToken, handleTokenExpiration, Profile.getUsers);
router.get("/notifications", verifyToken, handleTokenExpiration, Notifications.getNotifications);
router.get("/settings", verifyToken, handleTokenExpiration, Settings.getSettings);
router.post("/settings", verifyToken, handleTokenExpiration, (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading (The error will occurred because no files were uploaded)
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
              next();
          }
          next();
      } else if (err) {
        next();
      }
      next();
  });
}, Settings.postSettings);
router.post("/posts", verifyToken, handleTokenExpiration, (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
              next();
          }
          next();
      } else if (err) {
        next();
      }
      next();
  });
}, Profile.makePost);

export default router;
