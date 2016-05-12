$(document).ready(function(){
  showPane($('.nav a').first().data('pane'));

  jQuery.timeago.settings.strings = {
    minute: "a minute ago",
    minutes: "%d minutes ago",
    hour: "an hour ago",
    hours: "%d hours ago",
    day: "yesterday",
    days: "%d days ago",
    month: "last month",
    months: "%d months ago",
    year: "last year",
  };

});

$('.nav a').click(function (e) {
  e.preventDefault();
  var liParent = $(this).parent();
  if(liParent.hasClass('active')) {
    return;
  }
  $('.nav li').removeClass('active').filter(liParent).addClass('active');

  var sectionKey = $(this).data('pane');
  
  showPane(sectionKey);
});

function showPane(sectionKey) {
  var contentPane = $('#'+sectionKey);
  $('.tab-pane').removeClass('active').filter(contentPane).addClass('active');

  if(!contentPane.data('isLoaded')) {
    contentPane.html('<div class="loader"><i class="loading-icon"></i></div>')
    getSection(sectionKey, function(result) {
      var news = [];
      result.response.results.forEach(function(item, idx) {
        console.log(item);
        news.push(
          $('<div class="story">')
          .append(
            $('<span class="webIndex">').text(idx+1)
          )
          .append(
            $('<a class="webTitle" target="_blank">').attr('href', item.webUrl).text(item.webTitle)
          )
          .append(
            $('<time class="hidden-xs hidden-sm">').text($.timeago(item.webPublicationDate))
          )
        );
      });
      contentPane.html(news);
      contentPane.data('isLoaded', true);
    });
  }
}

function getSection(sectionKey, sucessCb) {
  $.ajax({
    type:'get',
    url: 'http://content.guardianapis.com/search',
    data: {
      'api-key': '9wur7sdh84azzazdt3ye54k4',
      section: sectionKey
    },
    success: sucessCb,
    error: function(e) {
      console.log('API Error', e);
    }
  })
}