// check-admin.js

const checkAdmin = (req, res, next) => {
    if (req.user && req.user.admin) {
        next();
    } else {
        return res.status(401).send({ message: `401 Unauthorized`});
    }
}

export default checkAdmin;
