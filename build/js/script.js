$(function() {
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
  return $('#filter-switch').click(function() {
    return $('#all-filters').toggleClass('open');
  });
});

/*
//# sourceMappingURL=script.js.map
*/
