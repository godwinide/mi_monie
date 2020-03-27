const accNumGen = len => `101${String(Math.random()).slice(2,len+2)}`;
const accIDGen = len => `ena${String(Math.random()).slice(2,len)}`;
const paddNum =  num => {
    if(num.length < 5){
        return paddNum(`0${num}`)
    }else{
        return "ena" + num;
    }
}

module.exports = {
    accNumGen,
    accIDGen,
    paddNum
}