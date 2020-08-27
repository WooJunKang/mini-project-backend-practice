
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



window.onload = function(){
  fetch('http://localhost:3001/contents')
    .then(response => response.json())
    .then(json => {
      for(obj of json){
        convertContentObjToEl(obj);
      }
      deleteTweetfromDB();
    })
  
}


function convertContentObjToEl(object) {
  let newElTweet = document.createElement('li')
  let newElUserName = document.createElement('span');
  let newElContent = document.createElement('div');
  let newElCreatedAt = document.createElement('span');
  // let newElUniqueId = document.createElement('data');
  let newElDeleteBtn = document.createElement('button');

  newElTweet.setAttribute('class', 'comment')
  newElUserName.setAttribute('class', 'username');
  newElContent.setAttribute('class', 'content');
  newElCreatedAt.setAttribute('class', 'tweet-timestamp');
  newElDeleteBtn.setAttribute('class', 'tweet-delete');
  newElTweet.setAttribute('value', object._id);

  newElUserName.textContent = object.user_name;
  newElCreatedAt.textContent = object.created_at;
  newElContent.textContent = object.content;
  newElDeleteBtn.textContent = '삭제';

  newElTweet.append(newElUserName, newElCreatedAt, newElContent, newElDeleteBtn);

  elContentContainer.append(newElTweet);
}

function convertElToObj(event) {
  let obj = {};
  obj.user = event.target.parentNode.querySelector('.username').textContent;
  obj.content = event.target.parentNode.querySelector('.content').textContent;
  obj.created_at = event.target.parentNode.querySelector('.tweet-timestamp').textContent;
  return obj;
}





function deleteTweetfromDB() {
  console.log('111');
  let elDeleteBtn = document.querySelectorAll('.tweet-delete');
  elDeleteBtn.forEach(item => {
    item.addEventListener('click', event => {
      let uniqueId = event.path[1].getAttribute("value");
      fetch('http://localhost:3001/delete/' + uniqueId, {
        method: 'PUT'
      });
      clearTweetById(uniqueId);
      // location.reload(true);
    })
  })
}

function clearAllInput() {

  elUserName.value = '';
  elContent.value = '';
  elPW.value = '';
  elPWCheck.value = '';

}

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

function clearTweetById(id) {
  let elAllComment = document.querySelectorAll('.comment');
  elAllComment.forEach(x => {
    if(x.getAttribute("value") === id){
      x.remove();
    }
  });
}
