import express from "express";
import passport from "passport";

const router = express.Router();

router.get('/login/success', (req, res) => {
    if (req.user) {
        res.status(200).json({ error: false, user: req.user });
    } else {
        res.status(403).json({ error: true, message: "Not authenticated" });
    }
});

router.get('/login/failed', (req, res) => {
    res.status(401).json({ error: true, message: "Login failed" });
});

router.get(
    '/google/callback',
    passport.authenticate("google", {
        successRedirect: process.env.FRONTEND_URL,
        failureRedirect: "/login/failed",
    })
);

router.get('/google', passport.authenticate("google", { scope: ["profile", "email"] }));

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        res.redirect(process.env.FRONTEND_URL);
    });
});

export default router;
