const jwtVariable = require('../../variables/jwt');

const userModle = require('../users/users.models');

const authMethod = require('./auth.methods');

exports.isAuth = async (req, res, next) => {
	// Lấy access token từ header
    console.log(req.headers)
	const accessTokenFromHeader = req.headers.authorization;
	if (!accessTokenFromHeader) {
		return res.status(401).send('Không tìm thấy access token!');
	}

	const accessTokenSecret =
		process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;

	const verified = await authMethod.verifyToken(
		accessTokenFromHeader.split(' ')[1],
		accessTokenSecret,
	);
	if (!verified) {
		return res
			.status(401)
			.send('Bạn không có quyền truy cập vào tính năng này!');
	}

	const user = await userModle.getUser(verified.payload.username);
	req.user = user;

	return next();
};
