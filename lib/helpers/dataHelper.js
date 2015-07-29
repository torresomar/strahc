var _ = require('lodash');

var isFalsyCollection = function(data){
    if(_.isEmpty(data) || _.isNull(data) || _. isUndefined(data)){
        return true;
    }
    return false;
};

module.exports = {
   isFalsyCollection: isFalsyCollection 
};
