const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const emailService = require('./emailService');
const tokenService = require('./tokenService');
const UserDto = require('../dtos/userDto');

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({email});
        if (candidate) {
            throw new Error(`User with this email (${email}) already exist`);
        }
        const hashedPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await UserModel.create({email, password: hashedPassword, link: activationLink});
        await emailService.sendLink(email, `${process.env.API_URL}/restapi/activate/${activationLink}`);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto,
        }
    }

    async activate(link) {
        const user = await UserModel.findOne({link})
        if (!user) {
            throw new Error("Wrong activation link");
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({email});
        if (!user) {
            throw new Error("User doesn't exist");
        }
        const isPasswordEq = await bcrypt.compare(password, user.password);
        if (!isPasswordEq) {
            throw new Error("Wrong password");
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto,
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new Error("Unauthorized");
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const foundToken = await tokenService.findToken(refreshToken);
        if(!userData || !foundToken) {
            throw new Error("Unauthorized");
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto,
        }
    }
}

module.exports = new UserService();