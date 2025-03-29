import express from 'express';
import { auth } from 'express-openid-connect';

const app = express();



app.get('/register', (req, res) => {
    console.log(req.oidc, req.oidc.isAuthenticated());
    res.send(`Authenticated: ${req.oidc.isAuthenticated()}`);
});

export default app;
