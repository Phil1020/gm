
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
};

var Utils = Utils || {};

Utils.alertMgr = {
    count: 0,
    num: 0,
    getCounter : function() {
        Utils.alertMgr.count++;
        return Utils.alertMgr.count;
    },
    alert: function (msg, type, time) {
        time = time || 2500;
        if (Utils.alertMgr.num == 0) $(".alert_content").empty();
        let id = Utils.alertMgr.getCounter();
        let html = "<div class=\"alert " + type + " alert-id-" + id + "\" style=\"display:none;\" role=\"alert\"><strong>" + msg + "</strong></div>";
        $(".alert_content").append(html);
        $(".alert-id-" + id).show(400);
        Utils.alertMgr.num++;
        window.setTimeout(function () {
            $(".alert-id-" + id).hide(400);
            Utils.alertMgr.num--;
        }, time);
        ScroolTop();
    }
};

Utils.alert = function (msg, time) {
    //alert(msg);
    Utils.alertMgr.alert(msg, "alert-danger", time);
};

Utils.success = function (msg, time) {
    Utils.alertMgr.alert(msg, "alert-success", time);
};

Utils.confirm = function (content, funcConfirm, funcCancel) {
    $.confirm({
        icon: 'glyphicon glyphicon-warning-sign',
        title: 'FBI WARNING!',
        animation: 'rotateY',
        closeAnimation: 'rotateY',
        confirmButton: 'YES',
        cancelButton: 'NO',
        content: content,
        confirmButtonClass: 'btn-info',
        cancelButtonClass: 'btn-danger',
        confirm: funcConfirm,
        cancel: funcCancel
    });
};

Utils.confirmWithKey = function (content, funcConfirm, funcCancel) {
    $.confirm({
        icon: 'glyphicon glyphicon-warning-sign',
        title: 'FBI WARNING!',
        animation: 'rotateY',
        closeAnimation: 'rotateY',
        confirmButton: 'OKAY',
        cancelButton: 'CLOSE',
        keyboardEnabled: true,
        content: `${content} <input id="confirm_with_key_pwd" class="form-control" type="password" placeholder="please typing super key!!!"/>`,
        confirmKeys: [13],
        cancelKeys: [27],
        confirmButtonClass: 'btn-info',
        cancelButtonClass: 'btn-danger',
        confirm: funcConfirm,
        cancel: funcCancel,
    });
};

////以下库函数改造自 Tencent milo-lib

function getParamType(obj) {
    return obj == null ? String(obj) :
        Object.prototype.toString.call(obj).replace(/\[object\s+(\w+)\]/i, "$1") || "object";
}

Utils.isUndefined = function(o){ 
    return o === undefined && typeof o == "undefined";
};

Utils.isType = function(type, obj) {
    return getParamType(obj).toLowerCase() === type;
};

Utils.isArray = function(obj) {
    return Utils.isType("array", obj);
};

Utils.isFunction = function (obj) {
    return Utils.isType("function", obj);
};

Utils.isObject = function (obj) {
    return Utils.isType("object", obj);
};

Utils.isNumber = function (obj) {
    return Utils.isType("number", obj);
};

Utils.isInteger = function (obj) {
    return parseInt(obj) == obj;
};

Utils.isString = function (obj) {
    return Utils.isType("string", obj);
};

Utils.isBoolean = function (obj) {
    return Utils.isType("boolean", obj);
};

Utils.isDate = function (obj) {
    return Utils.isType("date", obj);
};

Utils.isEmpty = function(s) {
    return !s || s == "" || s == "0";
};

Utils.numMax = function(a, b) {
    return a > b ? a : b;
};

Utils.numMin = function (a, b) {
    return a < b ? a : b;
};

/**
    * 类式继承类
    * @param {object} subClass 子类
    * @param {object} superClass 基础类
    * @return {undefined} 
    */
Utils.extends = function (subClass, superClass) {
    let F = function () { };
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    subClass.superclass = superClass.prototype;
    if (superClass.prototype.constructor == Object.prototype.constructor) {
        superClass.prototype.constructor = superClass;
    }
};

