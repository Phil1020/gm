var Local = Local || {};

Local.account = new AccountInfo();
Local.server = "127.0.0.1:8080";
let curUser = ""

function CheckMobileStyle() {
    if ($(".navbar").height() > 150) {
        $("#toggle-button").click();
    }
}


function Nav_Block(i) {
    Utils.Cookies.set("navblockid", i);
    $(".nav-class").removeClass("active");
    $(".nav-block").hide();
    //$($(".nav-class")[i]).addClass("active");
    //$($(".nav-block")[i]).show();
    $("#nav_menu_" + i).addClass("active");
    $("#nav_block_" + i).show();
    Local.nav = i;
    CheckMobileStyle();
}

function AdjustWindow() {
    let height = $(".navbar").height();
    height -= 50;
    $(".container").css("margin-top", height + "px");
}

function ScroolTop() {
    //window.scroll(0, 0);
}

$(window).resize(function () {
    AdjustWindow();
});

function PageInit() {
    AdjustWindow();
    CheckMobileStyle();
    //ServerListInit();
    //MailInitTimer();
    // var server = Utils.Cookies.get("serverid");
    // Utils.SelectByIdAndValue("server_selector", server);
    // ServerIDChanged();
    let i = parseInt(Utils.Cookies.get("navblockid")) || 0;
    Nav_Block(i);
    Local.server = window.location.host;
    console.log(Local.server);
}

function showPostDetail(e) {
    let ownerId = $("#owner_id").val();
    let postId = e.getAttribute("post_id")
    window.open("moment.html?owner_id=" + ownerId + "&post_id=" + postId)
}

function queryAllLua() {
    $("#version_lua_add_div").hide();

    Utils.queryWithoutUin("getAllLuaStr", {}, function (data) {
        if (!data) {
            Utils.alert("data error!");
            return false;
        }
        console.log(data);
        let versionsInfo = data.allVersionLua == null ? [] : data.allVersionLua;
        let html = "";
        for (let i = 0; i < versionsInfo.length; ++i) {
            let versionInfo = versionsInfo[i];
            //let servicesArr = service.split(",");

            let Version = versionInfo.Version,  //versionInfo[0].split("=")[1],
                Lua = versionInfo.Lua,          //versionInfo[1].split("=")[1],
                Valid = versionInfo.Valid;      //versionInfo[2].split("=")[1],

            html = `${html}<tr>
                <td style="max-width: 20px;"><input type="text" class="form-control" value="${Version}" readonly="readonly"/></td>
                <td style="max-width: 20px;"><input type="text" class="form-control" value="${Valid}" readonly="readonly"/></td>
                <td style="width: 600px;"><textarea class="form-control" styl e="height:300px;width:600px" readonly="readonly">${Lua}</textarea></td>
                <td><span class="input-group-btn"><button class="btn btn-info" type="button" onclick="editVersionLua($(this), 1)" style="min-width: 60px;">编辑</button></span>
                <span class="input-group-btn"><button class="btn btn-danger" type="button" onclick="deleteVersionLua($(this))" style="min-width: 60px;">删除</button></span>
                <span class="input-group-btn" style="display: none;"><button class="btn btn-info" type="button" onclick="editLuaVersionSubmit($(this))" style="min-width: 60px;">确定</button></span>
                <span class="input-group-btn" style="display: none;"><button class="btn btn-info" type="button" onclick="editVersionLuaCancel($(this))" style="min-width: 60px;">取消</button></span>
                </td>></tr>`
        }
        $("#version_lua_div").show();
        $("#version_lua_data").html(html);
    });
}

function queryRegistry() {
    $("#registry_service_add_div").hide();
    $("#registry_server_add_div").hide();

    let isShowService = true;
    if (!$("#is_show_service").prop("checked")) {
        isShowService = false;
    }
    let filterType = $("#query_filter").val();  // 0-all, 1-server, 2-node
    let filterTxt = $("#query_filter_txt").val();

    Utils.queryWithoutUin("get_all_registry", {}, function (data) {
        if (!data) {
            Utils.alert("data error!");
            return false;
        }
        console.log(data);
        let servers = data.servers == null ? [] : data.servers, services = data.services == null ? [] : data.services;
        let html = "";
        for (let i = 0; i < servers.length; ++i) {
            let server = servers[i];
            //let serverArr = server.split(",");

            let app = server.App, //serverArr[0].split("=")[1],
                srv = server.Server, //serverArr[1].split("=")[1],
                div = server.Division, //serverArr[2].split("=")[1],
                node = server.Node, //serverArr[3].split("=")[1],
                useAgent = server.UseAgent, //server.useserverArr[4].split("=")[1],
                nodeStat = server.NodeStatus, //serverArr[5].split("=")[1],
                serviceStat = server.ServiceStatus; //serverArr[6].split("=")[1];
            if (filterType == 1 && srv !== filterTxt || filterType == 2 && node !== filterTxt) {
                continue;
            }

            html = `${html}<tr>
                <td><input type="text" class="form-control" value="${app}" readonly="readonly"/></td>
                <td><input type="text" class="form-control" value="${srv}" readonly="readonly"/></td>
                <td><input type="text" class="form-control" value="${div}" readonly="readonly"/></td>
                <td><input type="text" class="form-control" value="${node}" readonly="readonly"/></td>
                <td><input type="text" class="form-control" value="${useAgent}" readonly="readonly"/></td>
                <td><input type="text" class="form-control" value="${nodeStat}" readonly="readonly"/></td>
                <td><input type="text" class="form-control" value="${serviceStat}" readonly="readonly"/></td>
                <td><span class="input-group-btn"><button class="btn btn-info" type="button" onclick="editRegistry($(this), 0)" style="min-width: 60px;">编辑</button></span>
                <span class="input-group-btn"><button class="btn btn-danger" type="button" onclick="deleteRegistry($(this), 0)" style="min-width: 60px;">删除</button></span>
                <span class="input-group-btn" style="display: none;"><button class="btn btn-info" type="button" onclick="editServerSubmit($(this))" style="min-width: 60px;">确定</button></span>
                <span class="input-group-btn" style="display: none;"><button class="btn btn-info" type="button" onclick="editRegistryCancel($(this))" style="min-width: 60px;">取消</button></span>
                </td>></tr>`;
        }
        //console.log(html);
        $("#registry_server_div").show();
        $("#registry_server_data").html(html);

        if (!isShowService) {
            $("#registry_service_div").hide();
            $("#registry_service_data").html("");
            return;
        }
        html = "";
        for (let i = 0; i < services.length; ++i) {
            let service = services[i];
            //let servicesArr = service.split(",");

            let app = service.App, //servicesArr[0].split("=")[1],
                server = service.Server, //servicesArr[1].split("=")[1],
                division = service.Division, //servicesArr[2].split("=")[1],
                node = service.Node, //servicesArr[3].split("=")[1],
                srvc = service.Service, //servicesArr[4].split("=")[1],
                serviceIp = service.ServiceIp, //servicesArr[5].split("=")[1],
                servicePort = service.ServicePort, //servicesArr[6].split("=")[1],
                adminPort = service.AdminPort, rpcPort = service.RpcPort; //servicesArr[7].split("=")[1];

            if (filterType == 1 && server !== filterTxt || filterType == 2 && node !== filterTxt) {
                continue;
            }

            html = `${html}<tr>
                <td style="max-width: 40px;"><input type="text" class="form-control" value="${app}" readonly="readonly"/></td>
                <td style="max-width: 100px;"><input type="text" class="form-control" value="${server}" readonly="readonly"/></td>
                <td><input type="text" class="form-control" value="${division}" readonly="readonly"/></td>
                <td><input type="text" class="form-control" value="${node}" readonly="readonly"/></td>
                <td><input type="text" class="form-control" value="${srvc}" readonly="readonly"/></td>
                <td><input type="text" class="form-control" value="${serviceIp}" readonly="readonly"/></td>
                <td style="max-width: 100px;"><input type="text" class="form-control" value="${servicePort}" readonly="readonly"/></td>
                <td style="max-width: 100px;"><input type="text" class="form-control" value="${adminPort}" readonly="readonly"/></td>
                <td style="max-width: 100px;"><input type="text" class="form-control" value="${rpcPort}" readonly="readonly"/></td>
                <td><span class="input-group-btn"><button class="btn btn-info" type="button" onclick="editRegistry($(this), 1)" style="min-width: 60px;">编辑</button></span>
                <span class="input-group-btn"><button class="btn btn-danger" type="button" onclick="deleteRegistry($(this), 1)" style="min-width: 60px;">删除</button></span>
                <span class="input-group-btn" style="display: none;"><button class="btn btn-info" type="button" onclick="editServiceSubmit($(this))" style="min-width: 60px;">确定</button></span>
                <span class="input-group-btn" style="display: none;"><button class="btn btn-info" type="button" onclick="editRegistryCancel($(this))" style="min-width: 60px;">取消</button></span>
                </td>></tr>`
        }
        $("#registry_service_div").show();
        $("#registry_service_data").html(html);
    });
}

function editVersionLua(e, type) {
    let tr = e.parent().parent().parent();

    let begin = type;
    let arr = [];
    tr.find("td").slice(begin).each(function () {
        //console.log($(this));
        $(this).children("input").removeAttr("readonly");
        let v = $(this).children("input").val();
        if (v) {
            arr.push(v);
        }

        $(this).children("textarea").removeAttr("readonly");
        let vTextArea = $(this).children("textarea").val();
        if (vTextArea) {
            arr.push(v);
        }
    });
    tr.attr("oldval", arr.reverse().join(","));
    //tr.find("td").eq(4, 3);

    e.parent().hide();
    e.parent().next().hide();
    e.parent().siblings("span").eq(1).show();
    e.parent().siblings("span").eq(2).show();
}

function deleteVersionLua(e) {
    Utils.confirmWithKey("确定删除？请输入超级密码", function () {
        let arr = [];
        let tr = e.parent().parent().parent();
        tr.find("td").each(function () {
            arr.push($(this).children("input").val());
        });
        let sp = $("#confirm_with_key_pwd").val()
        Utils.actionPostWithKey("gm/deleteLuaStr", {
            version: arr[0], super_key: sp,
        }, function (data) {
            Utils.success("删除成功");
            tr.hide();
        });
    }, function () {
        //$.alert("no");
    });
}

