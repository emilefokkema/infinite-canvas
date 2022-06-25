module.exports = function once(fn){
    let called = false;
    return (...args) => {
        if(called){
            return false;
        }
        called = true;
        fn(...args);
        return true;
    };
}