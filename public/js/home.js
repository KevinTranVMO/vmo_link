
$(document).ready(function () {

	$('#btn-copy').tooltip()
	$('#option-div').fadeToggle()
	$('#shorten-link').fadeIn()

	$(document).on('click', '#get-short-link-guest', function () {
		disableBtn('#get-short-link-guest')
		$('#shorten-link').fadeOut()
		let longLink = $('#long-link').val()
		$.ajax({
			url: '/short-link-guest',
			method: 'POST',
			dataType: 'json',
			data: { longLink: longLink },
			success: function (dt) {
				enableBtn('#get-short-link-guest', 'Shorten')
				let { message, success } = dt
				if (success) {
					setWithSuccess(message)
				} else {
					setWithError(message)
				}
				$('#shorten-link').fadeIn()
			},
			error: function (stt, err) {
				console.log(stt + err)
			}
		})
	})

	$(document).on('click', '#get-short-link-user', function () {
		disableBtn('#get-short-link-user')
		$('#shorten-link').fadeOut()
		let longLink = $('#long-link').val()
		let password = $('#password').val()
		let customLink = $('#custom-link').val()
		let expire = $('#expire').val()
		let selected = $('#select-option').find(":selected").val()
		$.ajax({
			url: '/short-link-user',
			method: 'POST',
			dataType: 'json',
			data: {
				longLink: longLink,
				password: password,
				customLink: customLink,
				expire: expire,
				selected: selected
			},
			success: function (dt) {
				enableBtn('#get-short-link-user', 'Shorten')
				let { message, success } = dt
				if (success == '1') {
					setWithSuccess(message)
				}
				else if (success == '0')
					setWithError(message)
				else window.location.href = '/logout'
				$('#shorten-link').fadeIn()
			},
			error: function (stt, err) {
				console.log(stt + err)
			}
		})
	})

	$(document).on('click', '#btn-copy', function () {
		$('#btn-copy').tooltip('hide').attr('data-original-title', 'copied').tooltip('show')
		var temp = $("<input>")
		$("body").append(temp)
		temp.val($('#shorten-link').text()).select()
		document.execCommand("copy")
		temp.remove()
	})

	var status = false

	$(document).on('click', '#option-advanced', function () {
		if (!status && $('#option-advanced').is(":checked"))
			$.ajax({
				url: '/option-advanced',
				method: 'POST',
				dataType: 'json',
				success: function (dt) {
					let { logged } = dt
					if (logged) {
						status = logged
						$('#option-div').html(optionAdvanced())
						$('#option-div').fadeIn()
					}
					else {
						setWithError('You need login to use option advanced')
					}
				},
				error: function (stt, err) {
					console.log(stt + err)
				}
			})
		else $('#option-div').fadeToggle()
	})
})

function disableBtn(id) {
	$(id).prop('disabled', true)
	$(id).html('<span class="spinner-grow spinner-grow-sm"></span><span>  </span><span class="spinner-grow spinner-grow-sm"></span><span>  </span><span class="spinner-grow spinner-grow-sm"></span>')
}

function enableBtn(id, content) {
	$(id).prop('disabled', false)
	$(id).text(content)
}

function optionAdvanced() {
	return `<div class="flex-center">
				<input class="simple-input width-100 margin-right-50" style="margin-right: 50px;" type="text" name="Password" id="password" placeholder="Password">
				<input class="simple-input width-100" type="text" name="custom-link" id="custom-link" placeholder="Custom address">
			</div>
			<div class="time-setting margin-top-20">
				<div class="input_name">
					Expire time setting
				</div>
				<hr>
				<div class="input_field">
					<div class="flex-center">
						<input class="time-number" type="number" name="expire" id="expire" placeholder="Time">
					</div>
				<div class="padding-11">
				<select id="select-option" class="time_select">
					<option value="0">Minutes</option>
					<option value="1">Hours</option>
					<option value="2">Days</option>
				</select>
				</div>
			</div>
		</div>`
}

function setWithError(message) {
	$('#display-error').text(message)
	$('#shorten-link').text('')
	$('#btn-copy').tooltip('hide').attr('data-original-title', 'click to copy')
	$('.toast').toast('show');
}

function setWithSuccess(message) {
	$('#shorten-link').text(message)
	$('#btn-copy').tooltip('hide').attr('data-original-title', 'click to copy')
	$('.toast').toast('hide');
}