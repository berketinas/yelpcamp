const mongoose = require('mongoose');
const passportLM = require('passport-local-mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

UserSchema.plugin(passportLM);

module.exports = mongoose.model('User', UserSchema);
