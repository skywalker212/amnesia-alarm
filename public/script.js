$.ajax({
    url:'/time',
    success:function(data){
        var hours = (Date.now()-data.mili)/3600000;
        var mins = hours * 60;
        $('.time').html("Running Since "+Math.floor(hours) +" hours");
    }
});

$('.my-form').on('submit',function (){
    console.log('the form was submitted!');
    $.post($(this).attr('action'), $(this).serialize(), function(json) {
        $('.greeting').html("Hello, "+json.fname +"!");
        var log = '';
        json.log.forEach(function(data){
            log+=data +'\n';
        });
        var html = `
        <div class='log'>
            <p class='log-header'>Log:</p>
            <p class='log-info'>${log}</p>
        </div>
        `;
        $('.main').html(html);
      }, 'json');
    return false;
});