function editRegistry(e, type) {
    let tr = e.parent().parent().parent();
    //let begin = (type === 1 ? 5 : 4) ;
    let begin = type;
    let arr = [];
    tr.find("td").slice(begin).each(function () {
        //console.log($(this));
        $(this).children("input").removeAttr("readonly");
        let v = $(this).children("input").val();
        if (v) {
            arr.push(v);
        }
    });
    tr.attr("oldval", arr.reverse().join(","));
    //tr.find("td").eq(4, 3);

    e.parent().hide();
    e.parent().next().hide();
    e.parent().siblings("span").eq(1).show();
    e.parent().siblings("span").eq(2).show();
}

function editVersionLuaCancel(e) {
    let tr = e.parent().parent().parent();
    tr.find("td").each(function () {
        $(this).children("input").attr("readonly", "readonly");
        $(this).children("textarea").attr("readonly", "readonly");
    });

    let oldval = tr.attr("oldval");
    let arr = oldval.split(",");
    for (let i = 0; i < arr.length; ++i) {
        tr.find("td").eq(-2 - i).children("input").val(arr[i]);
    }
    e.parent().hide();
    e.parent().prev().hide();
    e.parent().siblings("span").eq(0).show();
    e.parent().siblings("span").eq(1).show();
}

function editRegistryCancel(e) {
    let tr = e.parent().parent().parent();
    tr.find("td").each(function () {
        $(this).children("input").attr("readonly", "readonly");
    });

    let oldval = tr.attr("oldval");
    let arr = oldval.split(",");
    for (let i = 0; i < arr.length; ++i) {
        tr.find("td").eq(-2 - i).children("input").val(arr[i]);
    }
    e.parent().hide();
    e.parent().prev().hide();
    e.parent().siblings("span").eq(0).show();
    e.parent().siblings("span").eq(1).show();
}

function editGolbConfigSubmit(e) {
    let arr = [];
    let tr = e.parent().parent().parent();
    tr.find("td").each(function () {
        arr.push($(this).children("input").val());
    });
    let category = arr[0], t_key = arr[1], value = arr[2];
    Utils.confirmWithKey("确定要修改吗？请输入超级密码.", function () {
        sp = $("#confirm_with_key_pwd").val()
        Utils.actionPostWithKey("gm/edit_registry_global_config", {
            category: category, t_key: t_key, value: value, super_key: sp,
        }, function (data) {
            e.parent().hide();
            e.parent().next().hide();
            e.parent().prevAll().show();
            tr.find("td").each(function () {
                $(this).children("input").attr("readonly", "readonly")
            });
            Utils.success("编辑成功");
        });
    }, function () {
        Utils.success("您取消了修改");
    });
}

function editServerSubmit(e) {
    let arr = [];
    let tr = e.parent().parent().parent();
    tr.find("td").each(function () {
        arr.push($(this).children("input").val());
    });
    let app = arr[0], server = arr[1], division = arr[2], node = arr[3], useAgent = arr[4], nodeStat = arr[5],
        serviceStat = arr[6];
    Utils.queryWithoutUin("gm/edit_registry_server", {
        app: app,
        server: server,
        division: division,
        node: node,
        use_agent: useAgent,
        node_status: nodeStat,
        service_status: serviceStat
    }, function (data) {
        e.parent().hide();
        e.parent().next().hide();
        e.parent().prevAll().show();
        tr.find("td").each(function () {
            $(this).children("input").attr("readonly", "readonly")
        });
        Utils.success("编辑成功");
    });
}

function editLuaVersionSubmit(e) {
    let arr = [];
    let arrTextarea = [];
    let tr = e.parent().parent().parent();
    tr.find("td").each(function () {
        let value = $(this).children("input").val()
        if (value) {
            arr.push(value);
        }

        value = $(this).children("textarea").val()
        if (value) {
            arrTextarea.push(value);
        }
    });

    let Version = arr[0], Valid = arr[1], Lua = arrTextarea[0];
    Utils.confirmWithKey("确定要修改吗？请输入超级密码.", function () {
        let sp = $("#confirm_with_key_pwd").val()
        Utils.actionPostWithKey("gm/inject_lua_script", {
            Version: Version, Lua: encodeURIComponent(Lua), Valid: Valid, super_key: sp,
        }, function (data) {
            e.parent().hide();
            e.parent().next().hide();
            e.parent().prevAll().show();
            tr.find("td").each(function () {
                $(this).children("input").attr("readonly", "readonly")
            });
            Utils.success("编辑成功");
        });
    }, function () {
        Utils.success("您取消了修改");
    });
}

function editServiceSubmit(e) {
    let arr = [];
    let tr = e.parent().parent().parent();
    tr.find("td").each(function () {
        arr.push($(this).children("input").val());
    });
    let app = arr[0], server = arr[1], division = arr[2], node = arr[3], service = arr[4], serviceIp = arr[5],
        servicePort = arr[6], adminPort = arr[7], rpcPort = arr[8];
    Utils.queryWithoutUin("gm/edit_registry_service", {
        app: app,
        server: server,
        division: division,
        node: node,
        service: service,
        service_ip: serviceIp,
        service_port: servicePort,
        admin_port: adminPort,
        rpc_port: rpcPort
    }, function (data) {
        e.parent().hide();
        e.parent().next().hide();
        e.parent().prevAll().show();
        tr.find("td").each(function () {
            $(this).children("input").attr("readonly", "readonly")
        });
        Utils.success("编辑成功");
    });
}

function deleteRegistry(e, type) {
    Utils.confirmWithKey("确定删除？请输入超级密码", function () {
        let t = "server";
        if (type === 1) {
            t = "service"
        }
        if (type === 2) {
            t = "globalConfig"
        }
        let arr = [];
        let tr = e.parent().parent().parent();
        tr.find("td").each(function () {
            arr.push($(this).children("input").val());
        });
        let sp = $("#confirm_with_key_pwd").val()
        Utils.actionPostWithKey("gm/delete_registry", {
            type: t, app: arr[0], server: arr[1], division: arr[2], node: arr[3], service: arr[4], super_key: sp,
        }, function (data) {
            Utils.success("删除成功");
            tr.hide();
            //queryRegistry();
        });
    }, function () {
        //$.alert("no");
    });
}

function clickAddRegistryServer() {
    $("#registry_server_div").hide();
    $("#registry_service_div").hide();
    $("#registry_service_add_div").hide();
    $("#registry_server_add_div").show();
}

function clickAddNewVersionLua() {
    $("#version_lua_div").hide();
    $("#version_lua_add_div").show();
}


function clickAddRegistryService() {
    $("#registry_server_div").hide();
    $("#registry_service_div").hide();
    $("#registry_server_add_div").hide();
    $("#registry_service_add_div").show();
}

function addRegistryServer() {
    let app = $("#registry_server_add_app").val(), server = $("#registry_server_add_server").val(),
        division = $("#registry_server_add_division").val(), node = $("#registry_server_add_node").val(),
        useAgent = $("#registry_server_add_use_agent").val(), nodeStatus = $("#registry_server_add_node_status").val(),
        serviceStatus = $("#registry_server_add_service_status").val();
    if (!app || !server || !division || !node | !useAgent || !nodeStatus || !serviceStatus) {
        Utils.alert("请全部填写！");
        return false;
    }

    Utils.queryWithoutUin("gm/add_registry_server", {
        app: app, server: server, division: division, node: node,


        use_agent: useAgent, node_status: nodeStatus, service_status: serviceStatus
    }, function (data) {
        Utils.success("添加成功")
    });


}

function addNewVersionLua() {
    let version = $("#add_lua_version").val(), valid = $("#add_lua_valid").val(), cont = $("#add_lua_cont").val();
    if (!version || !valid || !cont) {
        Utils.alert("请全部填写！");
        return false;
    }

    Utils.queryWithoutUin("gm/addLuaStr", {
        version: version, valid: valid, lua_str: encodeURIComponent(cont),
    }, function (data) {
        Utils.success("添加成功")
    });
}

function addRegistryService() {
    let app = $("#registry_service_add_app").val(), server = $("#registry_service_add_server").val(),
        division = $("#registry_service_add_division").val(), node = $("#registry_service_add_node").val(),
        service = $("#registry_service_add_service").val(), serviceIp = $("#registry_service_add_service_ip").val(),
        servicePort = $("#registry_service_add_service_port").val(),
        adminPort = $("#registry_service_add_admin_port").val(), rpcPort = $("#registry_service_add_rpc_port").val();
    if (!app || !server || !division || !node | !service || !serviceIp || !servicePort || !adminPort || !rpcPort) {
        Utils.alert("请全部填写！");
        return false;
    }

    Utils.queryWithoutUin("gm/add_registry_service", {
        app: app,
        server: server,
        division: division,
        node: node,
        service: service,
        service_ip: serviceIp,
        service_port: servicePort,
        admin_port: adminPort,
        rpc_port: rpcPort
    }, function (data) {
        Utils.success("添加成功")
    });
}

function queryAccountInfoByDeviceId() {
    let deviceId = $("#account_device_id").val();
    if (!deviceId) {
        Utils.alert("请输入deviceId");
        return;
    }
    Utils.queryWithoutUin("get_device_info", {device_id: deviceId}, function (data) {
        console.log(data);
        if (!data) {
            Utils.alert("data error " + data);
            return;
        }
        let datas = data.split("|");
        if (datas.length < 2) {
            Utils.alert("data error " + data);
            return;
        }

        let accId = datas[0];
        $("#change_server_accid").text(accId);

        let lobbyID = datas[1]
        $("#change_server_old_lobby").text(lobbyID);
    })
}

function queryDeviceIdByAccountId() {
    let accountId = $("#query_account_id").val();
    if (!accountId) {
        Utils.alert("请输入accountId");
        return;
    }
    Utils.queryWithoutUin("get_device_id", {account_id: accountId}, function (data) {
        console.log(data);
        if (!data) {
            Utils.alert("data error " + data);
            return;
        }

        $("#query_device_id").val(data);
    })
}

function changeServer() {
    let deviceId = $("#account_device_id").val();
    if (!deviceId) {
        Utils.alert("请输入deviceId!");
        return false;
    }
    let newLobbyId = $("#change_server_new_lobby").val();
    if (!newLobbyId) {
        Utils.alert("请输入新lobbyId!");
        return false;
    }
    Utils.confirm("确定要将玩家转服到Lobby: " + newLobbyId + "？将影响玩家登录！！！", function () {
        Utils.queryWithoutUin("change_server", {device_id: deviceId, lobby_id: newLobbyId}, function (data) {
            console.log(data);
            if (data === "ok") {
                Utils.success("修改成功");
            } else {
                Utils.alert("error! " + data);
            }
        });
    });
}

