$.ajax({
    url: '/time',
    success: function (data) {
        var hours = (Date.now() - data.mili) / 3600000;
        var mins = hours * 60;
        $('.time').html("Running Since " + Math.floor(hours) + " hours");
    }
});

function checkLog(name) {
    console.log(name);
    $.get("/user?name=" + name, function (data) {
        var html = '<div class="log"><p class="log-header">Failed SMS Attempts Log</p>';

        if (data.totalLog == 0) {
            html += '<p class="no-event">aha, there are still no failed events!</p>'
            html += `<button onclick="checkLog('${data.fname} ${data.lname}')" class="btn btn-success">Check Again</button>`;
        } else {
            for (var event in data.log) {
                html += '<p class="log-detail">' + Math.floor((Date.now() - event) / 60000) + " minutes ago : " + data.log[event] + '</p>';
            }
            html += `<button onclick="checkLog('${data.fname} ${data.lname}')" class="btn btn-success mybtn">Check Again</button>`;
            html += '</div>'
        }
        $('.main').html(html);
    });
}

$('.my-form').on('submit', function (data) {
    $.post($(this).attr('action'), $(this).serialize(), function (json) {
        if(json.new==true) $('.greeting').html("Hello, " + json.fname + "!");
        else $('.greeting').html("Welcome Back, " + json.fname + "!");
        var html = '<div class="log"><p class="log-header">Failed SMS Attempts Log</p>';

        if (json.totalLog == 0) {
            html += '<p class="no-event">surprizingly, there are no failed events</p>'
            html += `<button onclick="checkLog('${json.fname} ${json.lname}')" class="btn btn-success">Check Again</button>`;
        } else {
            for (var event in json.log) {
                html += '<p class="log-detail">' + Math.floor((Date.now() - event) / 60000) + " minutes ago : " + json.log[event] + '</p>';
            }
            html += `<button onclick="checkLog('${json.fname} ${json.lname}')" class="btn btn-success mybtn">Check Again</button>`;
        }
        html += '</div>'
        $('.main').html(html);
    }, 'json');
    return false;
});