
/* Password Validation Check */
function isPwNumAnd4digit(pwInput) {
  if(!(Number.isNaN(Number(pwInput.value))) && pwInput.value.length === 4){
    return true;
  } else {
    return false;
  }
}

function  isTwoPwSame(pwInput,pwInputSecond) {
  if(pwInput.value === pwInputSecond.value){
    return true;
  } else {
    return false;
  }
}

function isValidPw(pwInput,pwInputSecond) {
  if(!isPwNumAnd4digit(pwInput)) {
    // alert('유효한 비밀번호를 입력하세요');
    pwInput.value = '';
    pwInputSecond.value = '';
    return 'err_invalid_pw';
  } else if(!isTwoPwSame(pwInput, pwInputSecond)) {
    // alert('비밀번호가 다릅니다');
    pwInput.value = '';
    pwInputSecond.value = '';
    return 'err_diff_pw';
  } else {
    return 'pass';
  }
}

// export {isValidPw};