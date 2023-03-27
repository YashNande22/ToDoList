

module.exports.getDate = function () {    
let today  = new Date();
let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };



return today.toLocaleDateString("en-US", options);

}

module.exports.getDay = function() {
    
    
let today  = new Date();
let options = { weekday: 'long' };

return today.toLocaleDateString("en-US", options);

}

console.log(module.exports);