'use strict';

$(function () {

  var $grid = $('.grid');
  var $black = $('.blackDisplay');
  var $blue = $('.blueDisplay');
  var $winner = $('.winner');
  var squares = 64; //8kali8 untuk papan

  setupGrid();

  var $lis = $grid.find('li');
  var turn = 'blue';

  $lis.on('click', Jalan);

  function setupGrid() {
    $grid.empty();

    while (squares--) {
      $grid.append('<li />');
    }
    //untuk titik awal permainan
    $('li:eq(27), li:eq(36)').addClass('blue');
    $('li:eq(28), li:eq(35)').addClass('black');

  }
  //buat jalan ke target yang diinginkan
  function Jalan(e) {
    var $el = $(e.target);
    if (cellIsFree($el)) checkForMatches($el);
  }

  function checkForMatches($el) {
    var index = $lis.index($el);
    var validMoves = [1, 9, 8, 7, -1, -9, -8, -7].filter(function (n) {
      return checkDirection(n, index);
    });
    if (validMoves.length) {
      $el.addClass(turn);
      toggleTurn();
    }
  }
  //ada yang nempatin tidak 
  function cellIsFree($el) {
    return !$el.hasClass('blue') && !$el.hasClass('black');
  }

  function toggleTurn() {
    turn = opposingColor(turn);
    $grid.toggleClass('blueGo blackGo');
  }

  function opposingColor(currentTurn) {
    return currentTurn === 'blue' ? 'black' : 'blue';
  }

  function overTepi(n, index) {
    return overTop(n, index) || overBottom(n, index) || overRight(n, index) || overLeft(n, index);
  }

  function overTop(n, index) {
    return index + n < 0;
  }

  function overBottom(n, index) {
    return index + n > 63;
  }

  function overLeft(n, index) {
    return index % 8 === 0 && (index + n) % 8 === 7;
  }

  function overRight(n, index) {
    return index % 8 === 7 && (index + n) % 8 === 0;
  }

  function checkDirection(n, index) {
    var toFlip = [];
    var looping = true;

    while (looping) {
      if (checkIfTepi(index) && overTepi(n, index)) {
        looping = false;
        break;
      }
      index += n;
      var $el = $lis.eq(index);
      if (!$el.hasClass(opposingColor(turn))) looping = false;else toFlip.push($el);
    }

    if (toFlip.length) return Validasi(toFlip, n);
  }

  function Validasi(toFlip, n) {
    var $el = toFlip[toFlip.length - 1];
    var index = $lis.index($el);

    if (checkIfTepi(index) && overTepi(n, index)) {
      toFlip = [];
    }
    if (toFlip.length && $lis.eq(index + n).hasClass(turn)) {
      flipCounters(toFlip);
      return true;
    }

    return false;
  }

  function flipCounters(toFlip) {
    var classToAdd = turn;
    $.each(toFlip, function (i, $el) {
      setTimeout(function () {
        return addClasses($el, classToAdd);
      }, 100 * (i + 1));
    });
  }

  function addClasses($el, classToAdd) {
    $el.addClass(classToAdd + ' pulse').removeClass(opposingColor(classToAdd)).delay(1000).queue(function () {
      $el.removeClass('pulse').dequeue();
    });
    updateDisplay();
  }

  function checkIfTepi(index) {
    return index < 8 || index > 55 || index % 8 === 0 || index % 8 === 7;
  }


});
