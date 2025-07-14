const {Router} = require('express');
const userController = require('./controllers/userController');
const {body} = require('express-validator');
const router = Router();

router.post('/registration', 
    body('email').isEmail(),
    body('password').isLength({min: 8, max: 32}),
    userController.regist
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);

module.exports = router;