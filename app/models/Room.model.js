var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var roomSchema = new Schema({
    roomName : {
        type : String,
        unique : true,
        trim : true,
        required : "roon name is required"
    }
});

mongoose.model('Room', roomSchema);