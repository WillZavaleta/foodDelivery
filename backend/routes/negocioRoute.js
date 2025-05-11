import express from "express"
import { createConnectAccount, getStripeAccountId, getOnboardingLink, getAccountStatus, getStripeAccountIdByEmail } from "../controllers/negocioController.js"
import authMiddleware from "../middleware/auth.js";

const negocioRouter = express.Router();

negocioRouter.post("/stripe-connect-account", authMiddleware, createConnectAccount);
negocioRouter.get("/get-accountid", authMiddleware, getStripeAccountId);
negocioRouter.get("/get-onboarding-link/:accountId", getOnboardingLink);
negocioRouter.get("/get-account-status/:accountId", getAccountStatus);
negocioRouter.get("/get-accountid-byemail", getStripeAccountIdByEmail);

export default negocioRouter;