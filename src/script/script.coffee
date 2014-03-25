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
