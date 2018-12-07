const User = require("../models/user");
const signToken = require('../auth/auth.js').signToken


exports.getAllUser = function (req, res) {
    User.find((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data });
    });
};

exports.findUserById = function (req, res) {
    const { id } = req.body;
    User.findById((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data });
    });
};

exports.deleteUserById = function (req, res) {
    const { id } = req.body;
    User.findOneAndDelete(id, err => {
        if (err) return res.send(err);
        return res.json({ success: true });
    });
};

exports.UpdateUser = function (req, res) {
    const { id } = req.body;
    User.findOneAndUpdate(id, req.body, err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
};

exports.registerUser = function (req, res) {
    let user = new User();

    const { firstname, lastname } = req.body;

    if (!firstname || !lastname) {
        return res.json({
            success: false,
            error: "Please provide a valid first and last name"
        });
    }

    User.create(req.body, (err, user) => {
        if (err) return res.json({ success: false, error: err });
        // once user is created, generate a token to "log in":
        const token = signToken(user)
        res.json({ success: true, token: token })
    })
};

exports.login = function (req, res) {
    const { username, password } = req.body;

    // check if the user exists
    User.findOne({ username: username }, (err, user) => {
        // if there's no user or the password is invalid
        if (!user || !user.validPassword(password)) {
            // deny access
            return res.json({ success: false, message: "Login failed. Please provide a valid username and password" })
        }

        const token = signToken(user)
        res.json({ success: true, message: "Token attached.", token })
    })
};

exports.createAdmin = function () {
    var user = {
        firstname: "Admin",
        lastname: "Admin",
        username: "admin",
        password: "Admin123",
        role: "admin"
    }
    
    User.findOne({ username: user.username }, (err, userFound) => {
        // if there's no user or the password is invalid
        if (!userFound) {
            User.create(user, (err) => {
                if (err) console.log('could not create admin');
            })
        }
    })
    
};