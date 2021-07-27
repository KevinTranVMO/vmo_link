$(document).ready(function () {
    var readURL = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader()
            reader.onload = function (e) {
                $('.avatar').replaceWith(`<img src="` + e.target.result + `" style="height: 200px;"
                                        class="avatar rounded-circle" alt="avatar">`)
                // $('.avatar').attr('src', e.target.result)
            }
            reader.readAsDataURL(input.files[0])
        }
    }

    $(document).on('change', '.file-upload', function () {
        readURL(this)
    })

    $(document).on('click', '#btn-show-profile', function () {
        $.ajax({
            url: '/auth/profile',
            method: 'GET',
            dataType: 'json',
            success: function (dt) {
                let { message, success } = dt
                if (success) {
                    $('#body-content').html(formProfile(message[0].firstname
                        , message[0].lastname, checkUnderfined(message[0].description)))
                    formActivity(message[1])
                } else window.location.href = '/login'
            },
            error: function (stt, err) {
                console.log(stt, err)
            }
        })
    })
    $(document).on('click', '#confirm-update-profile', function () {
        let firstname = $('#first_name').val()
        let lastname = $('#last_name').val()
        let description = $('#description').val()
        $.ajax({
            url: '/auth/profile',
            method: 'POST',
            dataType: 'json',
            data: {
                firstname: firstname,
                lastname: lastname,
                description: description
            },
            success: function (dt) {
                let { message, success } = dt
                if (success) {
                    if (message){
                        $('#status-update').text(message)
                        $('#status-update').attr('class', 'text-danger')
                    } else {
                        $('#status-update').text('update successfully')
                        $('#status-update').attr('class', 'text-info')
                        $('#name-user').text(firstname+ ' ' + lastname)
                    }
                } else window.location.href = '/login'
            },
            error: function (stt, err) {
                console.log(stt, err)
            }
        })
    })
    $(document).on('keyup', '#new-password, #repeat-password', function(){
        if ($('#new-password').val() == $('#repeat-password').val()) 
            $('#message-change').html('Matching').css('color', 'green')
        else $('#message-change').html('Not Matching').css('color', 'red')
    })
    $(document).on('click', '#confirm-change-password', function(){
        let currentPass = $('#current-password').val()
        let newPass = $('#new-password').val()
        $.ajax({
            url: '/auth/change-password',
            method: 'POST',
            dataType: 'json',
            data: {
                currentPass: currentPass,
                newPass: newPass
            },
            success: function(dt){
                let { message, success } = dt
                if (success) {
                    if (message){
                        $('#message-change').text(message)
                        $('#message-change').css('color', 'red')
                    } else {
                        $('#message-change').text('update successfully')
                        $('#message-change').css('color', 'green')
                    }
                } else window.location.href = '/login'
            },
            error: function(stt, err){
                console.log(stt, err)
            }
        })
    })
        
    
})

function checkUnderfined(check) {
    if (check) return check
    else return ''
}

function formActivity(data){
    if (data.length <= 0) {
        $('#amount-link').text('0')
        $('#total-access-link').text('0')
    }
    else {
        let total = 0
        for (let i of data)
            total += i.clicks
        $('#amount-link').text(data.length)
        $('#total-access-link').text(total)
    }
}

function formProfile(firstname, lastname, description) {
    return `
    <div class="container">
    <div class="row">
      <div class="col-sm-10">
        <h1>Information</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-3">
        <!--left col-->
        <div class="text-center">
            <img src="/img/vmo-link.png" style="height: 200px;"
            class="avatar rounded-circle" alt="avatar">
        </div>
        </hr><br>
        <ul class="list-group">
          <li class="list-group-item text-muted">Activity <i class="fa fa-dashboard fa-1x"></i></li>
          <li class="list-group-item text-right"><span class="pull-left"><strong>Link:</strong> </span><span id="amount-link"> 100</span></li>
          <li class="list-group-item text-right"><span class="pull-left"><strong>Total Clicks:</strong> </span><span id="total-access-link"> 100</span></li>
        </ul>
      </div>
      <!--/col-3-->
      <div class="col-sm-9">
        <ul class="nav nav-tabs" role="tablist">
          <li class="nav-item">
            <a class="nav-link active" data-toggle="tab" href="#profile">Profile</a>
          </li>
        </ul>
        <div class="tab-content">
          <div class="container tab-pane active" id="profile">
            <hr>
            <div >
              <div class="form-group">
                <div class="col-xs-6">
                  <label for="first_name">
                    <h4>First name</h4>
                  </label>
                  <input type="text" class="form-control" name="first_name" id="first_name" value="`+ firstname + `" placeholder="first name"
                    title="Enter your first name if any.">
                </div>
              </div>
              <div class="form-group">

                <div class="col-xs-6">
                  <label for="last_name">
                    <h4>Last name</h4>
                  </label>
                  <input type="text" class="form-control" name="last_name" id="last_name" value="`+ lastname + `" placeholder="last name"
                    title="Enter your last name if any.">
                </div>
              </div>
              <div class="form-group">
                <div class="col-xs-6">
                  <label for="description">
                    <h4>description</h4>
                  </label>
                  <textarea class="form-control" id="description" rows="3">`+ description + `</textarea>
                </div>
              </div>
              <div class="form-group">
                <div class="col-xs-12">
                  <br>
                  <button id="btn-update-profile" class="btn btn-lg btn-success" data-toggle="modal" data-target="#updateModal">Save</button>
                </div>
              </div>
              <div class="form-group">
                <strong id="status-update"></strong>
              </div>
            </div>

            <hr>

          </div>
        </div>
        <!--/tab-pane-->
      </div>
      <!--/tab-content-->

    </div>
    <!--/col-9-->
  </div>
  <!--/row-->
    `
}