const userService = require("../services/userService");
const {validationResult} = require('express-validator');

class UserController {
    async regist(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return await res.json({errorDescription: "Problem with email or password"});
            }
            const {email, password} = req.body;
            console.log(email, password)
            const userData = await userService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            return await res.json(userData);
        } catch (error) {
            console.error(error);
            return await res.json({errorDescription: "User already exist"});
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            return await res.json(userData);
        } catch (error) {
            console.error(error)
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (error) {

        }
    }

    async activate(req, res, next) {
        try {
            const link= req.params.link;
            await userService.activate(link);
            return res.redirect(process.env.CLIENT_URL);
        } catch (error) {
            console.error(error);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            return await res.json(userData);
        } catch (error) {
            
        }
    }

    async getUsers(req, res, next) {
        try {

        } catch (error) {

        }
    }
}

module.exports = new UserController();