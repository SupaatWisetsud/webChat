var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var messageSchema = new Schema({
    message : {
        type : String,
        required : "Message is required",
        trim : true
    },
    room : {
        type : Schema.ObjectId,
        ref : 'Room',
        required : "Room is required"
    },
    user : {
        type : Schema.ObjectId,
        ref : 'User',
        required : "user is required"
    },
    dateTime : {
        type : Date,
        default : Date.now()
    }
});

mongoose.model('Message', messageSchema);