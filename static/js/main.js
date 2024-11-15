function fetch_users(){
    $.ajax({
        url: 'http://localhost:8000/fetch/',
        type: 'get',
        timeout: 5000,
        success: function(response){
            var table = $('#userTable');
            table.find("tr:gt(0)").remove();
            var users = response.map(function(user) {
                return {
                    id: user[0],
                    full_name: user[1],
                    phone: user[2]
                };
            });

            users.forEach(function (user){
                display_users(user)
            })
            edit_text()
        }
    })
}
fetch_users()



function display_users(user){
    var table = document.getElementById("userTable");
    
    var row = document.createElement("tr");
    row.className = "tr";
    
    var userIdCell = document.createElement("td");
    userIdCell.innerHTML = user.id;
    row.appendChild(userIdCell);
    
    var nameCell = document.createElement("td");
    var nameDiv = document.createElement("div");
    nameDiv.id = "namediv";
    nameDiv.className = "edit pointer";
    nameDiv.innerHTML = user.full_name;
    nameCell.appendChild(nameDiv);
    
    var nameInput = document.createElement("input");
    nameInput.id = "nameinput_"+user.id;
    nameInput.type = "text";
    nameInput.className = "txtedit pointer";
    nameInput.value = user.full_name;
    nameInput.name = 'name_input'
    nameCell.appendChild(nameInput)
    row.appendChild(nameCell);
    
    
    var phoneCell = document.createElement("td");
    var phoneDiv = document.createElement("div");
    phoneDiv.id = "phonediv";
    phoneDiv.style.width = '270px'
    phoneDiv.style.height = '30px'
    phoneDiv.className = "edit pointer";
    phoneDiv.innerHTML = user.phone;
    phoneCell.appendChild(phoneDiv);

    var phoneInput = document.createElement("input");
    phoneInput.id = "phoneinput_"+user.id;
    phoneInput.type = "text";
    phoneInput.className = "txtedit";
    phoneInput.value = user.phone;
    phoneInput.name = "phone_input"
    phoneCell.appendChild(phoneInput)
    row.appendChild(phoneCell);
    
    var actionCell = document.createElement("td");
    actionCell.className = "separator";
    
    var trash = '<a><svg xmlns="http://www.w3.org/2000/svg" id="trash_'+user.id+'" width="16" height="16" fill="currentColor" class="bi bi-trash pointer" viewBox="0 0 16 16">'+
                '  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>'+
                '  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>'+
                '</svg></a>'

    var eye = '<a><svg xmlns="http://www.w3.org/2000/svg" id="eye_'+user.id+'" width="16" height="16" fill="currentColor" class="bi bi-eye pointer" viewBox="0 0 16 16">'+
                '  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>'+
                '  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>'+
                '</svg></a>'

    actionCell.innerHTML = eye + trash;
    row.appendChild(actionCell);
    
    table.appendChild(row);
}