function bindLobby() {
    let deviceId = $("#account_device_id").val();
    if (!deviceId) {
        Utils.alert("请输入deviceId!");
        return false;
    }
    Utils.queryWithoutUin("bind_lobby", {
        device_id: deviceId
    }, function (data) {
        console.log(data);
        Utils.success("绑定成功");

    });
}

function unbindLobby() {
    let deviceId = $("#account_device_id").val();
    if (!deviceId) {
        Utils.alert("请输入deviceId!");
        return false;
    }
    Utils.confirm("确定要解除账号绑定？将影响玩家登录！！！", function () {
        Utils.queryWithoutUin("unbind_lobby", {device_id: deviceId}, function (data) {
            console.log(data);
            if (data === "ok") {
                Utils.success("解绑成功");
            } else {
                Utils.alert("解绑失败~" + data);
            }
        });
    });
}

function banAccount() {
    let accountId = $("#account_id").val();
    if (!accountId) {
        Utils.alert("请输入accountID!");
        return false;
    }
    Utils.queryWithoutUin("ban_account", {
        account_id: accountId
    }, function (data) {
        console.log(data);
        Utils.success("成功");
    });
}

function unbanAccount() {
    let accountId = $("#account_id").val();
    if (!accountId) {
        Utils.alert("请输入accountID!");
        return false;
    }
    Utils.queryWithoutUin("unban_account", {
        account_id: accountId
    }, function (data) {
        console.log(data);
        Utils.success("成功");
    });
}

function seeRecommend() {
    Utils.queryWithoutUin("query_recommend", {}, function (data) {
        console.log("recommend:: " + data);
        $("#see_recommend").text(data);
    })
}

function changeRecommend() {
    let lobbyId = $("#change_recommend_lobby").val();
    if (!lobbyId) {
        Utils.alert("请输入推荐lobbyId");
        return false;
    }
    Utils.confirm("确定要将推荐服Lobby修改为：" + lobbyId + "？这将影响玩家登录！！！", function () {
        Utils.queryWithoutUin("change_recommend", {lobby_id: lobbyId}, function (data) {
            console.log(data);
            Utils.success("设置成功");
        });
    });
}

function updateNotice() {
    let noticeType = $("#update_notice_notice_type").val(), showType = $("#update_notice_show_type").val(),
        labelType = $("#update_notice_label_type").val(), sortValue = $("#update_notice_sort_value").val(),
        title = $("#update_notice_title").val(), content = $("#update_notice_content").val();
    if (!noticeType || !showType || !labelType || !sortValue || !title || !content) {
        //content = "";
        Utils.alert("公告信息不全！！！");
        return false;
    }
    Utils.confirmWithKey("确定要更新公告？", function () {
        let sp = $("#confirm_with_key_pwd").val()
        Utils.actionPostWithKey("gm/update_notice", {
            notice_type: noticeType,
            show_type: showType,
            label_type: labelType,
            sort_value: sortValue,
            title: encodeURIComponent(title),
            content: encodeURIComponent(content),
            super_key: sp,
        }, function (data) {
            //console.log(data);
            Utils.success("更新成功");
        });
    });
}


function getNotice() {
    Utils.queryWithoutUin("gm/get_notice", {}, function (data) {
        if (!data) {
            Utils.alert("data error!");
            return false;
        }
        //console.log(data);


        let html = "";

        html = `${html}
            <tr align="center" style="background-color: #74777b">
                <td>ID</td>
                <td>发布人</td>
                <td>发布时间</td>
                <td>弹出类型</td>
                <td>显示类型</td>
                <td>标签类型</td>
                <td>排序值</td>
                <td>标题</td>
                <td>正文</td>
<!--                <td>操作</td>-->
            </tr>`

        let content = "";
        for (let i = 0; i < data.length; ++i) {
            let cnt = data[i];
            let date = new Date(cnt.timestamp * 1000);
            let dateTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
            content = `${content}ID: ${cnt.id}\ntime: ${dateTime}\ncontent:\n\t${cnt.info}\n\n`;

            let noticeType1 = (cnt.noticetype === 1 ? "selected" : "");
            let noticeType2 = (cnt.noticetype === 2 ? "selected" : "");
            let noticeType3 = (cnt.noticetype === 3 ? "selected" : "");

            let showType1 = (cnt.show_type === 1 ? "selected" : "");
            let showType2 = (cnt.show_type === 2 ? "selected" : "");
            let showType3 = (cnt.show_type === 3 ? "selected" : "");

            let labelType0 = (cnt.label_type === 0 ? "selected" : "");
            let labelType1 = (cnt.label_type === 1 ? "selected" : "");


            html += `
            <tr>
                <td><h4>${cnt.id}</h4></td>
                <td>${cnt.user}</td>
                <td style="font-size: 15px; text-align: center; min-width: 100px;">${dateTime}</td>
                <td>
                    <select id="notice_type" class="form-control" style="min-width: 160px;" disabled>
                        <option value="1" ${noticeType1}>永久弹出</option>
                        <option value="2" ${noticeType2}>当日首次弹出</option>
                        <option value="3" ${noticeType3}>只弹出一次</option>
                    </select>
                </td>
                <td>
                    <select id="show_type" class="form-control" style="min-width: 160px;" disabled>
                        <option value="1" ${showType1}>更新</option>
                        <option value="2" ${showType2}>活动</option>
                        <option value="3" ${showType3}>常驻通知</option>
                    </select>
                </td>
                <td>
                    <select id="label_type" class="form-control" style="min-width: 160px;" disabled>
                        <option value="0" ${labelType0}>无</option>
                        <option value="1" ${labelType1}>NEW</option>
                    </select>
                </td>
                <td><input type="text" class="form-control" value="${cnt.sort_value}" readonly="readonly" style="min-width: 80px;"/></td>
                <td><input type="text" class="form-control" value="${cnt.title}" readonly="readonly" style="min-width: 200px;"/></td>
                <td><textarea id="update_content" class="form-control" readonly="readonly" rows="10" style="width: 500px;">${cnt.info}</textarea></td>
<!--                <td>-->
<!--                    <span class="input-group-btn">-->
<!--                        <button class="btn btn-info" type="button" onclick="editRegistry($(this), 4)" style="min-width: 60px;">编辑</button>-->
<!--                        <br>-->
<!--                        <button class="btn btn-danger" type="button" onclick="deleteRegistry($(this), 0)" style="min-width: 60px; margin-top: 5px;">删除</button>-->
<!--                    </span>-->
<!--                </td>-->
            </tr>
            `;

            // $("#notice_type").val("2");
            //$("#notice_type").find("option:contains('当日首次弹出')").attr("selected",true);
            //$("#notice_type").find("option:contains('"+"当日首次弹出"+"')").attr("selected", true);
        }
        // $("#old_content").val(content);

        $("#history_notices_div").show();
        $("#history_notices").html(html);
        //$("#notice_type").find("option[value='2']").prop("selected", true);
        //$("#notice_type").val("2");
    });
}

function getNoticeById() {
    let id = $("#old_content_id").val();
    if (!id) {
        Utils.alert("请输入公告ID！！！");
        return false;
    }
    id = parseInt(id);
    Utils.queryWithoutUin("gm/get_notice", {}, function (data) {
        //console.log(data);
        for (let i = 0; i < data.length; ++i) {
            if (data[i].id === id) {
                $("#update_content").val(data[i].info);
                $("#notice_type").val(data[i].noticetype);
                $("#update_notice_show_type").val(data[i].show_type);
                $("#update_notice_label_type").val(data[i].label_type);
                $("#update_notice_sort_value").val(data[i].sort_value);
                $("#update_notice_title").val(data[i].title);
                $("#update_notice_content").val(data[i].info);

                Utils.success("查询成功");
                return;
            }
        }
        Utils.alert("查询失败");
    });
}

function deleteOldNotice() {
    let id = $("#old_content_id").val();
    if (!id) {
        Utils.alert("请输入公告ID！！！");
        return false;
    }
    id = parseInt(id);
    let sp = $("#confirm_with_key_pwd").val()
    Utils.confirmWithKey(`确定删除公告，ID: ${id}?`, function () {
        Utils.actionPostWithKey("gm/delete_notice", {id: id, super_key: sp}, function (data) {
            //console.log(data);
            Utils.success("删除公告成功");
        });
    });
}

function modifyNotice() {
    let id = $("#old_content_id").val(), noticeType = $("#update_notice_notice_type").val(),
        showType = $("#update_notice_show_type").val(), labelType = $("#update_notice_label_type").val(),
        sortValue = $("#update_notice_sort_value").val(), title = $("#update_notice_title").val(),
        content = $("#update_notice_content").val();
    if (!id || !noticeType || !showType || !labelType || !sortValue || !title || !content) {
        Utils.alert("公告信息不全！！！");
        return false;
    }

    id = parseInt(id);
    Utils.confirmWithKey(`确定修改公告，ID: ${id}?`, function () {
        let sp = $("#confirm_with_key_pwd").val()
        Utils.actionPostWithKey("gm/modify_notice", {
            id: id,
            notice_type: noticeType,
            show_type: showType,
            label_type: labelType,
            sort_value: sortValue,
            title: encodeURIComponent(title),
            content: encodeURIComponent(content),
            super_key: sp,
        }, function (data) {
            //console.log(data);

            Utils.success("修改成功");
        });
    });
}

function ChangeMailType() {
    let type = $("#notice_type_selector").val();
    if (type == 2) {
        $("#notice_uinlist_title").show();
        $("#notice_uinlist_textarea").show(400);
        //$("#global_mail_div").hide(400);
        //$("#delete_global_mail_div").hide(400);
    } else {
        $("#notice_uinlist_title").hide();
        $("#notice_uinlist_textarea").hide(400);
        //$("#global_mail_div").show(400);
        //$("#delete_global_mail_div").show(400);
    }
}

var attach_cnt = 0;