/**
    * 原型继承类
    * @param {object} object 基类
    * @return {object} 生成的子类
    */
Utils.clone = function (object) {
    if (!Utils.isObject(object)) return object;
    if (object == null) return object;
    let F = new Object();
    for (let i in object)
        F[i] = Utils.clone(object[i]);
    return F;
};

Utils.json2str = function (o) {
    if (typeof (o) == "undefined") return "undefined";
    let arr = [];
    if (Utils.isArray(o)) {
        for (let i = 0; i < o.length; i++)
            arr.push(Utils.json2str(o[i]));
        return '[' + arr.join(',') + ']';
    } else if (typeof(o) == "object") {
        for (let i in o)
            arr.push("'" + i + "':" + Utils.json2str(o[i]));
        return '{' + arr.join(',') + '}';
    } else if (typeof (o) == "number") {
        return o.toString();
    }
    return "'" + o.toString() + "'";
};

Utils.str2json = function (s) {
    if (!s || s == "") s = "0";
    let text = "let str2jsonObj = " + s + ";";
    eval(text);
    let ret = str2jsonObj;
    return ret;
};

Utils.query = function (method, args, callback, ignoreError) {
    if (!args || !args.uin || args.uin <= 0) {
        $("#uin_input").focus();
        Utils.alert("请先使用UIN查询！");
        return;
    }
    Utils.queryWithoutUin(method, args, callback, ignoreError);
};

Utils.queryWithoutUin = function (method, args, callback, ignoreError) {
    args = args || {};

    args = Local.account.combineGetArgs(args);

    let server = Local.server;
    //console.log("---",server);
    showDialog.showLoading();
    let url = "http://" + server + "/" + method;
    args["t"] = Math.floor(Math.random() * (1e9));
    $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        data: args,
        // headers: {
        //     "Authorization": `Bearer ${token}`,
        // },
        success: function (res) {
            showDialog.hide();
            if (res.result == 0) {
                callback(res.msg);
            } else {
                Utils.alert("服务器错误：" + Utils.json2str(res.error));
                if (ignoreError) callback();
            }
        },
        error: function () {
            Utils.alert("请求服务器错误！");
            if (ignoreError) callback();
        }
    });
};

Utils.actionPost = function (method, args, callback) {
    args = args || {};
    args = Local.account.combineGetArgs(args);
    let server = Local.server;
    showDialog.showLoading();
    let url = `http://${server}/${method}`;
    args["t"] = Math.floor(Math.random() * (1e9));
    $.ajax({
        method: "POST",
        url: url,
        dataType: "json",
        data: args,
        // headers: {
        //     "Authorization": `Bearer ${token}`,
        // },
        success: function (res) {
            showDialog.hide();
            if (res.result == 0) {
                callback(res.msg);
            } else {
                Utils.alert("服务器错误：" + Utils.json2str(res.error));
            }
        },
        error: function () {
            Utils.alert("请求服务器错误！");
        }
    });
};

Utils.actionPostWithKey = function (method, args, callback) {
    args = args || {};
    args = Local.account.combineGetArgs(args);
    let server = Local.server;
    showDialog.showLoading();
    let url = `http://${server}/${method}`;
    args["t"] = Math.floor(Math.random() * (1e9));
    let obj = $("#confirm_with_key_pwd");
    let key = args["key"] || "";
    if (!key && obj) {
        key = obj.val();
        args["key"] = key;
    }
    $.ajax({
        method: "POST",
        url: url,
        dataType: "json",
        data: args,
        success: function (res) {
            showDialog.hide();
            if (res.result == 0) {
                callback(res.msg);
            } else {
                Utils.alert("服务器错误：" + Utils.json2str(res.error));
            }
        },
        error: function (data) {
            showDialog.hide();
            if (data) {
                Utils.alert(data.status + ": " + data.responseJSON.message);
            } else {
                Utils.alert("请求服务器错误");
            }
        }
    });
};

