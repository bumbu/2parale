$ ->
  $('[data-toggle="tooltip"]').tooltip()

  # Process amounts
  $('[data-process="amounts"]').each ()->
    $this = $(@)

    $amounts = $this.find '.price'

    max = Array.prototype.slice.apply $amounts.map ()->
      return parseFloat($(@).data('value')) || 0
    .reduce (prev, curr)->
      return Math.max prev, curr

    $amounts.each ()->
      $price = $(@)
      price_value = parseFloat($price.data('value'))
      color = $price.data('color') || ''

      $price.parent().append("<span class=\"progresser #{color}\"><span class=\"amount\" style=\"width:" + Math.ceil(100* price_value / max) + '%">' + Math.ceil(100* price_value / max) + '%</span></span>')

  $('#filter-switch').click ()->
    $('#all-filters').toggleClass('open')

  ################
  ## Notifications
  ################
  $notificationsContainer = $ '#notifications-container'
  $notificationsMore = $ '#more'
  notificationTemplate = $notificationsContainer.data 'templateNotification'
  notificationDateTemplate = $notificationsContainer.data 'templateDate'
  notificationsPage = 0
  notificationsPageMax = -1
  notificationsLoading = false
  notificationsLastDay = null
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Noi', 'Dec']
  typeMap =
    campaign:
      title: 'Campanie'
      color: 'red'
      icon: 'bullhorn'
    commission:
      title: 'Comision'
      color: 'orange'
      icon: 'usd'
  colors = ['green', 'blue', 'orange', 'red', '']
  campaigns = [] # cache campaigns
  getCampaignColor = (title)->
    if campaigns.indexOf(title) is -1
      campaigns.push(title)

    return colors[campaigns.indexOf(title) % 5]

  notificationsDisplay = (notifications)->
    for notification in notifications
      type = typeMap[notification.type]
      date = new Date(+notification.datetime)
      # Reset date to the beggining of the day
      date.setHours(0)
      date.setMinutes(0)
      date.setSeconds(0)
      date.getMilliseconds(0)

      if notificationsLastDay is null or notificationsLastDay-date isnt date-notificationsLastDay
        notificationsLastDay = date
        $notificationsContainer.append $ notificationDateTemplate.replace('{date}', "#{date.getDate()} #{months[date.getMonth()]} #{date.getFullYear()}")
      notificationHtml = notificationTemplate
        .replace('{type}', type.title)
        .replace('{type-color}', type.color)
        .replace('{icon}', type.icon)
        .replace('{campaign}', notification.campaign_title)
        .replace('{campaign-color}', getCampaignColor(notification.campaign_title))
        .replace('{description}', notification.description)
      $notificationsContainer.append $ notificationHtml

  $(window).on 'scroll', ()->
    # Do not process if loading new notifications
    if notificationsLoading then return

    # Do not process if all posts are loaded
    if notificationsPageMax isnt -1 and notificationsPage >= notificationsPageMax then return

    if notificationsPage is 0
      # Check if notification container is visible
      if ($notificationsContainer.visible(true))
        # There is nothing, load first page
        notificationsPage += 1
        notificationsLoading = true
        $.ajax
          url: "json/page#{notificationsPage}.json"
          dataType: 'json'
          beforeSend: ()->
            # Set loading icon/message
            $notificationsContainer.html 'Loading...'
          success: (data)->
            $notificationsContainer.empty() # Empty notifications container

            notificationsPageMax = +data.total_pages
            notificationsDisplay data.notifications

          complete: ()->
            notificationsLoading = false
            $(window).scroll() # Trigger scroll so that script will check again for data visibility
    else
      if $notificationsMore.visible(true)
        # There is something, load other pages
        notificationsPage += 1
        notificationsLoading = true
        $.ajax
          url: "json/page#{notificationsPage}.json"
          dataType: 'json'
          beforeSend: ()->
            # Set loading icon
          success: (data)->
            notificationsPageMax = +data.total_pages
            notificationsDisplay data.notifications

            # Hide load more button
            if notificationsPageMax is notificationsPage
              $notificationsMore.hide()
          complete: ()->
            notificationsLoading = false
            $(window).scroll() # Trigger scroll so that script will check again for data visibility
