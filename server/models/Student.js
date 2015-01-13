var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var studentSchema = mongoose.Schema({
    local            : {
        email        : String,
        password     : String,
    }
});

studentSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

studentSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('Student', studentSchema);
