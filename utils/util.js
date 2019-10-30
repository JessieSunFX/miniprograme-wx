const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const stringLengthJudge = (str,minLen,maxLen) =>{//字符是否介于某个范围之间
  if (str.replace(/[\u0391-\uFFE5]/g, "aa").length > maxLen || str.replace(/[\u0391-\uFFE5]/g, "aa").length < minLen){
    return false;
  }else{
    return true;
  }
}

const correctEmailAddr = str => {//电子邮箱检验
  let regEmail = /^\w+([.+-]\w+)*@\w+([.+-]\w+)*\.\w+([.+-]\w+)*$/;
  if (regEmail.test(str)){
    return true;
  }else{
    return false;
  }
}

const correctIDCard = str => {//身份证检验
  let regIDCard = /^\d{17}(\d|X|x)$/;
  if (regIDCard.test(str)) {
    return true;
  } else {
    return false;
  }
}

const correctPhoneNumber = str => {//手机号检验
  let regPhoneNumber = /^1[3456789]\d{9}$/;
  if (regPhoneNumber.test(str)) {
    return true;
  } else {
    return false;
  }
}

const correctLicenseNumber = str => {//车牌号检验
  let regLicenseNumber = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
  if (regLicenseNumber.test(str)) {
    return true;
  } else {
    return false;
  }
}

const characterLengthJudge = (str, minLen, maxLen) => {//汉字是否介于某个范围之间
  if (str.length > maxLen || str.length < minLen){
    return false;
  }
  let regCharacter = /^[\u0391-\uFFE5]+$/;
  if (regCharacter.test(str)) {
    return true;
  } else {
    return false;
  }
}




module.exports = {
  formatTime: formatTime,
  stringLengthJudge: stringLengthJudge,
  correctEmailAddr: correctEmailAddr,
  correctIDCard: correctIDCard,
  correctPhoneNumber: correctPhoneNumber,
  correctLicenseNumber: correctLicenseNumber,
  characterLengthJudge: characterLengthJudge
}