Utils.ajaxUploadFileWithKey = function (method, formData, callback) {
    let server = Local.server;
    showDialog.showLoading();
    let url = `//${server}/${method}`;
    formData.append("t", Math.floor(Math.random() * (1e9)));
    let obj = $("#confirm_with_key_pwd");
    let key = obj.val();
    formData.set("key", key);
    $.ajax({
        method: "POST",
        url: url,
        dataType: "json",
        data: formData,
        enctype: 'multipart/form-data',
        cache:false,
        traditional: true,
        contentType: false,
        processData: false,
        success: function (res) {
            showDialog.hide();
            if (res.result == 0) {
                callback(res.msg);
            } else {
                Utils.alert("服务器错误：" + Utils.json2str(res.error));
            }
        },
        error: function (data) {
            showDialog.hide();
            if (data) {
                Utils.alert(data.status + ": " + data.responseJSON.message);
            } else {
                Utils.alert("请求服务器错误");
            }
        }
    });
};

Utils.ajaxFormSubmit = function (formId, url, method, callback) {
    let server = Local.server;
    //url = "http://" + server + "/" + url;
    showDialog.showLoading();
    $("#" + formId).ajaxSubmit({
        url: url,
        type: method,
        dataType: "json",
        // headers: {
        //     "Authorization": `Bearer ${token}`,
        // },
        success: function (res) {
            showDialog.hide();
            if (res.result == 0) {
                callback(res.msg);
            } else {
                Utils.alert("服务器错误：" + Utils.json2str(res.error));
            }
        },
        error: function () {
            Utils.alert("请求服务器错误！");
        }
    });
};

function PostCallBack(res) {
    if (res.result == 0) {
        Utils.success("请求成功");
        if (res.callback) {
            eval(res.callback + "();");
        }
    } else {
        Utils.alert("服务器错误：" + Utils.json2str(res.error), 7500);
    }
}

Utils.simpleQuery = function (url, callback, ignoreError) {
    if (url.indexOf("?") >= 0) url += "&";
    else url += "?";
    url += "t=" + Math.floor(Math.random() * (10e9));
    url += "&" + Local.account.parseUrl();
    showDialog.showLoading();
    $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        success: function (res) {
            showDialog.hide();
            if (res.result == 0) {
                callback(res.data);
            } else {
                Utils.alert("服务器错误：" + Utils.json2str(res.error));
                if (ignoreError) callback();
            }
        },
        error: function (a, b, c) {
            showDialog.hide();
            Utils.alert("请求服务器错误！");
            if (ignoreError) callback();
        }
    });
};

let BatchEngine = function (uin) {
    this.list = [];
    this.position = 0;
    this.uin = uin || "";
    let _this = this;
    
    this.push = function (method, args, uin) {
        if (Utils.isEmpty(uin)) {
            uin = _this.uin;
        }
        args["uin"] = uin;
        let arg = { "method": method, "args": args };
        _this.list.push(arg);
    };

    this.clear = function() {
        _this.list = [];
        _this.position = 0;
    };

    this.query = function (callback) {
        if (_this.position >= _this.list.length) {
            if (callback) callback();
            Utils.success("批量命令已全部提交完成");
            return;
        }
        let arg = _this.list[_this.position];
        Utils.query(arg.method, arg.args, function() {
            _this.position++;
            console.log(_this.position);
            _this.query(callback);
        }, true);
    };

    this.queryWithoutUin = function (callback) {
        if (_this.position >= _this.list.length) {
            if (callback) callback();
            Utils.success("批量命令已全部提交完成");
            return;
        }
        let arg = _this.list[_this.position];
        Utils.queryWithoutUin(arg.method, arg.args, function () {
            _this.position++;
            console.log(_this.position);
            _this.queryWithoutUin(callback);
        }, true);
    }
};

