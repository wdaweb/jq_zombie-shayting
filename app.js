// 玩法說明
Swal.fire({
  icon: 'info',
  title: 'How to play',
  text: `catch pikachu : 1 point
      catch match : 2 points`
})

// 分數
let score = 0
// 倒數時間
let countdown = 60
// 計時器
let timer = 0
// 最高分
const highest = { score: 0, name: '???' }
// 讀取資料
const storage = JSON.parse(localStorage.getItem('pikacatch'))
if (storage) {
  highest.name = storage.name
  highest.score = storage.score
  $('#bestPlayer').text(highest.name)
  $('#highestScore').text(highest.score)
}
// 隨機移動
const move = (pokemon) => {
  const top = `${Math.round(Math.random() * 75)}%`
  const left = `${Math.round(Math.random() * 80)}%`
  pokemon.stop().animate({
    top,
    left
  }, 2500, function () {
    move(pokemon)
  })
}

$('#btnStart').click(function () {
  // 按鈕失效
  $(this).attr('disabled', true)
  // 隱藏按鈕
  $(this).css('display', 'none')
  // 重設時間＆分數
  score = 0
  $('#score').text(score)
  countdown = 60
  $('#time').text(countdown)
  // 重設時間條
  $('#timebar').attr('value', countdown)
  // 清空寶貝球
  $('.catched').remove()
  $('.wrongCatched').remove()
  // 遊戲開始
  timer = setInterval(function () {
    // 倒數開始
    countdown--
    $('#time').text(countdown)
    // 時間條 update
    $('#timebar').attr('value', countdown)

    // 隨機產生寶可夢
    // 隨機數（用於機率）
    let random = Math.round(Math.random() * 10)
    // 隨機寶可夢編號
    let randomPic = Math.ceil(Math.random() * 15)
    // 當隨機數大於五，且寶可夢數量小於15 就產生一隻寶可夢
    if (random > 5 && $('#game .pokemon').length < 15) {
      // 在隨機位置出現
      const top = `${Math.round(Math.random() * 75)}%`
      const left = `${Math.round(Math.random() * 85)}%`
      const pokemon = $(`<img class='pokemon' src="./img/${randomPic}.gif" style="top:${top};left:${left}">`)
      // 寶可夢移動
      move(pokemon)
      // 產生隨機寶可夢
      $('#game').append(pokemon)
    }

    // 隨機產生皮卡丘
    // 隨機數2
    let random2 = Math.round(Math.random() * 10)
    // 當機數大於六且畫面中皮卡丘數量少於7
    if (random2 > 6 && $('#game .pikachu').length < 7) {
      // 隨機出現位置
      const top = `${Math.round(Math.random() * 85)}%`
      const left = `${Math.round(Math.random() * 85)}%`
      const pikachu = $(`<img class='pikachu' src="./img/pikachu.gif" style="top:${top};left:${left}">`)
      // 皮卡丘移動
      move(pikachu)
      // 產生皮卡丘
      $('#game').append(pikachu)
    }

    // 時間到
    if (countdown <= 0) {
      clearInterval(timer)
      $('#btnStart').attr('disabled', false)
      $('#btnStart').css('display', 'block')
      // 清除畫面上的寶可夢
      $('#game .pokemon').remove()
      $('#game .pikachu').remove()
      if (score <= highest.score) {
        // 跳出得分訊息
        Swal.fire({
          icon: 'info',
          title: 'Game Over',
          text: `You got ${score} points`
        })
        // 紀錄最高分
      } else {
        Swal.fire({
          title: `You got ${score} points`,
          input: 'text',
          text: 'You are the best player!',
          inputLabel: 'Please enter your name',
        }).then(result => {
          console.log(result.value)
          highest.name = result.value || '???'
          console.log(highest);
          $('#bestPlayer').text(highest.name)
          highest.score = score
          $('#highestScore').text(score)
          localStorage.setItem('pikacatch', JSON.stringify(highest))
        })
      }
    }
  }, 1000)

  // 隨機更換目標
  function changeTarget() {
    let randomTarget = Math.ceil(Math.random() * 15)
    const target = $(`<img class='pokemon' src="./img/${randomTarget}.gif">`)
    $('#target').html(target)
  }
  changeTarget()
  // 每3秒隨機更換目標
  targetTimer = setInterval(function () {
    changeTarget()
    // 時間到 停止產生隨機目標
    if (countdown <= 0) {
      clearInterval(targetTimer)
      $('#target').html(`<img class='pokemon' src="./img/ready.gif">`)
    }
  }, 3000)

  // 背景轉換
  let bgNum = 1
  bgChange = setInterval(function () {
    bgNum++
    $('#game').css('background', `url("./img/bg0${bgNum}.jpg") no-repeat 100% / cover`)
    if (countdown <= 0) {
      // 重設背景
      $('#game').css('background', `url("./img/bg01.jpg") no-repeat 100% / cover`)
      clearInterval(bgChange)
    }
  }, 15000)
})


$('#game').on('click', 'img', function () {
  // 點擊到皮卡丘加1分
  if ($(this).hasClass('pikachu')) {
    $(this).attr('src', './img/ballget.gif')
    $(this).stop()
    $(this).css({
      'width': '50px',
      'top': '',
      'bottom': '50px',
      // 無法點兩下選取
      'user-select': 'none',
      // 無法按住拖曳
      '-webkit-user-drag': 'none',
      // 忽略點擊事件
      'pointer-events': 'none'
    })
    $(this).removeClass('pikachu').addClass('catched')
    // 加一分
    score++
    $('#score').text(score)
    // 點擊到隨機目標 加2分
  } else if ($(this).attr("src") === $('#target').children().attr("src")) {
    $(this).attr('src', './img/ballget.gif')
    $(this).stop()
    $(this).css({
      'width': '50px',
      'top': '',
      'bottom': '50px',
      'user-select': 'none',
      '-webkit-user-drag': 'none',
      'pointer-events': 'none'
    })
    $(this).removeClass('pokemon').addClass('catched')
    score += 2
    $('#score').text(score)
    // 點錯就減1分
  } else {
    $(this).attr('src', './img/ballopen.gif')
    $(this).stop()
    $(this).css({
      'width': '75px',
      'top': '',
      'bottom': '50px',
      'user-select': 'none',
      '-webkit-user-drag': 'none',
      'pointer-events': 'none'
    })
    $(this).removeClass('pokemon').addClass('wrongCatched')
    score--
    $('#score').text(score)
  }
})