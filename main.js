
const elUserName = document.querySelector('#write-username');
const elPW = document.querySelector('#write-pw');
const elPWCheck = document.querySelector('#write-pw-check')
const elContent = document.querySelector('#write-content');
const elSubmitBtn = document.querySelector('#tweet-btn');
const elContentContainer = document.querySelector('#tweet-container');



// --------------------------------------------
/* Setting Date Format */
// --------------------------------------------
Number.prototype.padLeft = function() {
  if(this < 10) {
    return '0' + String(this);
  }
  else {
    return String(this);
  }
}

Date.prototype.format = function() {
  var yyyy = this.getFullYear();
  var month = (this.getMonth() + 1).padLeft();
  var dd = this.getDate().padLeft();
  var HH = this.getHours().padLeft();
  var mm = this.getMinutes().padLeft();
  var ss = this.getSeconds().padLeft();

  var format = [yyyy, month, dd].join('-') + ' ' + [HH, mm, ss].join(':');
  return format;
}
// --------------------------------------------

// --------------------------------------------
/* Create & Add & Delete Tweet */
// --------------------------------------------
function createContetObj() {
  let currentDate = new Date()
  let obj = {};

  obj['user'] = elUserName.value;
  obj['content'] = elContent.value;
  obj['created_at'] = currentDate.format();

  return obj;
}

function convertContentObjToEl(object) {
  let newElTweet = document.createElement('li')
  let newElUserName = document.createElement('span');
  let newElContent = document.createElement('div');
  let newElCreatedAt = document.createElement('span');
  let newElDeleteBtn = document.createElement('button');

  newElTweet.setAttribute('class', 'comment')
  newElUserName.setAttribute('class', 'username');
  newElContent.setAttribute('class', 'content');
  newElCreatedAt.setAttribute('class', 'tweet-timestamp');
  newElDeleteBtn.setAttribute('class', 'tweet-delete');

  newElUserName.textContent = object.user;
  newElCreatedAt.textContent = object.created_at;
  newElContent.textContent = object.content;
  newElDeleteBtn.textContent = '삭제';

  newElTweet.append(newElUserName, newElCreatedAt, newElContent, newElDeleteBtn);

  return newElTweet;

}

function convertElToObj(event) {
  let obj = {};
  obj.user = event.target.parentNode.querySelector('.username').textContent;
  obj.content = event.target.parentNode.querySelector('.content').textContent;
  obj.created_at = event.target.parentNode.querySelector('.tweet-timestamp').textContent;
  return obj;
}

function submitAnddisplayContent() {

  let pwCheck = isValidPw(elPW,elPWCheck);

  elSubmitBtn.addEventListener('click', event => {
// password validation check
if(pwCheck === 'err_invalid_pw'){
  alert('유효한 비밀번호를 입력하세요');
} else if(pwCheck === 'err_diff_pw'){
  alert('비밀번호가 다릅니다');
} else {
      // tweet작성 내용 obj로 만들기
      let newTweetObj = createContetObj();
      // 생성된 tweet DB(local storage)에 추가
      addObjToDB(newTweetObj);
      // 기존에 displayed된 모든 tweet element 삭제
      clearAllDisplayedTweet();
      // DB에 있는 모든 tweet display
      loadAllData();
      // 생성 후 input창 초기화
      clearAllInput();
      // 생성 후 삭제버튼 누를 시 삭제 되는 함수 실행
      deleteTweetfromDB(); 
}
  })
  
}

function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function deleteTweetfromDB() {
  let elDeleteBtn = document.querySelectorAll('.tweet-delete');
  elDeleteBtn.forEach(item => {
    item.addEventListener('click', event => {
      let deletedObj = convertElToObj(event);
      let targetVal = JSON.stringify(deletedObj);
      let targetId = getKeyByValue(localStorage, targetVal);

      localStorage.removeItem(targetId);
      clearAllDisplayedTweet();
      loadAllData();
      // 노출
      // event.target.parentNode.remove();
    })
  })
}

function clearAllInput() {

  elUserName.value = '';
  elContent.value = '';
  elPW.value = '';
  elPWCheck.value = '';

}

submitAnddisplayContent();
// --------------------------------------------


// --------------------------------------------
/* DATABASE (local storage) */
// --------------------------------------------

function generateUniqueId() {
  let uniqueId = 1;
  while(localStorage.getItem(String(uniqueId)) !== null){
    uniqueId++;
  }
  return uniqueId
}

function addObjToDB(object) {
  let id = generateUniqueId();
  localStorage.setItem(id, JSON.stringify(object));
}

function loadAllData() {
  let i = 1;
  while(localStorage.getItem(String(i)) !== null){
    let obj = JSON.parse(localStorage.getItem(String(i)));
    let el = convertContentObjToEl(obj)
    elContentContainer.prepend(el);
    i++;
  }
}


function clearAllDisplayedTweet() {
  let elAllComment = document.querySelectorAll('.comment');
  elAllComment.forEach(x => x.remove());
}