function AddNoticeAttachmentItem(type, addition) {
    let table = $("#notice_" + type + "attach_table");
    let newType = $("#notice_" + type + "attach_newtype" + addition).val();
    let id = $("#notice_" + type + "attach_newid" + addition).val();
    if (newType == 3 || newType == 4 || newType == 5 || newType == 14) {
        let idValue = parseInt(id)
        if (idValue <= 0) {
            Utils.alert("请输入/选择正确的ID");
            $("#notice_" + type + "attach_newid" + addition).focus();
            return;
        }
    }
    let num = $("#notice_" + type + "attach_newnum" + addition).val();

    let i = attach_cnt + 1;
    let str = '<tr><td><div class="input-group">' + '<span class="input-group-addon" style="min-width: 120px;">' + '<span id="notice_' + type + 'attach_type_' + i + '" value="' + newType + '" class="notice_' + type + 'attach_typeclass">' + newType + '</span>' + '</span>' + '<span class="input-group-addon" style="min-width: 120px;"><span id="notice_' + type + 'attach_id_' + i + '" value="' + id + '" class="notice_' + type + 'attach_idclass">' + id + '</span></span>' + '<input id="notice_' + type + 'attach_num_' + i + '" type="text" class="form-control notice_' + type + 'attach_numclass" style="min-width: 40px;" value="' + num + '"><span class="input-group-btn"><input class="btn btn-danger" type="button" onclick="javascript:DelNoticeAttachmentItem(\'' + type + '\', ' + i + '); " value="删除" /></span></div></td></tr>';
    $(table).append(str);
    attach_cnt++;
}

function DelNoticeAttachmentItem(type, i) {
    let id_dom = $("#notice_" + type + "attach_id_" + i);
    //var num_dom = $("#notice_" + type + "attach_num_" + i);
    $(id_dom).parents("tr").remove();
}

// 改成发送json
function SubmitMail() {
    try {
        $("#notice_submit_url").val(PostTools.getPostURL());

        // PostTools.integerCheck("notice_id_textbox", "notice_submit_id");
        PostTools.integerCheck("notice_type_selector", "notice_submit_type");
        PostTools.integerCheck("mail_lobby_id", "notice_lobby_id");
        $("#notice_submit_srctype").val(100);
        // PostTools.timeCheck("notice_sendtime_textbox", "notice_submit_sendtime");
        // PostTools.timeCheck("notice_expiretime_textbox", "notice_submit_expiretime");
        PostTools.encodeStringCheck("notice_sender_textbox", "notice_submit_sender");
        PostTools.encodeStringCheck("notice_title_textbox", "notice_submit_title");
        PostTools.encodeStringCheck("notice_content_textarea", "notice_submit_content");
        // var coin = PostTools.encodeAttachCheck("coin", "notice_submit_coins");
        let item = PostTools.encodeAttachCheck("item", "notice_submit_items");
        if (item === false) {
            return;
        }

        let attach = 1;
        if (Utils.isEmpty(item)) attach = 0;
        $("#notice_submit_haveattach").val(attach);

        let type = $("#notice_type_selector").val();
        let uinlist = "";
        if (type == 2) {
            uinlist = PostTools.encodeUinList("notice_uinlist_textarea");
        }
        $("#notice_submit_uinlist").val(uinlist);

        Utils.confirmWithKey("确定要发送邮件？", function () {
            let sp = $("#confirm_with_key_pwd").val()
            $("#mail_submit_key").val(sp);
            Utils.ajaxFormSubmit("new_mail_action", `gm/send_mail?super_key=${sp}`, "post", function (data) {
                Utils.success("邮件发送成功");
            });
        });
    } catch (e) {

    }
}

// --------------- 新发送邮件
function getAttach() {
    let table = $("#notice_itemattach_table")
    let rows = $("tr", table)
    let res = []
    for (const v of rows) {
        let id = "0"
        let rt = $(".notice_itemattach_typeclass", v).attr("value")
        let num = $(".notice_itemattach_numclass", v).val()
        switch (rt) {
            case "3":
            case "4":
            case "5":
            case "14":
                id = $(".notice_itemattach_idclass", v).text()
            default:
        }
        res.push({rewardType: parseInt(rt), rewardId: parseInt(id), rewardCount: parseInt(num)})
    }
    return res
}

function SendMail() {
    let mailType = $("#notice_type_selector").val()
    let lobbyId = $("#mail_lobby_id").val()
    let title = $("#notice_title_textbox").val()
    let content = $("#notice_content_textarea").val()
    let attach = getAttach()

    let accIdStr = $("#notice_uinlist_textarea").val()
    accIdStr = accIdStr.replaceAll(/[\r\n\s]/, "")
    let reg = /[^\d,]/
    if (reg.test(accIdStr)) {
        alert("AccId列表中包含非法字符")
        return
    }
    let accIds = []
    for (const v of accIdStr.split(',')) {
        accIds.push(parseInt(v))
    }
    let startTime = 0//document.getElementById(("mail_start_time")).value || 0
    startTime = new Date(startTime).getTime()
    startTime = Math.floor(startTime / 1000)

    let endTime = 0//document.getElementById(("mail_end_time")).value || 0
    endTime = new Date(endTime).getTime()
    endTime = Math.floor(endTime / 1000)

    Utils.confirm("提交前谨慎检查各项数据填写正确", function () {
        axios({
            method: "post", url: "gm/store_mail", param: {}, data: {
                "content": {
                    "type": parseInt(mailType), "subject": title, "content": content, "sender": curUser, // 这个是发送邮件的用户
                    "lobby_id": parseInt(lobbyId), "start_time": startTime, "end_time": endTime,
                }, "acc_data": accIds, "attach": {
                    "rewards": attach
                },
            }
        }).then(function (rsp) {
            alert("成功")
        }).catch(function (err) {
            console.log(err)
            alert(err.response.data.error)
        })
    })
}

lastPage = false
queryType = 0
const pageLimit = 5
special_start_pos = 0
global_start_pos = 0
uncheck_start_pos = 0

function getUnckeckMailsWapper() {
    uncheck_start_pos = 0
    getUnckeckMails(uncheck_start_pos, pageLimit, function () {
        setCurPage(1)
    })
}

// 查询待审核邮件
function getUnckeckMails(beg, len, okCallBack) {
    axios.get("gm/get_unchecked_mail", {params: {start: beg, limit: len}})
        .then(function (rsp) {
            let tab = $("#mail_info_content")
            tab.empty()
            for (const obj of rsp.data.mails) {
                v = obj.content
                acc = obj.acc_data.toString()
                j = JSON.parse(v.attachment)
                items = formatAttachment(j.rewards)

                let s = `<tr>
                 <td>${v.mail_id}</td>
                 <td>${convertType(v.type)}</td>
                 <td>${v.lobby_id}</td>
                 <td>${acc}</td>
                 <td>${getLocalTime(v.timestamp)}</td>
                 <td>${v.sender}</td>
                 <td>${v.subject}</td>
                 <td>${v.content}</td>
                 <td style="word-break: break-all">${items}</td>
                 </tr>`

                tab.append(s)
            }
            if (rsp.data.mails.length < len) {
                lastPage = true
            } else {
                lastPage = false
            }
            okCallBack()
            setTotalPage(rsp.data.total)
            queryType = 1
        }).catch(function (err) {
        console.log(err)
        alert(err.response.data.error)
    })
}

function convertType(t) {
    switch (t) {
        case 1:
            return "全服"
        case 2:
            return "指定玩家"
        case 3:
            return "单服"
        default:
            return "none"
    }
}

function getLocalTime(s) {
    return new Date(s * 1000).toLocaleDateString().replace(/:\d{1,2}$/, ' ')
}

function formatAttachment(v) {
    if (!v) {
        return ""
    }
    str = ""
    for (const i of v) {
        str += `id:${i.rewardId || ""} type:${i.rewardType} cnt:${i.rewardCount}<br>`
    }
    return str
}

function getGlobalMailsWapper() {
    global_start_pos = 0
    setCurPage(1)
    getGlobalMails(global_start_pos, pageLimit, function () {
    })
}

// 查询已发送的邮件
function getGlobalMails(beg, len, okCallBack) {
    let lobbyId = $("#mail_lobby_id").val();
    if (!$.isNumeric(lobbyId)) {
        Utils.alert("目标服ID应为数字");
        return false;
    }
    Utils.queryWithoutUin("gm/get_global_mails", {
        lobby: lobbyId, start: beg, limit: len
    }, function (res) {
        let tab = $("#mail_info_content")
        tab.empty()
        for (const v of res) {
            j = JSON.parse(v.attachment)
            items = formatAttachment(j.rewards)
            let s = `<tr>
                 <td>${v.mail_id}</td>
                 <td>${convertType(v.type)}</td>
                 <td>${v.lobby_id}</td>
                 <td>${"......"}</td>
                 <td>${getLocalTime(v.check_time)}</td>
                 <td>${v.checker}</td>
                 <td>${v.subject}</td>
                 <td>${v.content}</td>
                 <td style="word-break: break-all">${items}</td>
                 </tr>`

            tab.append(s)
        }
        if (res.length < len) {
            lastPage = true
        } else {
            lastPage = false
        }
        okCallBack()
        setTotalPage(rsp.data.total)
        queryType = 2
    });
}

function setCurPage(n) {
    $('#current_page').text(n)
}

function getCurPage() {
    return parseInt($('#current_page').text());
}

TotalCount = 0

function setTotalPage(n) {
    TotalCount = n
    $('#total_page').text(`总页数:${Math.ceil(n / pageLimit)}`)
}

function gotoPage() {
    var pg = parseInt($('#goto').val());
    if (!pg || pg < 0) {
        return
    }
    beg = (pg - 1) * pageLimit;
    len = pageLimit;
    switch (queryType) {
        case 1:
            getUnckeckMails(beg, len, function () {
                uncheck_start_pos = beg
            })
            break
        case 2:
            getGlobalMails(beg, len, function () {
                global_start_pos = beg
            })
            break
        case 3:
            getSpecialMails(beg, len, function () {
                special_start_pos = beg
            })
            break
    }
    setCurPage(pg)
}

function QueryPrePage() {
    switch (queryType) {
        case 1:// 审核邮件分页
            n = uncheck_start_pos - pageLimit
            if (n < 0) {
                uncheck_start_pos = 0
                return
            }
            getUnckeckMails(n, pageLimit, function () {
                uncheck_start_pos -= pageLimit
                setCurPage(getCurPage() - 1)
            })
            break

        case 2:// 已发送邮件分页
            n = global_start_pos - pageLimit
            if (n < 0) {
                global_start_pos = 0
                return
            }
            getGlobalMails(n, pageLimit, function () {
                global_start_pos -= pageLimit
                setCurPage(getCurPage() - 1)
            })
            break

        case 3:// 定向邮件分页
            n = special_start_pos - pageLimit
            if (n < 0) {
                special_start_pos = 0
                return
            }
            getSpecialMails(n, pageLimit, function () {
                setCurPage(getCurPage() - 1)
                special_start_pos -= pageLimit
            })
    }
}