let AccountInfo = function() {
    this.logined = false;
    this.username = "";
    this.skey = "";
    this.login = function(username, password, callback) {
        this.logined = true;
        this.username = username;
        this.skey = password;
        if (callback) callback();
    };
    this.logout = function(callback) {
        this.logined = false;
        this.username = "";
        this.skey = "";
        if (callback) callback();
    };
    this.combineGetArgs = function(args) {
        args["username"] = this.username;
        args["skey"] = this.skey;
        return args;
    };
    this.parseUrl = function() {
        return "username=" + this.username + "&skey=" + this.skey;
    }
};

//Utils.BatchEngine = new Batching();

Utils.parseDT2Str = function(dt) {
    let t = new Date();
    t.setTime(dt.getTime() + 8 * 3600 * 1000);
    let s = t.toJSON().substr(0, 19);
    return s.substr(0, 10) + " " + s.substr(11, 9);
};

Utils.parseStr2DT = function(str) {
    if (!/^\d{1,4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/g.test(str)) {
        throw "日期格式错误！";
    }
    let t = str.split(" ");
    let date = t[0].split("-");
    let time = t[1].split(":");
    let ret = new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2]);
    if (isNaN(ret.getTime())) {
        throw "日期格式错误！";
    }
    return ret;
};

Utils.parseDT2Tick = function(dt) {
    return parseInt(dt.getTime() / 1000);
};

var PostTools = PostTools || {}

PostTools.getPostURL = function() {
    let url = location.href;
    let index = url.lastIndexOf("/");
    if (index > -1) url = url.substr(0, index + 1);
    url = url + "iframe.html";
    url = encodeURIComponent(url);
    return url;
};

PostTools.integerCheck = function(sourceid, targetid) {
    let num = $("#" + sourceid).val();
    if (!Utils.isInteger(num) || num <= 0) {
        Utils.alert("数据填写不合法，请检查");
        $("#" + sourceid).focus();
        throw 0;
    }
    $("#" + targetid).val(num);
};

PostTools.timeCheck = function(sourceid, targetid) {
    let time = $("#" + sourceid).val();
    let num = Utils.parseDT2Tick(Utils.parseStr2DT(time));
    if (!Utils.isInteger(num) || num <= 0) {
        Utils.alert("数据填写不合法，请检查");
        $("#" + sourceid).focus();
        throw 0;
    }
    $("#" + targetid).val(num);
};

PostTools.encodeStringCheck = function(sourceid, targetid) {
    let str = $("#" + sourceid).val();
    str = encodeURIComponent(str);
    $("#" + targetid).val(str);
};

PostTools.encodeAttachCheck = function(type, targetid) {
    let table = $("#notice_" + type + "attach_table");
    let rows = $("tr", table);
    let list = [];
    for (let i = 0; i < rows.length; i++) {
        let row = $(rows[i]);
        let id = "0"
        let rewardType = $(".notice_" + type + "attach_typeclass", row).attr("value");
        let num = $(".notice_" + type + "attach_numclass", row).val();
        if (rewardType == 3 || rewardType == 4 || rewardType == 5 || rewardType == 14) {
            id = $(".notice_" + type + "attach_idclass", row).attr("value");
            if (!Utils.isInteger(id) || id <= 0) {
                Utils.alert("道具ID"+id+"填写不合法，请检查");
                $(".notice_" + type + "attach_numclass", row).focus();
                return false;
            }
        } else {

        }

        if (!Utils.isInteger(num) || num <= 0) {
            Utils.alert("数据填写不合法，请检查");
            $(".notice_" + type + "attach_numclass", row).focus();
            return false;
        }
        list.push([rewardType.trim(),id.trim(), num.trim()].join(" "));
    }
    let ret = list.join("|");
    ret = encodeURIComponent(ret);
    $("#" + targetid).val(ret);
    return ret;
};

