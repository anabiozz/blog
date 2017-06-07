import mongoose, { Schema } from 'mongoose';
var bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
    name: String,
    provider: String,
    password: String
});

UserSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

let user = mongoose.model('user', UserSchema);

export default user;