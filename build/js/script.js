$(function() {
  var $notificationsContainer, $notificationsMore, campaigns, colors, getCampaignColor, months, notificationDateTemplate, notificationTemplate, notificationsDisplay, notificationsLastDay, notificationsLoading, notificationsPage, notificationsPageMax, typeMap;
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-process="amounts"]').each(function() {
    var $amounts, $this, max;
    $this = $(this);
    $amounts = $this.find('.price');
    max = Array.prototype.slice.apply($amounts.map(function() {
      return parseFloat($(this).data('value')) || 0;
    })).reduce(function(prev, curr) {
      return Math.max(prev, curr);
    });
    return $amounts.each(function() {
      var $price, color, price_value;
      $price = $(this);
      price_value = parseFloat($price.data('value'));
      color = $price.data('color') || '';
      return $price.parent().append(("<span class=\"progresser " + color + "\"><span class=\"amount\" style=\"width:") + Math.ceil(100 * price_value / max) + '%">' + Math.ceil(100 * price_value / max) + '%</span></span>');
    });
  });
  $('#filter-switch').click(function() {
    return $('#all-filters').toggleClass('open');
  });
  $notificationsContainer = $('#notifications-container');
  $notificationsMore = $('#more');
  notificationTemplate = $notificationsContainer.data('templateNotification');
  notificationDateTemplate = $notificationsContainer.data('templateDate');
  notificationsPage = 0;
  notificationsPageMax = -1;
  notificationsLoading = false;
  notificationsLastDay = null;
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Noi', 'Dec'];
  typeMap = {
    campaign: {
      title: 'Campanie',
      color: 'red',
      icon: 'bullhorn'
    },
    commission: {
      title: 'Comision',
      color: 'orange',
      icon: 'usd'
    }
  };
  colors = ['green', 'blue', 'orange', 'red', ''];
  campaigns = [];
  getCampaignColor = function(title) {
    if (campaigns.indexOf(title) === -1) {
      campaigns.push(title);
    }
    return colors[campaigns.indexOf(title) % 5];
  };
  notificationsDisplay = function(notifications) {
    var date, notification, notificationHtml, type, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = notifications.length; _i < _len; _i++) {
      notification = notifications[_i];
      type = typeMap[notification.type];
      date = new Date(+notification.datetime);
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.getMilliseconds(0);
      if (notificationsLastDay === null || notificationsLastDay - date !== date - notificationsLastDay) {
        notificationsLastDay = date;
        $notificationsContainer.append($(notificationDateTemplate.replace('{date}', "" + (date.getDate()) + " " + months[date.getMonth()] + " " + (date.getFullYear()))));
      }
      notificationHtml = notificationTemplate.replace('{type}', type.title).replace('{type-color}', type.color).replace('{icon}', type.icon).replace('{campaign}', notification.campaign_title).replace('{campaign-color}', getCampaignColor(notification.campaign_title)).replace('{description}', notification.description);
      _results.push($notificationsContainer.append($(notificationHtml)));
    }
    return _results;
  };
  return $(window).on('scroll', function() {
    if (notificationsLoading) {
      return;
    }
    if (notificationsPageMax !== -1 && notificationsPage >= notificationsPageMax) {
      return;
    }
    if (notificationsPage === 0) {
      if ($notificationsContainer.visible(true)) {
        notificationsPage += 1;
        notificationsLoading = true;
        return $.ajax({
          url: "json/page" + notificationsPage + ".json",
          dataType: 'json',
          beforeSend: function() {
            return $notificationsContainer.html('Loading...');
          },
          success: function(data) {
            $notificationsContainer.empty();
            notificationsPageMax = +data.total_pages;
            return notificationsDisplay(data.notifications);
          },
          complete: function() {
            notificationsLoading = false;
            return $(window).scroll();
          }
        });
      }
    } else {
      if ($notificationsMore.visible(true)) {
        notificationsPage += 1;
        notificationsLoading = true;
        return $.ajax({
          url: "json/page" + notificationsPage + ".json",
          dataType: 'json',
          beforeSend: function() {},
          success: function(data) {
            notificationsPageMax = +data.total_pages;
            notificationsDisplay(data.notifications);
            if (notificationsPageMax === notificationsPage) {
              return $notificationsMore.hide();
            }
          },
          complete: function() {
            notificationsLoading = false;
            return $(window).scroll();
          }
        });
      }
    }
  });
});