function QueryNextPage() {
    if (lastPage) {
        return
    }
    switch (queryType) {
        case 1:
            n = uncheck_start_pos + pageLimit
            getUnckeckMails(n, pageLimit, function () {
                uncheck_start_pos = n
                setCurPage(getCurPage() + 1)
            })
            break
        case 2:
            n = global_start_pos + pageLimit
            getGlobalMails(n, pageLimit, function () {
                global_start_pos = n
                setCurPage(getCurPage() + 1)
            })
            break
        case 3:
            n = special_start_pos + pageLimit
            getSpecialMails(n, pageLimit, function () {
                special_start_pos = n
                setCurPage(getCurPage() + 1)
            })
    }
}

function checkMail(flag) {
    id = $("#check_mail_id").val()
    axios({
        url: "gm/check_mail", method: "post", params: {index: id, pass: flag}
    }).then(function (rsp) {
        alert("成功")
        getUnckeckMailsWapper()
    }).catch(function (err) {
        console.log(err)
        alert(err.response.data.error)
    })
}

function getSpecialMailsWapper() {
    special_start_pos = 0
    getSpecialMails(special_start_pos, pageLimit, function () {
        setCurPage(1)
    })
}

// 查询待审核邮件
function getSpecialMails(beg, len, okCallBack) {
    axios.get("gm/get_special_mails", {params: {start: beg, limit: len}})
        .then(function (rsp) {
            let lobbyId = parseInt($("#mail_lobby_id").val());
            let tab = $("#mail_info_content")
            tab.empty()
            for (const obj of rsp.data.mails) {
                v = obj.content
                acc = obj.acc_data.toString()
                j = JSON.parse(v.attachment)
                items = formatAttachment(j.rewards)
                if (lobbyId && lobbyId !== v.lobby_id) {
                    continue
                }

                let s = `<tr>
                 <td>${v.mail_id}</td>
                 <td>${convertType(v.type)}</td>
                 <td>${v.lobby_id}</td>
                 <td>${acc}</td>
                 <td>${getLocalTime(v.timestamp)}</td>
                 <td>${v.sender}</td>
                 <td>${v.subject}</td>
                 <td>${v.content}</td>
                 <td style="word-break: break-all">${items}</td>
                 </tr>`

                tab.append(s)
            }
            if (rsp.data.mails.length < len) {
                lastPage = true
            } else {
                lastPage = false
            }
            okCallBack()
            setTotalPage(rsp.data.total)
            queryType = 3
        }).catch(function (err) {
        console.log(err)
        alert(err.response.data.error)
    })
}

//------------------------------------


function deleteGlobalMail() {
    let id = $("#global_mail_id").val();
    let lobbyId = $("#mail_lobby_id").val();
    if (!id || !$.isNumeric(lobbyId)) {
        Utils.alert("邮件ID或者目标服ID不正确！！！");
        return false;
    }

    Utils.confirmWithKey(`确定要删除邮件：${id}吗，目标服：${lobbyId}？`, function () {
        let sp = $("#confirm_with_key_pwd").val()
        Utils.actionPostWithKey("gm/del_special_mail", {mail_id: id, lobby: lobbyId, super_key: sp}, function (data) {
            Utils.success("邮件删除成功");
        });
    });
}

function deleteSpecialMail() {
    let id = $("#special_mail_id").val()
    Utils.confirmWithKey(`确定要删除邮件：${id}吗？`, function () {
        let sp = $("#confirm_with_key_pwd").val()
        Utils.actionPostWithKey("gm/del_global_mail", {mail_id: id, super_key: sp}, function (data) {
            Utils.success("邮件删除成功");
        });
    });
}

function SubmitLuaStr() {
    try {
        $("#lua_script_submit_url").val(PostTools.getPostURL());
        PostTools.encodeStringCheck("lua_script_textarea", "lua_script_submit_luastr");

        Utils.confirm("确定要注入新的Lua脚本？", function () {
            Utils.ajaxFormSubmit("lua_script_form", "gm/inject_lua_script", "post", function (data) {
                Utils.success("Lua 注入成功");
            });
        }, function () {
            Utils.success("您取消了Lua注入");
        });
    } catch (e) {

    }
}

function GetLuaStr() {
    Utils.queryWithoutUin("gm/get_lua_str", {}, function (data) {
        $("#lua_script_textarea").val(data);
    });
}

function dropRewardTest() {
    let dropType = $("#simulation_type").val();
    let dropId = $("#drop_id").val();
    let dropCount = $("#drop_count").val();
    let lobbyId = $("#drop_lobby_id").val();
    if (!lobbyId) {
        Utils.alert("请输入对应LobbyID");
        return;
    }
    if (!dropId) {
        Utils.alert("请输入对应ID");
        return;
    }
    if (!dropCount) {
        Utils.alert("请输入对应次数");
        return;
    }

    Utils.queryWithoutUin("gm/drop_reward_test", {
        lobbyId: lobbyId, dropType: dropType, dropId: dropId, dropCount: dropCount,
    }, function (data) {
        Utils.success("模拟成功");
    });
}

function ChangeStage() {
    let lobbyId = $("#cr_stage_lobby_id").val();
    let roomId = $("#cr_stage_room_id").val();
    let stageId = $("#cr_stage_id").val();

    if (!lobbyId) {
        Utils.alert("请输入LobbyID");
        return;
    }

    if (!roomId) {
        Utils.alert("请输入RoomID");
        return;
    }

    if (!stageId) {
        Utils.alert("请输入阶段ID");
        return;
    }
    Utils.queryWithoutUin("change_stage", {
        lobbyId: lobbyId, roomId: roomId, stageId: stageId,
    }, function (data) {
        console.log(data);
        if (data === "ok") {
            Utils.success("切换成功");
        } else {
            Utils.alert("切换失败~" + data);
        }
    });
}

function ChangeLobbyStage() {
    let lobbyId = $("#cl_stage_lobby_id").val();
    let stageId = $("#cl_stage_id").val();

    if (!lobbyId) {
        Utils.alert("请输入LobbyID");
        return;
    }

    if (!stageId) {
        Utils.alert("请输入阶段ID");
        return;
    }
    Utils.queryWithoutUin("change_lobby_stage", {
        lobbyId: lobbyId, stageId: stageId,
    }, function (data) {
        Utils.success("切换成功");
    });
}

function ChangeAllStage() {
    let stageId = $("#ca_stage_id").val();

    if (!stageId) {
        Utils.alert("请输入阶段ID");
        return;
    }
    Utils.queryWithoutUin("change_all_stage", {
        stageId: stageId,
    }, function (data) {
        Utils.success("切换成功");
    });
}

function ResetRank() {
    let lobbyId = $("#rr_lobby_id").val();
    let rankType = $("#rr_rank_type").val();

    if (!lobbyId) {
        Utils.alert("请输入LobbyID");
        return;
    }

    if (!rankType) {
        Utils.alert("请输入排行榜类型");
        return;
    }
    Utils.queryWithoutUin("reset_rank", {
        lobbyId: lobbyId, rankType: rankType,
    }, function (data) {
        Utils.success("重置成功");
    });
}

function kickAccount() {
    let accountId = $("#kick_account_id").val();
    let lobbyId = $("#kick_lobby_id").val();
    if (!accountId || !lobbyId) {
        Utils.alert("请输入accountID 和 lobbyID！！！");
        return false;
    }

    Utils.queryWithoutUin("kick_account", {
        accountID: accountId, lobbyID: lobbyId,
    }, function (data) {
        Utils.success("踢出成功");
    });

    return;
}

function kickOutRoom() {
    let roomId = $("#get_kick_room_id").val();
    let lobbyId = $("#get_kick_lobby_id").val();
    if (!roomId || !lobbyId) {
        Utils.alert("请输入roomID 和 lobbyID！！！");
        return false;
    }

    Utils.queryWithoutUin("kick_out_room", {
        roomID: roomId, lobbyID: lobbyId,
    }, function (data) {
        Utils.success("踢出房间成功");
    });

    return;
}

function kickOutLobby() {
    let lobbyId = $("#lobby_id").val();
    if (!lobbyId) {
        Utils.alert("请输入 lobbyID！！！");
        return false;
    }

    Utils.queryWithoutUin("kick_out_lobby", {
        lobbyID: lobbyId,
    }, function (data) {
        Utils.success("踢出大厅成功");
    });

    return;
}

