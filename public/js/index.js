var io = io();

io.on('load room', function(data){
    let loadRoom = '';
    for(let i in data){
        loadRoom += `   
                        <li>
                            <div class="room-items">
                                <h2>${data[i].roomName}</h2>
                                <div class="btn-room">
                                    <a href="/room/${data[i]._id}" class="btn-join-room">
                                        <i class="far fa-comments" style="margin-right:5px"></i>แชท
                                    </a>
                                    <a class="btn-del-room" data-id="${data[i]._id}" data-name="${data[i].roomName}">
                                        <i class="far fa-trash-alt" style="margin-right:5px"></i>ลบ
                                    </a>
                                </div>
                            </div>
                        </li>`;

    }
    $('ul').html(loadRoom);
});

$(()=>{

    //delete room
    $(document).on('click', '.btn-del-room', function(event){
        let _this = this;
        
        //- console.log($(this).data("id"));

        $('.delete-room').css({
            "display" : "flex"
        });

        $('.del-txt').text(`คุณต้องการจะลบห้อง ${$(this).data('name')} ใช่ไหม!!`);
        $('#del').click(function(e){
            
            io.emit('delete room', {
                room : $(_this).data("id")
            });

            $('.delete-room').css({
                "display" : "none"
            });
        });
        
        $('#close').click(function(e){
            $('.delete-room').css({
                "display" : "none"
            });
        });
        
    });

    //create room
    $('.btn-create-room').click(function(e){
        $('.create-room').css({
            "display" : "flex"
        });

        $('#name_room').focus();
    });

    $('.close').click(function(e){

        $('#name_room').val('');

        $('.create-room').css({
            "display" : "none"
        });

    });

    //create room
    $('#btn_create').click((e)=>{
        if($('#name_room').val().trim() !== ''){

            let roomName = $('#name_room').val().trim();

            if(roomName.length > 10){
                roomName = roomName.substring(0, 10);
                roomName += "...";
            }
            
            io.emit('create room', {roomName : roomName});

            $('#name_room').val('');
            $('.create-room').css({
                "display" : "none"
            });
            
        }else{
            $('#name_room').val('');
            $('#name_room').focus(); 
        }
    });
});