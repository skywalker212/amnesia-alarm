$.ajax({
    url: '/time',
    success: function (data) {
        var hours = (Date.now() - data.mili) / 3600000;
        var mins = hours * 60;
        $('.time').html("Running Since " + Math.floor(hours) + " hours");
    }
});

function checkLog(name) {
    $.ajax({
        url: '/users',
        type: 'GET',
        dataType: 'json',
        data:{
            name: name
        },
        success: function (data) {
            var html = '<div class="log"><p class="log-header">Failed SMS Attempts Log</p>';

            if (data.totalLog == false) {
                html += '<p class="no-event">aha, there are still no failed events!</p>'
                html += `<button onclick="checkLog('${json.fname} ${json.lname}')" class="btn btn-success">Check Again</button>`;
            } else {
                for (var event in json.log) {
                    html += '<p class="log-detail">' + Math.floor((Date.now() - event) / 60000) + " minutes ago : " + json.log[event] + '</p>';
                }
                html += '</div>'
            }
            $('.main').html(html);
        }
    });
}

$('.my-form').on('submit', function () {
    $.post($(this).attr('action'), $(this).serialize(), function (json) {
        $('.greeting').html("Hello, " + json.fname + "!");
        var html = '<div class="log"><p class="log-header">Failed SMS Attempts Log</p>';

        if (json.totalLog == false) {
            html += '<p class="no-event">surprizingly, there are no failed events</p>'
            html += `<button onclick="checkLog('${json.fname} ${json.lname}')" class="btn btn-success">Check Again</button>`;
        } else {
            for (var event in json.log) {
                html += '<p class="log-detail">' + Math.floor((Date.now() - event) / 60000) + " minutes ago : " + json.log[event] + '</p>';
            }
        }
        html += '</div>'
        $('.main').html(html);
    }, 'json');
    return false;
});