function queryAccountDetails() {
    let accId = $("#get_acc_details_account_id").val();
    let lobbyId = $("#get_acc_details_lobby_id").val();
    if (!accId || !lobbyId) {
        Utils.alert("请输入accID 和 lobbyID！！！");
        return false;
    }
    Utils.queryWithoutUin("get_account_info", {acc_id: accId, lobby_id: lobbyId}, function (data) {
        //console.log(data);
        let html = "";
        QueryPlayer = data;
        for (let k in data) {
            if (k == "backpack") {
                jsonstring = JSON.stringify(data[k]).replace(/},{/g, "} \n {");
                jsonstring = jsonstring.replace(/],/g, "] \n ");
                jsonstring = jsonstring.replace(/\n/g, "<br/>");
                html = `${html}<tr><td>${k}</td><td>${jsonstring}</td></tr>`;
            } else if (k == "catteries") {
                jsonstring = JSON.stringify(data[k]).replace(/]},{/g, "]} \n {");
                jsonstring = jsonstring.replace(/\n/g, "<br/>");
                html = `${html}<tr><td>${k}</td><td>${jsonstring}</td></tr>`;
            } else if (k == "nekomm_data") {
                jsonstring = JSON.stringify(data[k]).replace(/"version"/g, " \n \"version\" ");
                jsonstring = jsonstring.replace(/"values"/g, " \n \"values\" ");
                jsonstring = jsonstring.replace(/"attrs"/g, " \n \"attrs\" ");
                jsonstring = jsonstring.replace(/"map_normal_fashion"/g, " \n \"map_normal_fashion\" ");
                jsonstring = jsonstring.replace(/"own_fashion"/g, " \n \"own_fashion\" ");
                jsonstring = jsonstring.replace(/"map_dance_action_container"/g, " \n \"map_dance_action_container\" ");
                jsonstring = jsonstring.replace(/"ability_exp"/g, " \n \"ability_exp\" ");
                jsonstring = jsonstring.replace(/"datas"/g, " \n \"datas\" ");
                jsonstring = jsonstring.replace(/"consumes"/g, " \n \"consumes\" ");
                jsonstring = jsonstring.replace(/"luggage"/g, " \n \"luggage\" ");
                jsonstring = jsonstring.replace(/"ability_exp"/g, " \n \"ability_exp\" ");
                jsonstring = jsonstring.replace(/"route_ids"/g, " \n \"route_ids\" ");
                jsonstring = jsonstring.replace(/"own_fashion"/g, "  \"own_fashion\" \n ");
                jsonstring = jsonstring.replace(/"},"/g, " }, \n ");
                jsonstring = jsonstring.replace(/\n/g, "<br/>");
                html = `${html}<tr><td>${k}</td><td>${jsonstring}</td></tr>`;
            } else if (k == "mall_data") {
                jsonstring = JSON.stringify(data[k]).replace(/},{/g, "} \n {");
                jsonstring = jsonstring.replace(/\n/g, "<br/>");
                html = `${html}<tr><td>${k}</td><td>${jsonstring}</td></tr>`;
            } else if (k == "arenas") {
                jsonstring = jsonstring = JSON.stringify(data[k]).replace(/},{/g, "} \n {")
                jsonstring = jsonstring.replace(/{"map_dance_music_container"/g, " \n \"map_dance_music_container\" ");
                jsonstring = jsonstring.replace(/{"daily_arena_music"/g, " \n \"daily_arena_music\" ");
                jsonstring = jsonstring.replace(/"music_dance_object_new"/g, " \n \"music_dance_object_new\" ");
                jsonstring = jsonstring.replace(/"nk_id"/g, " \n \"nk_id\" ");
                jsonstring = jsonstring.replace(/},{/g, "} \n {");
                jsonstring = jsonstring.replace(/"pve_base_info"/g, " \n \"pve_base_info\" ");
                jsonstring = jsonstring.replace(/"daily_arena_music"/g, " \n \"daily_arena_music\" ");
                jsonstring = jsonstring.replace(/\n/g, "<br/>");
                html = `${html}<tr><td>${k}</td><td>${jsonstring}</td></tr>`;
            } else if (k == "shop_data") {
                jsonstring = JSON.stringify(data[k]).replace(/},{/g, "} \n {");
                jsonstring = jsonstring.replace(/],/g, "] \n ");
                jsonstring = jsonstring.replace(/\n/g, "<br/>");
                html = `${html}<tr><td>${k}</td><td>${JSON.stringify(jsonstring)}</td></tr>`;
            } else {
                html = `${html}<tr><td>${k}</td><td>${JSON.stringify(data[k])}</td></tr>`;
            }
        }
        $("#acc_details_body").html(html);
    });
}

function QueryAccountFalseOrder() {
    let accId = $("#get_acc_failed_order_account_id").val();
    let lobbyId = $("#get_acc_failed_order_lobby_id").val();
    if (!accId || !lobbyId) {
        Utils.alert("请输入accID 和 lobbyID！！！");
        return false;
    }
    Utils.queryWithoutUin("get_account_false_order", {acc_id: accId, lobby_id: lobbyId}, function (data) {
        //console.log(data);
        let html = "";
        for (let k in data) {
            html = `${html}<tr><td>${k}</td><td>${JSON.stringify(data[k])}</td></tr>`;
        }
        $("#acc_failed_order").html(html);
    });
}

function queryGlobalConfig() {
    Utils.queryWithoutUin("get_all_registry", {}, function (data) {
        if (!data) {
            Utils.alert("data error!");
            return false;
        }
        console.log(data);
        let global = data.global == null ? [] : data.global;
        let html = "";

        for (let i = 0; i < global.length; ++i) {
            let globalone = global[i];

            let category = globalone.Category, key = globalone.Key, value = globalone.Value;
            html = `${html}
                <tr>
                <td><input type="text" class="form-control" value="${category}" readonly="readonly"/></td>
                <td><input type="text" class="form-control" value="${key}" readonly="readonly"/></td>
                <td><input type="text" class="form-control" value="${value}" readonly="readonly"/></td>
                <td>
                <span class="input-group-btn">
                    <button class="btn btn-info" type="button" onclick="editRegistry($(this), 2)" style="min-width: 60px;">编辑</button>
                </span>
                <span class="input-group-btn">
                    <button class="btn btn-danger" type="button" onclick="deleteRegistry($(this), 2)" style="min-width: 60px;">删除</button>
                </span>
                <span class="input-group-btn" style="display: none;">
                    <button class="btn btn-info" type="button" onclick="editGolbConfigSubmit($(this))" style="min-width: 60px;">确定</button>
                </span>
                <span class="input-group-btn" style="display: none;">
                    <button class="btn btn-info" type="button" onclick="editRegistryCancel($(this))" style="min-width: 60px;">取消</button>
                </span>
                </td>>
                </tr>`
        }
        $("#registry_global_div").show();
        $("#registry_golbal_data").html(html);
        $("#registry_global_add_div").hide();

    });
}

function query_player_ban_list() {
    Utils.queryWithoutUin("query_player_ban_list", {}, function (data) {
        let html = "";
        for (k in data) {
            html = `${html}<tr><td>${data[k]}\t</td></tr>`
        }
        $("#band_account_list").html(html);
    });
}

function queryPlayerMuteList() {
    let lobbyId = $("#mute_list_lobby_id").val()
    if (!lobbyId) {
        Utils.alert("请输入lobbyID！！！");
        return false;
    }

    axios.get('gm/get_muted_users', {
        params: {lobbyId: lobbyId}, data: {}
    }).then(function (rsp) {
        strs = rsp.data.split(', ')
        let html = "";
        for (k in strs) {
            s = strs[k]
            if (s.length > 3) {
                html = `${html}<tr><td>${strs[k]}\t</td></tr>`
            }
        }
        $("#mute_account_list").html(html);
    }).catch(function (err) {
        console.log(err)
    });
}

function queryBanUploadPlayers() {
    let lobbyId = $("#upload_lobby_id").val()
    if (!lobbyId) {
        Utils.alert("请输入lobbyID！！！");
        return false;
    }
    axios.get('gm/get_ban_upload_players', {
        params: {lobbyId: lobbyId}, data: {}
    }).then(function (rsp) {
        strs = rsp.data.split(',')
        let html = "";
        for (k in strs) {
            s = strs[k]
            if (s.length > 3) {
                html = `${html}<tr><td>${strs[k]}\t</td></tr>`
            }
        }
        $("#unupload_list").html(html);
    }).catch(function (err) {
        console.log(err)
    });
}

function ban_upload(flag) {
    let op = "ban"
    if (flag == 1) {
        op = "unban"
    }

    let pid = $("#upload_player_id").val()
    let lid = $("#upload_lobby_id").val()
    axios({
        url: "/gm/upload_pic", method: "post", params: {
            "op": op, "lobbyid": lid, "playerid": pid,
        }
    }).then(function (rsp) {
        alert("成功")
    }).catch(function (err) {
        console.log(err)
    })
}

function mute_op(flag) {
    uri = ""
    if (flag == 1) {
        uri = "gm/mute_user"
    } else {
        uri = "gm/rm_muted_user"
    }
    acc_id = $("#mute_acc_id").val()
    lobbyId = $("#mute_lobby_id").val()
    axios({
        url: uri, method: "post", params: {
            "acc_id": acc_id, "lobbyId": lobbyId,
        }
    }).then(function (rsp) {
        alert("成功")
    }).catch(function (err) {
        console.log(err)
    })
}

function clickAddRegistryGlobal() {
    $("#registry_global_div").hide();
    $("#registry_global_add_div").show();
}

function addRegistryGlobalConfig() {
    let category = $("#registry_global_add_category").val(), t_key = $("#registry_global_add_key").val(),
        t_value = $("#registry_global_add_value").val();
    if (!category || !t_key || !t_value) {
        Utils.alert("请全部填写！");
        return false;
    }
    Utils.confirmWithKey("确定要添加Server？", function () {
        let sp = $("#confirm_with_key_pwd").val()
        Utils.actionPostWithKey("gm/add_registry_global_config", {
            category: category, t_key: t_key, t_value: t_value, super_key: sp,
        }, function (data) {
            Utils.success("添加成功")
        });
    });
}

function AddTime() {
    let addTimeOffs = $("#add_time").val();
    if (!addTimeOffs) {
        Utils.alert("请输入时间");
        return;
    }
    Utils.queryWithoutUin("add_timeOffs", {
        addTimeOffs: addTimeOffs,
    }, function (data) {
        Utils.success("添加成功");
    });
}

function AddDayTime() {
    let addTimeOffs = $("#add_day_time").val();
    if (!addTimeOffs) {
        Utils.alert("请输入时间");
        return;
    }

    Utils.queryWithoutUin("add_day_timeOffs", {
        addTimeOffs: addTimeOffs,
    }, function (data) {
        Utils.success("添加成功");
    });
}

function AddHourTime() {
    let addTimeOffs = $("#add_hour_time").val();
    if (!addTimeOffs) {
        Utils.alert("请输入时间");
        return;
    }

    Utils.queryWithoutUin("add_hour_timeOffs", {
        addTimeOffs: addTimeOffs,
    }, function (data) {
        Utils.success("添加成功");
    });
}

function QueryTime() {

    Utils.queryWithoutUin("query_timeOffs", {}, function (data) {
        console.log(data);
        if (!data) {
            Utils.alert("data error " + data);
            return;
        }
        let timeNow = data;
        $("#change_server_time").text(timeNow);
    });
}

function ResetTime() {
    Utils.queryWithoutUin("reset_timeOffs", {}, function (data) {
        Utils.success("添加成功");
    });
}

function FasterAddConvert() {
    let accountID = $("#convert_account_id").val();
    let fasterType = $("#faster_type").val();
    let lobbyId = $("#convert_lobby_id").val();
    if (!lobbyId) {
        Utils.alert("请输入LobbyID");
        return;
    }

    if (!accountID) {
        Utils.alert("请填写账号")
    }

    Utils.queryWithoutUin("gm/faster_add_convert", {
        acc_id: accountID, lobbyId: lobbyId, faster_type: fasterType,
    }, function (data) {
        Utils.success("添加成功");
    });
}