PostTools.encodeCdkeyAttachCheck = function(type, targetid) {
    let table = $("#cdkey_" + type + "attach_table");
    let rows = $("tr", table);
    let list = [];
    for (let i = 0; i < rows.length; i++) {
        let row = $(rows[i]);
        let itemType = $(".cdkey_" + type + "attach_typeclass", row).attr("value");
        let itemId = $(".cdkey_" + type + "attach_idclass", row).attr("value");
        let itemNum = $(".cdkey_" + type + "attach_numclass", row).attr("value");
        if (!Utils.isInteger(itemType) || itemType <= 0) {
            Utils.alert("道具类型"+itemType+"填写不合法，请检查");
            $(".cdkey_" + type + "attach_idclass", row).focus();
            return false;
        }
        if (!Utils.isInteger(itemNum) || itemNum <= 0) {
            Utils.alert("数据填写不合法，请检查");
            $(".cdkey_" + type + "attach_numclass", row).focus();
            return false;
        }
        list.push([itemType.trim(), itemId.trim() , itemNum.trim()].join(","));
    }
    let ret = list.join("|");
    ret = encodeURIComponent(ret);
    $("#" + targetid).val(ret);
    return ret;
};

PostTools.encodeUinList = function(sourceid) {
    let str = $("#" + sourceid).val();
    str = str.replaceAll("\r\n", ",");
    str = str.replaceAll("\r", ",");
    str = str.replaceAll("\n", ",");
    str = str.replaceAll(";", ",");
    let uinlist = str.split(",");
    let tlist = [];
    for (let i in uinlist) {
        let s = uinlist[i];
        if (s != "" && !Utils.isInteger(uinlist[i])) {
            $("#" + sourceid).focus();
            Utils.alert("数据填写不合法，请检查");
            throw "数据填写不合法，请检查";
        } else if (s != "") {
            tlist.push(s.trim());
        }
    }
    uinlist = tlist;
    uinlist = uinlist.join("|");
    uinlist = encodeURIComponent(uinlist);
    return uinlist;
};

Utils.SplitCustom = function(str) {
    str = str.replaceAll(";", ",");
    let list = str.split(",");
    let ret = [];
    for (let i in list) {
        if (list[i].indexOf("-") != -1) {
            let t = list[i].split("-");
            if (t.length != 2) {
                Utils.alert("数据填写不合法，请检查");
                throw "数据填写不合法，请检查";
            }
            for (let j = t[0]; j <= t[1]; j++) {
                ret.push(j);
            }
        } else {
            ret.push(list[i]);
        }
    }
    return ret;
};

Utils.FuzzyMatching = function(pattern, str) {
    let t = pattern.split("").join("[^]*");
    let p = new RegExp(t, "igm");
    return p.test(str);
};

Utils.FuzzyColoring = function (pattern, str, callback) {
    let l = pattern.length;
    let i = 0;
    let ret = "";
    for (let j = 0; j < str.length; j++) {
        if (i < l && (pattern[i] == str[j] || pattern[i].toLowerCase() == str[j].toLowerCase())) {
            i++;
            if (callback) ret += callback(str[j]);
            else ret += str[j];
        } else {
            ret += str[j];
        }
    }
    return ret;
};

Utils.SelectByIdAndValue = function(id, value) {
    let select = $("#" + id);
    if (select.length < 1) return;
    let options = select[0].options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].value == value) {
            options[i].selected = true;
            return;
        }
    }
};

Utils.Cookies = {};
Utils.Cookies.data = {};
Utils.Cookies.init = function() {
    let list = document.cookie.split(";");
    for (let k in list) {
        let kv = list[k].split("=");
        if (kv.length >= 2) {
            Utils.Cookies.data[kv[0].trim()] = kv[1].trim()
        }
    }
};

Utils.Cookies.save = function() {
    let list = [];
    for (let k in Utils.Cookies.data) {
        list.push(k + "=" + Utils.Cookies.data[k]);
    }
    document.cookie = list.join("; ");
};

Utils.Cookies.get = function(key) {
    return Utils.Cookies.data[key] || "";
};

Utils.Cookies.set = function(key, value) {
    Utils.Cookies.data[key] = value;
    document.cookie = key + "=" + value;
};

Utils.Cookies.init();