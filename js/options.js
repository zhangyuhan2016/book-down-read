let font = {
  size: 17,
  height: 35,
  next: {
    flag: false,
    tit: ''
  }
}

function addFont (boolean) {
  if (boolean) {
    font.size++
  } else {
    font.size--
  }
  $('body').attr('style', `line-height: ${font.height}px;font-size: ${font.size}px;`)
  $('#font-size').text(font.size)
}

function addHeight (boolean) {
  if (boolean) {
    font.height++
  } else {
    font.height--
  }
  $('body').attr('style', `line-height: ${font.height}px;font-size: ${font.size}px;`)
  $('#font-height').text(font.height)
}

function toggleStyle (boolean) {
  if(boolean){
    /* 设置 */
    $("#sseeList").fadeToggle()

  }else {
    /* 目录 */
    $("#sseett").fadeToggle()
    $('#book-list').toggleClass('show')
  }
  $('.setting-box').toggleClass('show')
}
function getTxtList () {
  /* 生成目录 */
  let tempList = $('pre').text().match(/(第(.+?)章(.+?)\n)/ig)
  tempList.forEach(function (i) {
    $('#book-list').append(`<div>${i}</div>`)
  })
  $('pre').html($('pre').text().replace(/(第(.+?)章(.+?)\n)/ig,`<div class="my-mm">$1</div>`))
  $("#book-list").on('click','div',function () {
    goMark($(this).index())
  })
}
  function goMark (i) {
    /*滚动到第一个mark*/
    var temp = document.querySelectorAll('.my-mm')[i]
    document.querySelector('body').scrollTop = offset(temp).top
  }
function offset(elem) {
  if(!elem) elem = this;

  var x = elem.offsetLeft;
  var y = elem.offsetTop;

  while (elem = elem.offsetParent) {
    x += elem.offsetLeft;
    y += elem.offsetTop;
  }
  return { left: x, top: y };
}
function createTT () {
  $('body').append(`<div class="setting-box">
    <div class="setting-sm">
    <div  id="sseett">设置</div>
    <div id="sseeList">目录</div>
</div>
    <div class="setting">
        <div id="setting-user">
        <div class="m-box font">
            <button>减少字号</button>
            <span id="font-size">18</span>
            <button>增大字号</button>
        </div>
        <div class="m-box height">
            <button>减少行距</button>
            <span id="font-height">30</span>
            <button>增大行距</button>
        </div>
        <div class="m-box">
            <button id="autoPage">自动翻页</button>
        </div>
        <div class="m-box">
            <div class="bg white ac"></div>
            <div class="bg green"></div>
            <div class="bg yellow"></div>
            <div class="bg black"></div>
        </div>
</div>
<div id="book-list">

</div>
    </div>
</div>
`)
}

function showTxt(){
  $("body").addClass('look')
  createTT()
  addFont(true)
  addHeight(true)
  $('.look #sseett').on('click',function () {
    toggleStyle(true)
  })
  $('.look #sseeList').on('click',function () {
    toggleStyle(false)
  })
  $('.height button').eq(0).on('click',function () {
    addHeight(false)
  })
  $('.height button').eq(1).on('click',function () {
    addHeight(true)
  })
  $('.font button').eq(0).on('click',function () {
    addFont(false)
  })
  $('.font button').eq(1).on('click',function () {
    addFont(true)
  })
  $('.bg').on('click', function () {
    $(this).siblings().removeClass('ac')
    $(this).addClass('ac')
    $('body').removeClass('white green black yellow').addClass($(this).attr('class').split(' ')[1])
  })
  $("#autoPage").on('click',function () {
    if(font.next.flag){
      /* 停止 */
      $(this).text('自动翻页')
      clearInterval(font.next.tit)
    }else {
      /* 开始 */
      $(this).text('停止翻页')
      font.next.tit = setInterval(function(){
        document.querySelector('body').scrollTop += 4
      },50)
    }
    font.next.flag = !font.next.flag
  })
  getTxtList()
}
window.showTxt = showTxt
/* 自动翻页可以采用 transform: translate3D();加上过渡效果会更平滑 */

// i = 0
// let t = setInterval(()=>{
//   i += 6
//   go("pre",i)
// },60)
// function go(selector,i){
//   document.querySelector(selector).style.transition = "0.6s"
//   document.querySelector(selector).style.transform = "translateY(-"+i+"px)"
// }