function notifyCodePush() {
    let lobbyId = $("#lobby_id").val()
    if (!lobbyId) {
        Utils.alert("请输入正确的lobbyID")
    }

    Utils.queryWithoutUin("gm/notify_code_push", {lobby_id: lobbyId}, function (data) {
        Utils.success("成功");
    });
}

function xgPush() {
    let lobbyId = $("#xg_push_lobby_id").val(), filter = $("#xg_push_filter").is(":checked"),
        hours = $("#xg_push_hours").val(), action = $("#xg_push_action").val(), actionUrl = $("#xg_push_url").val(),
        title = $("#xg_push_title").val(), content = $("#xg_push_content").val(), allServers = $("#push_server").val(),
        onlineState = $("#online_state").val();
    if (!title || !content) {
        Utils.alert("标题内容为必填项");
        return
    }

    Utils.confirmWithKey("确认推送？", function () {
        let sp = $("#confirm_with_key_pwd").val()
        Utils.actionPostWithKey("gm/xg_push", {
            lobbies: lobbyId,
            filter: filter,
            hours: hours,
            action: action,
            url: actionUrl,
            title: encodeURIComponent(title),
            content: encodeURIComponent(content),
            all_servers: allServers,
            online_state: onlineState,
            super_key: sp,
        }, function (data) {
            Utils.success("success");
        });
    }, function () {
    });
}

function DelCdkeyAttachmentItem(type, i) {
    let id_dom = $("#cdkey_" + type + "attach_type_" + i);
    //var num_dom = $("#notice_" + type + "attach_num_" + i);
    $(id_dom).parents("tr").remove();
}

function val2name(n) {
    switch (n) {
        case "1":
            return "金币";
        case "2":
            return "钻石";
        case "3":
            return "道具";
        case "4":
            return "猫";
        default:
            return "错误";
    }
}

var cdkey_item_count = 0;

function AddCdkeyItem(type, addition) {
    let table = $("#cdkey_" + type + "attach_table");
    let itype = $("#cdkey_" + type + "attach_newtype" + addition).val();
    let id = parseInt($("#cdkey_" + type + "attach_newid" + addition).val());
    let num = $("#cdkey_" + type + "attach_newnum" + addition).val();
    let combobox = $("#cdkey_" + type + "attach_newid1");
    let name = val2name(itype);
    if (combobox.length > 0) {
        name = $("option[value=" + itype + "]", combobox).text();
        if (Utils.isEmpty(name)) name = itype;
    }

    let i = cdkey_item_count + 1;
    let str = '<tr><td><div class="input-group">' + '<span class="input-group-addon">道具类型</span><span class="input-group-addon" style="min-width: 120px;"><span id="cdkey_' + type + 'attach_type_' + i + '" value="' + itype + '" class="cdkey_' + type + 'attach_typeclass">' + name + '</span></span>' + '<span class="input-group-addon">道具ID</span><span class="input-group-addon" style="min-width: 120px;"><span id="cdkey_' + type + 'attach_id_' + i + '" value="' + id + '" class="cdkey_' + type + 'attach_idclass">' + id + '</span></span>' + '<span class="input-group-addon">道具数量</span><span class="input-group-addon" style="min-width: 120px;"><span id="cdkey_' + type + 'attach_num_' + i + '" value="' + num + '" class="cdkey_' + type + 'attach_numclass">' + num + '</span></span>' + '<span class="input-group-btn"><input class="btn btn-danger" type="button" onclick="javascript:DelCdkeyAttachmentItem(\'' + type + '\', ' + i + '); " value="删除" /></span></div></td></tr>';
    $(table).append(str);
    cdkey_item_count++;
}

function SubmitAddPropPackage() {
    try {
        $("#cdkey_submit_url").val(PostTools.getPostURL());
        let items = PostTools.encodeCdkeyAttachCheck("item", "cdkey_submit_items");
        if (items === false) {
            return;
        }

        Utils.confirmWithKey("确定要增加掉落包？", function () {
            let sp = $("#confirm_with_key_pwd").val()
            $("#cdkey_submit_key").val(sp);
            Utils.ajaxFormSubmit("new_cdkey_action", `gm/add_drop_package?super_key=${sp}`, "post", function (data) {
                Utils.success("掉落包新增成功");
            });
        });
    } catch (e) {

    }
}

function AddProp() {
    let accountId = $("#add_goods_acc_id").val();
    let lobbyId = $("#add_goods_lobby_id").val();
    let paramList = $("#add_goods_param_list").val();
    let goodsType = $("#prop_type").val();

    if (!lobbyId) {
        Utils.alert("请输入LobbyID");
        return;
    }

    if (!accountId) {
        Utils.alert("请输入账号");
        return;
    }

    if (!paramList) {
        Utils.alert("请输入参数");
        return;
    }
    Utils.queryWithoutUin("gm/add_prop", {
        goodstype: goodsType, accountID: accountId, lobbyId: lobbyId, paramList: paramList,
    }, function (data) {
        Utils.success("添加成功");
    });
}
const gmProps = "5"
function AddProps() {
    let accountId = $("#add_goods_acc_id").val();
    let lobbyId = $("#add_goods_lobby_id").val();
    let paramList = $("#add_multiple_goods_param_list").val();
    let goodsType = gmProps;

    if (!lobbyId) {
        Utils.alert("请输入LobbyID");
        return;
    }

    if (!accountId) {
        Utils.alert("请输入账号");
        return;
    }

    if (!paramList) {
        Utils.alert("请输入参数");
        return;
    }

    Utils.queryWithoutUin("gm/add_prop", {
        goodstype: goodsType, accountID: accountId, lobbyId: lobbyId, paramList: paramList,
    }, function (data) {
        Utils.success("添加成功");
    });

}

function AutoAddProp() {
    let accountId = $("#add_goods_acc_id").val();
    let lobbyId = $("#add_goods_lobby_id").val();
    let paramList1 = "1,10000000"
    let paramList2 = "2,10000000"
    let goodsType = "1";

    if (!lobbyId) {
        Utils.alert("请输入LobbyID");
        return;
    }

    if (!accountId) {
        Utils.alert("请输入账号");
        return;
    }

    Utils.queryWithoutUin("gm/add_prop", {
        goodstype: goodsType, accountID: accountId, lobbyId: lobbyId, paramList: paramList1,
    }, function (data) {
        Utils.success("添加成功");
    });
    Utils.queryWithoutUin("gm/add_prop", {
        goodstype: goodsType, accountID: accountId, lobbyId: lobbyId, paramList: paramList2,
    }, function (data) {
        Utils.success("添加成功");
    });
}

function GenerateCDkey() {
    let startTime = $("#start_time").val(), endTime = $("#end_time").val(), channel = $("#channel").val(),
        packageID = $("#package_id").val(), maxExchangeCount = $("#max_exchange_count").val(),
        generateCount = $("#generate_count").val();

    if (!startTime || !endTime || !channel || !packageID || !maxExchangeCount || !generateCount) {
        Utils.alert("请全部填写！");
        return false;
    }

    startTime = (startTime.replace("T", " ") + ":00")
    endTime = (endTime.replace("T", " ") + ":00")

    Utils.confirmWithKey("确定要生成兑换码？", function () {
        let form = $("<form id='cdk_download' class='hidden' method='post'></form>");
        form.attr("action", `gm/generate_cdkey`);
        let sTime = $("<input name='start_time' type='text'/>");
        sTime.attr("value", startTime);
        let eTime = $("<input name='end_time' type='text'/>");
        eTime.attr("value", endTime);
        let ch = $("<input name='channel' type='text'/>");
        ch.attr("value", channel);
        let pkgId = $("<input name='package_id' type='text'/>");
        pkgId.attr("value", packageID);
        let maxExC = $("<input name='max_exchange_count' type='text'/>");
        maxExC.attr("value", maxExchangeCount);
        let gCnt = $("<input name='generate_count' type='text'/>");
        gCnt.attr("value", generateCount);
        let key = $("#confirm_with_key_pwd").val();
        let k = $("<input name='key' type='text'/>");
        k.attr("value", key);
        let sp = $("<input name='super_key' type='text'/>");
        sp.attr("value", key)
        form.append(sTime);
        form.append(eTime);
        form.append(ch);
        form.append(pkgId);
        form.append(maxExC);
        form.append(gCnt);
        form.append(k);
        form.append(sp);
        $("body").append(form);
        console.log(form);
        form.submit();


        // Utils.actionPostWithKey("gm/generate_cdkey", {start_time: startTime, end_time:endTime, channel:channel,
        //     package_id:packageID, max_exchange_count:maxExchangeCount, generate_count:generateCount}, function (data) {
        //     console.log(data);
        //     Utils.success("设置成功");
        // });
    });
}

// 兑换码添加 掉落包删除功能
function delete_item(packid) {
    Utils.confirmWithKey("是否确认删除掉落包?", function () {
        //$("#delete_package_" + packid).val($("#confirm_with_key_pwd").val());

        let sp = $("#confirm_with_key_pwd").val()
        Utils.queryWithoutUin(`gm/delete_package?super_key=${sp}&package_id=` + packid, {}, function (data) {
            if (data === "") {
                return
            }

            Utils.success("删除掉落包成功" + data);
            $("#" + packid).remove()
        })
    });
}

function query_cdkey_drop_package() {
    Utils.queryWithoutUin("gm/get_drop_package", {}, function (data) {
        if (!data) {
            data = [];
        }
        let html = "";
        let roleList = JSON.parse(data);

        roleList.items = roleList.items.sort((a, b) => {
            return b.package_id - a.package_id
        })

        for (let i = 0; i < roleList.items.length; ++i) {
            html = `${html}<tr id="${roleList.items[i].package_id}">
                    <td><input type="text" style="min-width: 200px;" class="form-control" value="${roleList.items[i].package_id}" readonly>
                    <button id="delete_package_${roleList.items[i].package_id}" type="button" onclick="delete_item(${roleList.items[i].package_id})">删除</button></td>
                    <td><textarea class="form-control" readonly="readonly" rows="5" style="width: 400px;">${JSON.stringify(roleList.items[i].items)}</textarea></tr>`
        }
        $("#query_pack_prop").html(html);
    })
}

