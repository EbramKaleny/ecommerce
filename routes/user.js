import express from 'express';
import * as UC from '../controllers/user.js';
import {validation} from '../middleware/validation.js';
import * as UV from '../validations/user.js';

const router = express.Router()

router.route("/signup").post(validation(UV.signUpValidation),UC.signUp)
router.route("/verifyEmail/:token").put(validation(UV.verifyEmail),UC.verifyEmail)
router.route("/refreshToken/:rfToken").get(validation(UV.refreshToken),UC.refreshToken)
router.route("/signin").put(validation(UV.signIn),UC.signIn)
router.route("/forgetPassword").put(validation(UV.forgetPassword),UC.forgetPassword)
router.route("/resetPassword").put(validation(UV.resetPassword),UC.resetPassword)

export default router