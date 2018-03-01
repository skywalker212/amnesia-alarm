console.log('script loaded!');

$('form').on('submit',function (){
    console.log('the form was submitted!');
    $.post($(this).attr('action'), $(this).serialize(), function(json) {
        console.log(json);
      }, 'json');
    return false;
});