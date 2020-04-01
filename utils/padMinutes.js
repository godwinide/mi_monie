module.exports = function(minutes){
    min = String(minutes);
    if(min.length == 1) return `0${min}`;
    else return min;
}