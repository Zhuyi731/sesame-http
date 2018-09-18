function getObjType(obj) {
    let type = Object.prototype.toString.call(obj),
        result;
    switch (type) {
        case "[object Object]":
            {
                result = "object";
            }
            break;
        case "[object Array]":
            {
                result = "array";
            }
            break;
        case "[object Number]":
            {
                result = isNaN(obj) ? "nan" : "number";
            }
            break;
        case "[object String]":
            {
                result = "string";
            }
            break;
        case "[object Null]":
            {
                result = "null";
            }
            break;
        case "[object Undefined]":
            {
                result = "undefined";
            }
            break;
        case "[object Boolean]":
            {
                result = "boolean";
            }
            break;
        case "[object Date]":
            {
                result = "date";
            }
            break;
        case "[object Function]":
            {
                result = "function";
            }
            break;
        case "[object Error]":
            {
                result = "error";
            }
            break;
        case "[object RegExp]":
            {
                result = "regExp";
            }
            break;
    }

}