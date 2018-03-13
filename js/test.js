/* 修正章节内容 删除多余脚本*/
function getContent(data) {
  let tempStr = ''
  try {
    tempStr = /<div id="content" name="content">([\s\S]*)<\/div>/.exec(data)[1].replace(/<script[^>]*>([\s\S]*)<\/script>/ig, '')
  } catch (err) {
    tempStr = ''
  }
  return tempStr
}

/* 生成TxT */
function downText() {
  /* 设置 */
  $('#top_tip').text('请等待我上面出现下载链接')
  getAllTxt()

}

/* 生成下载链接 */
function creatLink() {
  let text = $('#my_book_txt').text().replace(/[<br>|</br>|\?]/g, '\r\n').replace(/\s+/g, '\r\n\r\n').replace(/\^\^\^/ig, '  ')
  let name = $('#info h1').text()
  let type = 'text/plain'
  var a = document.getElementById('downBook')
  var file = new Blob([text], { type: type })
  a.href = URL.createObjectURL(file)
  a.download = name
  $('#downBook').show()
}

/* Ajax获取所选的章节内容 */
function getAllTxt() {
  let arr = []
  let titleArr = []
  $('#my_list input:checked').each(function () {
    let url = $(this).siblings('span').attr('data-url')
    titleArr.push($(this).siblings('span').text())
    arr.push(createGet(url))
  })
  axios.all(arr)
    .then(res => {
      let tt = document.createElement('div')
      tt.id = 'my_book_txt'
      let tempData = ''
      for (let i = 0; i < res.length; i++) {
        tempData += '\r\n' + titleArr[i].replace(/\s/g, '^^^') + '\r\n' + getContent(res[i].data)
      }
      tt.innerHTML = tempData
      $('body').append(tt)
      /* 生成下载链接 */
      creatLink()
    }).catch(err => {
      alert('对不起,下载失败')
      console.log('--err--', err)
    })
}

/* 生成目录选择 */
function createList() {
  /* 获取目录 */
  let tempList = `<div id="cc_box">
        <button id="createBook">创建txt</button>
        <a style="display: none;" href="javascript:alert('创建失败')" id="downBook">点击下载电子书</a>
    </div><div id="top_tip">将下载勾选的章节到txt中</div><label for="checkInput">全选</label><input type="checkbox" checked id="checkInput">`
  $('#list a').each(function () {
    tempList += createOption(`<span data-url="${$(this).attr('href')}">${$(this).text()}</span>`)
  })
  $('body').append(`<div id="my_list">${tempList}</div>`)
  addMyClass()
  $('#createBook').on('click', function () {
    toggleStart(true)
    downText()
  })
  $("#checkInput").on('click', function () {
    let flag = $(this).prop('checked')
    $(".my_book_box input").prop('checked', flag)
  })
}
/* 节选 */
function checkSome(min,max){
  $(".my_book_box input").each(function(i){
    if(i <= max && i >= min){
      $(".my_book_box input").eq(i).prop("checked",true)
    }
  })
}
function toggleStart(flag) {
  if (flag) {
    $("#createBook").attr('style',`min-width: 100px;
    font-size: 16px;
    margin-bottom: 10px;height: 30px;cursor: no-drop;pointer-events: none;`)
  } else {
    $("#createBook").attr('style',`min-width: 100px;
    font-size: 16px;
    margin-bottom: 10px;height: 30px;`)
  }
  $("#createBook").prop('disabled', flag).text('如需重选章节,请刷新页面')
}

/* 添加章节 */
function createOption(a) {
  let op = `<div class="my_book_box">
    ${a}
    <input type="checkbox" checked>
  </div>`
  return op
}

/* 判断当前页面 */
function checkPage() {
  if (/\/(.*?)\//.exec(location.pathname)) {
    if (!location.pathname.includes('.html')) {
      /* 当前为目录页 */
      return true
    }
  }
  return false
}

/* 添加style */
function addMyClass() {
  /* 添加目录样式 */
  $('#my_list').attr('style', `
    background: #181818;
    left: 0;
    top: 0;
    padding: 20px;
    box-sizing: border-box;
    font-size: 15px;
    position: fixed;
    z-index: 999;
    overflow-y: scroll;
    font-size: 16px;
    color: white;
    height: 100vh;
    `)
  /* 添加章节样式 */
  $('.my_book_box').attr('style', `display: flex;
    height: 25px;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    width: 100%;`)
  $('.my_book_box span').attr('style', `display: block;flex: 1;`)
  $('.my_book_box input').attr('style', `display: block;
    width: 20px;
    height: 20px;
    border-radius: 10px;`)
  /* 添加checkbox样式 */
  /* 添加body */
  $('body').attr('style', 'margin-left: 300px;')
  /* 添加tip */
  $('#top_tip').attr('style', `text-align: center;color: #3cd104;padding: 25px 0;`)
  /* 操作 */
  $('#cc_box').attr('style', `display: flex;
    flex-direction: column;
    align-items: center;`)
  $('#cc_box button').attr('style', `min-width: 100px;
    font-size: 16px;
    margin-bottom: 10px;height: 30px;`)
}
/* 创建axios */
function createGet(url) {
  let api = location.href
  return axios.get(api + url)
}
/* txt阅读 */
function lookTxt() {
  $("body").append(`<div>增大字号</div>`)
}
/* 主线任务 */
function start() {
  if (location.protocol === 'file:') {
    /* 打开txt */
    return showTxt()
  }
  if (checkPage()) {
    /* 创建目录 */
    createList()
  } else {
    $('body').append(`<div id="my_tip" style="z-index: 999;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    background: #cdcdcd;
    color: black;
    font-size: 20px;
    min-height: 40px;
    text-align: center;
    line-height: 40px;
    font-weight: bold;">当前页面不是小说目录页,请切换至目录页使用</div>`)
  }
}
/* 开始 */
start()