const {Router} = require('express');
const userController = require('../controllers/userController');
const router = Router();

router.post('/registration', userController.regist);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', userController.getUsers);

module.exports = router;