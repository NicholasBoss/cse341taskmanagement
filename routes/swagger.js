const router = require('express').Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
// import env variables
const { GOOGLE_CLIENT_ID } = process.env;
router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
        oauth2RedirectUrl: "https://cse341taskmanagement.onrender.com/api-docs/oauth2-redirect.html",
        oauth: {
            clientId: GOOGLE_CLIENT_ID,
            scopes: "openid email profile",
            usePkceWithAuthorizationCodeGrant: true,    
        }
    }
}));

module.exports = router;