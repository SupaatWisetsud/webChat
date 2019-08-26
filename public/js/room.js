var io = io();

io.on('load message', function(data, room){
    //- console.log(data);
    //- console.log(room);
    if(room.room === $('#msg').attr('data-room')){
        let loadMessage = '';
        for(let i in data){
            loadMessage += `<li>
                                <div class="${data[i].user._id === $('#msg').attr('data-user')? 'me-message' : 'message-items'}">
                                    <div class="image-user">
                                        <img src="${data[i].user.profileImg}" alt="${data[i].user.username}">
                                        <h4>${data[i].user.username}</h4>
                                    </div>
                                    <div class="descript-message">
                                        <div class="message">
                                            <p>${data[i].message}</p>
                                        </div>
                                        <p class="time">${jQuery.timeago(data[i].dateTime)}</p>
                                    </div>
                                </div>
                            </li>`;

                            
        }
        $('ul').html(loadMessage);
        
        if($('#auto-scrol').is(":checked")){
            $('section').scrollTop($('ul').height());
        }
    }
});

io.on('key', function(data){
    if(data.key === "redirect"){
        location.replace('/');
    }
});
$(()=>{
    $('section').scrollTop($('ul').height());

    $('#btn-send').click(function(e){
        if($('#msg').val().trim() !== ''){
            let roomId = $('#msg').attr('data-room');
            let user = $('#msg').attr('data-user');
            let msg = $('#msg').val().trim();

            let data = {
                room : roomId,
                user : user,
                message : msg
            }
            io.emit('send message', data);

            $('#msg').val('');
        }else{
            $('#msg').focus();
        }
    });

    $('#msg').keypress(function(event){

        let key = event.which;
        
        if(key === 13){
            
            if($('#msg').val().trim() !== ''){
                let roomId = $('#msg').attr('data-room');
                let user = $('#msg').attr('data-user');
                let msg = $('#msg').val().trim();

                let data = {
                    room : roomId,
                    user : user,
                    message : msg
                }
                io.emit('send message', data);

                $('#msg').val('');
            }else{
                $('#msg').focus();
            }
        }
    });

    $(".time").each(function(i, el){
        //- console.log($(el).attr('data-time'));
        //- console.log(jQuery.timeago($(el).attr('data-time').split('G')[0]));
        $(el).text(jQuery.timeago($(el).attr('data-time').split('G')[0]).toString());
    });

});