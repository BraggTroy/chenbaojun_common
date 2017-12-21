

if(!window.T){
    window.T = {}
}

T.delegate = function (callback, scope, args) {
    var method = callback;
    return function () {
        var callArgs = args || arguments
        callArgs = Array.prototype.slice.call(arguments, 0);
        callArgs = callArgs.concat(args);
        return method.apply(scope || window, callArgs)
    }
}