function edit_text() {
    // show input element
    $('.edit').on('click', function(){
        $('.txtedit').hide();
        $(this).next('.txtedit').show().focus();
        $(this).hide();
    })
    
    // save data
    $(".txtedit").focusout(function(){
        // get edit field name and value
        var id = this.id;
        var split_id = id.split("_");
        var field_name = split_id[0];
        var user_id = split_id[1];
        var value = $(this).val();
        var phone_input = $(this).val()
        
        // hide input element
        $(this).hide();
    
        // hide and change text of the container with input element
        $(this).prev('.edit').show();
        $(this).prev('.edit').text(value);

        $('#error').remove()
        var row_div = document.getElementById('row_div')
        var error = document.createElement('div')
        error.id = 'error'
        error.className = 'error-alert'
        function add_input_error(message){
            error.innerHTML = message
            row_div.appendChild(error)
        }
        var errors = 0
        var phonePattern = /^(?:(\d{3}))?[- ]?(\d{3})[- ]?(\d{4})$/;
        if (phone_input === ''){
            add_input_error('Phone is required')
            errors +=1
        }else if (!phonePattern.test(phone_input)){
            add_input_error('Provide a valid phone number')
            errors +=1
        }else{
            error.innerHTML = ''
        }

        if (field_name == 'phoneinput'){
            if (errors == 0){
                $.ajax({
                    url: 'http://localhost:8000/update/',
                    type: 'post',
                    timeout: 5000,
                    data: { field: field_name, value: value, id: user_id },
                    success: function(response){
                        if(response == 1){
                            var error = $('#error') 
                            error.innerHTML = ''
                            alert("Saved successfully");
                        } else {
                            alert('Not saved')
                        }
                    }
                });
            }
        }
    });
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // var eye = document.getElementsByClassName('btn-eye');
    
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }


    // When user clicks on eye icon modal opens and the data displays
    $('.bi-eye').click(function(){
        modal.style.display = "block";
        var id = this.id;
        var split_id = id.split("_");
        var user_id = split_id[1];

        $.ajax({
            url: 'http://localhost:8000/fetch-one/'+user_id+'/',
            type: 'get',
            timeout: 5000,
            success: function(response){            
                response.forEach(function(user) {
                    document.getElementById('name_modal').innerHTML = user[1]
                    document.getElementById('phone_modal').innerHTML = user[2]
                })
            }
        })
    })


    $('.bi-trash').click(function (){
        var id = this.id
        var split_id = id.split('_')
        var user_id = split_id[1]

        $.ajax({
            url: "http://localhost:8000/delete-user/"+user_id+"/",
            type: 'post',
            timeout: 5000,
            success: function(response){
                if (response == 1){
                    alert("User successfully deleted")
                    fetch_users()
                } else {
                    alert("User didn't deleted")
                }
            }
        })
    })
}






$('#add-user').on('click', function(){
    $('.form-wrapper').show(1000)
});

$('#create-user').click(function(){
    var full_name_val = $('#addname').val()
    var phone_val = $('#addphone').val()
    var name_error = document.getElementById('name-error')
    var phone_error = document.getElementById('phone-error')
    var errors = 0
    
    
    function add_name_error(message){
        name_error.innerHTML = message
    }
    function add_phone_error(message){
        phone_error.innerHTML = message
    }


    if (full_name_val === ''){
        add_name_error('Full name is required')
        errors += 1
    }else if (full_name_val.length < 3){
        add_name_error('Full name should be more than 3 characters')
        errors =+ 1
    }else{
        name_error.innerHTML = ''
    }
    
    var phonePattern = /^0(?:(\d{3}))?[- ]?(\d{3})[- ]?(\d{4})$/;
    if (phone_val === ''){
        add_phone_error('Phone is required')
        errors +=1
    }else if (!phonePattern.test(phone_val)){
        add_phone_error('Provide a valid phone number')
        errors +=1
    }else{
        phone_error.innerHTML = ''
    }

    $.ajax({
        url: 'http://localhost:8000/fetch/',
        type: 'get',
        timeout: 5000,
        success: function(response){
            var users = response.map(function(user) {
                return {
                    id: user[0],
                    full_name: user[1],
                    phone: user[2]
                };
            });
            users.forEach(function (user){
                if ('0'+user.phone === phone_val){
                    var row_div = document.getElementById('row_div')
                    var error = document.createElement('div')
                    error.id = 'error'
                    error.className = 'error-alert'
                    if (document.getElementById('error') === null){
                        error.innerHTML = 'Phone number alredy exists'
                        row_div.appendChild(error)
                    }
                    errors +=1
                }
            })
            if (errors === 0){   
                $.ajax({
                    url: 'http://localhost:8000/adduser/',
                    type: 'post',
                    timeout: 5000,
                    data: {full_name:full_name_val, phone:phone_val},
                    success: function(response){
                        if(response == 1){
                            fetch_users()
                            $('.form-wrapper').hide(1000);
                            
                            $('#error').remove()
                        } else {
                            alert('User did not added');
                        }
                    }
                })
            }
        }
    })
})