function submitForm(id) {
    $(`#${id}`).ajaxSubmit(function (msg) {
        if (msg.result === 0) {
            Utils.success("ok")
        } else {
            Utils.alert(msg.error + "---" + msg.msg);
        }
    });
    return false;
}

function submitAndDisplay(id, area) {
    $(`#${id}`).ajaxSubmit(function (msg) {
        a = JSON.stringify(msg)
        document.getElementById(area).value = a || "error"
    });
    return false;
}

function query_cdk() {
    let k = document.getElementById("cdk_code").value
    k = window.btoa(k)
    axios.get('gm/get_cdk_info', {
        params: {
            "cdk": k,
        },
    }).then(function (resp) {
        document.getElementById("cdk_code_info").value = resp.data.msg || "code err"
    }).catch(function (resp) {
        Utils.alert(resp.data);
    })
}

function displayResult() {
    $("#batch_ban").ajaxSubmit(function (data) {
        if (data.result === 0) {
            Utils.success("ok")
            document.getElementById("ban_result").value = data.msg || "error"
        } else {
            console.log(data)
            Utils.alert(data.error + "---" + data.msg)
        }
    });
    return false;
}

function displayAttrResult() {
    $("#batch_ability").ajaxSubmit(function (data) {
        if (data.result === 0) {
            Utils.success("属性添加成功")
        } else {
            Utils.alert(data.error + "---" + data.msg)
        }
    });
    return false;
}

function submitCoupon() {
    $("#coupon_code_info").ajaxSubmit(function (res) {
        let items = ""
        for (i in res) {
            items += JSON.stringify(res[i]) + "\n"
        }
        document.getElementById("coupon_info_show").value = items || "error"
        console.log(res)
    });
    return false;
}

function submitPatch() {
    $("#patch_coupon_code").ajaxSubmit(function (res) {
        if (res.result === 0) {
            Utils.success("ok")
            document.getElementById("coupon_code_show").value = res.msg || "error"
        } else {
            Utils.alert(res.error + "---" + res.msg)
            console.log(res)
        }
    });
    return false;
}

function submitFormDisplay(fid, tid) {
    $(`#${fid}`).ajaxSubmit(function (res) {
        if (res.result === 0) {
            Utils.success("ok")
        } else {
            Utils.alert(res.error + "---" + res.msg)
            console.log(res)
        }
        document.getElementById(tid).value = JSON.stringify(res)
    });
    return false
}

function changeLobby() {
    accountId = $("#query_account_id").val()
    deviceId = $("#query_device_id").val()
    oldLobbyId = $("#change_server_old_lobby").val()
    newLobbyId = $("#old_lobby_id").val()
    oldAccount = $("#old_account_id").val()
    axios({
        method: "post", url: "change_lobby", params: {
            "account": accountId,
            "device": deviceId,
            "oldLobby": oldLobbyId,
            "newLobby": newLobbyId,
            "oldAccount": oldAccount,
        }
    }).then(function (resp) {
        if (resp.data.result === 0) {
            Utils.success("ok" + resp.data.msg)
        } else {
            Utils.alert(resp.error)
        }
    }).catch(function (resp) {
        consol.log("resp error" + resp)
        Utils.alert("internal err")
    })
}

//QueryAllUserInfo()
//GetAllGroup()
//queryAllPolicy()
setCurPage(1)
cook = document.cookie
cookArr = cook.split(";")
for (let v of cookArr) {
    v = v.trim().split("=")
    if (v[0] === "user") {
        curUser = v[1]
    }
}
$("#cur_user_name").replaceWith(curUser)

window.setTimeout(PageInit, 100);

function queryPlayerLoginPolicy() {
    fetch("/gm/rp/policies", {
        method: "GET",
    }).then(res => res.json()).then(rsp => {
        console.log(rsp)
        let node = $('#player_login_policy tbody')
        node.innerText = ""
        for (let i of rsp.data.items) {
            node.append(`<tr><td>${i.id}</td><td>${new Date(i.permit_login_start * 1000)}</td><td>${new Date(i.permit_login_end * 1000)}</td><td>${i.memo}</td></tr>`)
        }
        document.getElementById("default_policy").innerHTML = rsp.data.defaultPolicy
    })
}

queryPlayerLoginPolicy()

function addPlayerLoginPolicy() {
    let id = document.getElementById("player_policy_id")
    let begin = document.getElementById("player_policy_begin")
    let end = document.getElementById("player_policy_end")
    let memo = document.getElementById("player_policy_memo")
    fetch(`/gm/rp/policy/${id.value}/add`, {
        method: "POST", headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "id": parseInt(id.value),
            "permit_login_start": Date.parse(begin.value) / 1000,
            "permit_login_end": Date.parse(end.value) / 1000,
            "memo": memo.value,
        })
    }).then(res => res.json()).then((rsp) => {
        console.log(rsp)
        queryPlayerLoginPolicy()
    })
}

function editPlayerLoginPolicy() {
    let id = document.getElementById("player_policy_id")
    let begin = document.getElementById("player_policy_begin")
    let end = document.getElementById("player_policy_end")
    let memo = document.getElementById("player_policy_memo")
    let obj = {}
    if (!id.value || id.value === '' || id.value < 0) {
        alert("id is required and must be positive")
        return
    }
    obj.id = parseInt(id.value)
    if (begin.value && begin.value !== '') {
        obj.permit_login_start = Date.parse(begin.value) / 1000
    }
    if (end.value && end.value !== '') {
        obj.permit_login_end = Date.parse(end.value) / 1000
    }
    if (memo.value && memo.value !== '') {
        obj.memo = memo.value
    }
    fetch(`/gm/rp/policy/${id.value}`, {
        method: "POST", headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    }).then((rsp) => {
        console.log(rsp)
        queryPlayerLoginPolicy()
    })
}

function queryPlayerPolicy() {
    let playerID = document.getElementById("player_id_policy").value
    fetch(`/gm/rp/account_policy?player=${playerID}`).then(res => res.json()).then(rsp => {
        console.log(rsp)
        document.getElementById("player_id_policy_display").value = JSON.stringify(rsp.data)
    })
}

function queryPlayerByPolicy() {
    let policyID = document.getElementById("policy_id_of_player").value
    fetch(`/gm/rp/account?id=${policyID}`).then(res => res.json()).then(rsp => {
        console.log(rsp)
        document.getElementById("policy_id_of_player_display").value = JSON.stringify(rsp.data)
    })
}

function setDefaultPolicy() {
    let defaultPolicy = document.getElementById("default_policy")
    let defaultPolicyInput = document.getElementById("default_policy_input")
    fetch(`/gm/rp/default_policy?id=${defaultPolicyInput.value}`, {method: "POST"}).then(() => {
        defaultPolicy.innerText = defaultPolicyInput.value
    })
}

function setPlayerPolicy() {
    let policyID = document.getElementById("set_player_policy").value
    let playerID = document.getElementById("player_id_policy").value
    if (!policyID || policyID === '' || !playerID || playerID === '') {
        alert("玩家id 和 权限id 不能空")
        return
    }
    fetch(`/gm/rp/account_policy?id=${policyID}&player=${playerID}`, {
        method: "POST"
    }).then()
}

function kickPlayerByPolicy() {
    let pid = document.getElementById("kick_policy").value
    fetch(`/kick_player_by_policy?policy=${pid}`, {
        method: "POST"
    }).then()
}

function addLobbyGroup() {
    Utils.confirmWithKey("确定要创建一个新的分组？", function () {
        Utils.actionPostWithKey("gm/add_new_server_group", {}, function (data) {
            console.log(data);
            $("#server_lobby_group_id").val(data.group_id);
            Utils.success("SUCCESS");
        });
    });
}

function disbandLobbyGroup() {
    let groupId = $("#server_lobby_group_id").val();
    if (!groupId || !$.isNumeric(groupId)) {
        Utils.alert("请输入正确的服务器分组ID");
        return false;
    }

    Utils.confirmWithKey(`确定要解散分组'${groupId}'吗?`, function () {
        Utils.actionPostWithKey("gm/disband_server_group", {group_id: groupId}, function (data) {
            Utils.success(`成功解散分组'${groupId}'`);
        });
    });
}

function getLatestGroupId() {
    Utils.queryWithoutUin("latest_server_group", {}, function (data) {
        console.log(data);
        $("#server_lobby_group_id").val(data);
        Utils.success("SUCCESS");
    });
}

function joinLobbyGroup() {
    let lobbyId = $("#server_lobby_id").val(),
        groupId = $("#server_lobby_group_id").val(),
        mapId = $("#server_map_id").val();

    if (!lobbyId || !groupId || !mapId || !$.isNumeric(lobbyId) || !$.isNumeric(groupId) || !$.isNumeric(mapId)) {
        Utils.alert("请正确填写服务器ID,分组ID,地图ID");
        return false;
    }

    Utils.confirmWithKey(`确定要把服务器'${lobbyId}'加入分组'${groupId}'吗？`, function () {
        Utils.actionPostWithKey("gm/join_server_group", {
            lobby_id: lobbyId,
            group_id: groupId,
            map_id: mapId
        }, function (data) {
            console.log(data);
            Utils.success("SUCCESS");
        });
    });
}

function outLobbyGroup() {
    let lobbyId = $("#server_lobby_id").val();

    if (!lobbyId) {
        Utils.alert("请正确填写服务器ID");
        return false;
    }

    Utils.confirmWithKey("确定要退出分组吗？", function () {
        Utils.actionPostWithKey("gm/out_server_group", {lobby_id: lobbyId}, function (data) {
            Utils.success("SUCCESS");
        });
    });
}

function getGroupsInfo() {
    $("#dir_server_div").hide();
    $("#recommend_server_div").hide();
    $("#dir_domain_div").hide();
    $("#online_player_div").hide();
    $("#dir_server_add_div").hide();
    $("#server_group_div").show();

    Utils.queryWithoutUin("lobby_groups", {}, function (data) {
        console.log(data);
        let html = "";
        for (let groupId in data) {
            let lobbies = "";
            let lobbyList = data[groupId];
            if (lobbyList.length === 1 && lobbyList[0] === 0) {
                lobbies = "无数据";
            } else {
                lobbies = lobbyList.join(", ");
            }
            html = `${html}<tr>
                <td><input type="text" class="form-control" disabled="disabled" value="${groupId}"></td>
                <td><input type="text" class="form-control" disabled="disabled" value="${lobbies}"></td>
                </tr>`;
        }
        $("#server_group_data").html(html);
    });
}



