function disableBtn(id){
    $(id).prop('disabled', true)
    $(id).html('<span class="spinner-grow spinner-grow-sm"></span><span class="spinner-grow spinner-grow-sm"></span><span class="spinner-grow spinner-grow-sm"></span>')
}

function enableBtn(id, content){
    $(id).prop('disabled', false)
    $(id).text(content)
}

$(document).ready(function(){
    $(document).on('click', '#btn-confirm', function(){
        disableBtn('#btn-confirm')
        let shortUrl1 = $('#shortUrl').text()
        let password = $('#password').val()
        let shortUrl = shortUrl1.split('/')
        $.ajax({
            url: '/password-access-link',
            method: 'POST',
            dataType: 'json',
            data: {
                shortUrl: shortUrl[shortUrl.length -1],
                password: password
            },
            success: function(dt){
                let { message, success} = dt
                enableBtn('#btn-confirm', 'Confirm')
                if (success) window.location.href = message
                else {
                    $('#display-error').text(message)
                    $('.toast').toast('show');
                }
            },
            error: function(status, err){
                console.log('error ' + status + " " + err);
            }
        })
    })
})