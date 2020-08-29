
const elUserName = document.querySelector('#write-username');
const elPW = document.querySelector('#write-pw');
const elPWCheck = document.querySelector('#write-pw-check')
const elContent = document.querySelector('#write-content');
const elSubmitBtn = document.querySelector('#tweet-btn');
const elContentContainer = document.querySelector('#tweet-container');


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

window.onload = function(){
  fetch('https://twittler-miniproject.herokuapp.com/contents')
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


function deleteTweetfromDB() {
  let elDeleteBtn = document.querySelectorAll('.tweet-delete');
  elDeleteBtn.forEach(item => {
    item.addEventListener('click', event => {
      let uniqueId = event.path[1].getAttribute("value");
      fetch('http://localhost:3001/delete/' + uniqueId, {
        method: 'PUT'
      });
      clearTweetById(uniqueId);
    })
  })
}


function clearTweetById(id) {
  let elAllComment = document.querySelectorAll('.comment');
  elAllComment.forEach(x => {
    if(x.getAttribute("value") === id){
      x.remove();
    }
  });
}
