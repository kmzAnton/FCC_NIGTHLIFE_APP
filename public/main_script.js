$('document').ready(function(){
  
  // SAVING LAST SEARCH  
  if(!$('span').is('.text-muted')){
    $('#searchForm').submit(function(){
      var searchInput = $('#search_input').val();
      localStorage.setItem('fcc_nightlife_lastSearch', searchInput);
    });
  }
  
  // CASE WHEN NOT AUTH-TED USER ENTER MAIN PAGE SUBSEQUENT TIME
  var count = 0;
  if(!$('span').is('.text-muted')){
    var store = localStorage.getItem('fcc_nightlife_lastSearch');
    if(store && count==0 && !$('div').is('.card')){
      $('#search_input').val(store);
      $('#searchForm').submit();
      count++;
    }
  }
  
  // UPDATING DB WITH NO PAGE RELOADED
  if($('span').is('.text-muted')===false){
    $("a[href='#']").attr('href', '/login')
  }else{
    $('.vote').click(function(e){
      e.preventDefault();
      var parentId = $(this).parents().parents().attr("id");
      var children = $(this).parents().children('span').children('span');
      var count = Number(children.text());
      
      // if(){}
      
      $.ajax({
        url: '/vote',
        type:'POST',
        data: {username: $('.text-muted').text(), eventData: parentId},
        // dataType:'json',
        error: function(a, err){console.log(err)},
        success: function(data){
          if(data=='userPushed'||data=='newEvent'){
            children.text((count*1+1).toString());
            $(e.target).text('I won\'t go');
            
          }else if(data=='userPulled'){
            children.text((count*1-1).toString());
            $(e.target).text('I\'ll go there!');
            
          }else{alert('Something goes wrong');}
        }
      });
    });
  }
});