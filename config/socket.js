"use strict";

const mongoose = require('mongoose');

const Message = mongoose.model('Message');
const Room = mongoose.model('Room');

module.exports = function(server){

    var countUser = 0;

    var io = require('socket.io')(server);

    io.on('connection', function(socket){
        countUser++;
        console.log("a user connection, user online : "+countUser);
        
        socket.on('send message', function(data){
            // console.log(data);
            
            let message = new Message(data);
            
            message.dateTime = new Date();

            message.save(function(err){
                if(err) throw err;

                Message.find({
                    room : data.room
                })
                .populate('room')
                .populate('user')
                .exec(function(err, message){
                    // console.log(message);
                    if(!message[message.length - 1].room){
                        Message.deleteMany({
                            room : data.room
                        },function(err, result){
                            if(err) throw err;
                            io.emit('key', {key : "redirect"});
                            
                        });
                    }else{
                        io.emit("load message", message, data);
                    }
                });

            });

            
        });

        socket.on('create room', function(data){
            Room.findOne({
                roomName : data.roomName
            }, function(err, room){
                if(err) throw err;
                if(!room){
                    let room = new Room(data);

                    room.save(function(err){
                        if(err) throw err;
                        // console.log("Sava success!!");
                        
                        Room.find({}, function(err, result){
                            if(err) throw err;
                            io.emit('load room', result);
                            
                        });
                    });
                }
            });
        });

        socket.on('delete room', function(data){
            // console.log(data);
            Room.findOneAndDelete({
                _id : data.room
            }, function(err){
                if(err) throw err;
                
                Message.deleteMany({room : data.room}, err=>{
                    if(err) throw err;
                });

                Room.find({}, function(err, result){
                    if(err) throw err;
                    io.emit('load room', result);
                });
            });
        });

        socket.on('disconnect', function(){
            countUser--;
            console.log("disconnect a user, user online : "+countUser);
        });
    });
    
}