function upload_act_file() {
    let formData = new FormData();
    formData.append("act_file_zip", $("#act_file_zip")[0].files[0]);

    Utils.confirmWithKey("确定上传活动资源？请输入超级密码", function() {
        let sp = $("#confirm_with_key_pwd").val()
        Utils.ajaxUploadFileWithKey(`gm/upload_act_tabs?super_key=${sp}`, formData, function (data) {
            console.log(data);
            $("#act_file_ver").val(data);
            $("#act_ver").val(data);
            Utils.success("上传成功");
        });
    });
}

function set_act_ver() {
    let svrVer = $("#svr_ver").val().trim(),
        actVer = $("#act_ver").val().trim();
    let svrVerArr = svrVer.split(".");
    if (svrVerArr.length !== 4 || !$.isNumeric(svrVerArr[0]) || !$.isNumeric(svrVerArr[1]) || !$.isNumeric(svrVerArr[2])
        || !$.isNumeric(svrVerArr[3]) || !$.isNumeric(actVer)) {
        Utils.alert("版本号格式错误");
        return false;
    }

    Utils.confirmWithKey("确定设置更新活动版本？", function () {
        let sp = $("#confirm_with_key_pwd").val()
        Utils.actionPostWithKey("gm/set_act_ver", {
            svr_ver: svrVer,
            act_ver: actVer,
            super_key: sp,
        }, function (data) {
            console.log(data);
            Utils.success("设置成功");
        });
    });
}

function render_lobby_versions(data, page, size) {
    let html = "";
    for (let i = (page-1)*size; i < page*size && i < data.length; ++i) {
        html = `${html}<tr><td><span class="input-group">${data[i].lobby_id}</span></td>
                            <td><span class="input-group">${data[i].version}</span></td></tr>`;
    }
    $("#lobby_versions_tbody").html(html);
}

function render_act_versions(data, page, size) {
    let html = "";
    for (let i = (page - 1) * size; i < page * size  && i < data.length; ++i) {
        html = `${html}<tr><td><span class="input-group">${data[i].svr_ver}</span></td>
                <td><span class="input-group">${data[i].act_ver}</span></td>
                <td><span class="input-group"><a href="/download_act_files?act_ver=${data[i].act_ver}" download="act_files_${data[i].act_ver}.zip">导出</a>
                    &nbsp;<a href="javascript:;" onclick="delServerAct('${data[i].svr_ver}')">删除</a></span></td>
                </tr>`;
    }
    $("#act_versions_tbody").html(html);
}

function query_lobby_versions() {
    let lobbyId = $("#act_filter_lobby").val().trim();
    let svrVer = $("#act_filter_svr_ver").val().trim();
    console.log(lobbyId, svrVer);
    Utils.queryWithoutUin("lobby_versions", {}, function (data) {
        $("#paging-lobby").html("");
        if (!data) {
            data = [];
        }
        let filterData = [];
        for (let i = 0; i < data.length; ++i) {
            if (lobbyId && data[i].lobby_id != lobbyId) {
                continue;
            }
            if (svrVer && data[i].version != svrVer) {
                continue;
            }
            filterData.push(data[i]);
        }
        if (filterData.length === 0) {
            Utils.success("没有数据");
            return;
        }
        filterData.sort(function (d1, d2) {
            return d1.lobby_id - d2.lobby_id;
        });

        let defaultSize = 20;
        render_lobby_versions(filterData, 1, defaultSize);
        // console.log(data);
        let cnt = filterData.length;
        $("#paging-lobby").Paging({
            pagesize: defaultSize, // 默认每页多少条
            count: cnt, // 一共多少条
            toolbar: true,
            callback: function(page, size, count) { // page: 当前第几页，size: 一页多少条，count: 共几页
                render_lobby_versions(filterData, page, size);
            }
        });
    });
}

function delServerAct(svrVer) {
    if (!svrVer) {
        return;
    }

    Utils.confirmWithKey("确定删除该服务器活动数据?", function () {
        let sp = $("#confirm_with_key_pwd").val()
        Utils.actionPostWithKey("gm/del_svr_act_ver", {svr_ver: svrVer.trim(), super_key: sp}, function (data) {
            query_act_versions();
            // Utils.success("已删除");
        });
    });
}

function query_act_versions() {
    let svrVer = $("#act_filter_act_svr_ver").val();
    let actVer = $("#act_filter_act_ver").val();
    Utils.queryWithoutUin("act_versions", {}, function (data) {
        $("#paging-act").html("");
        if (!data) {
            data = [];
        }
        let filterData = [];
        for (let i = 0; i < data.length; ++i) {
            if (svrVer && svrVer != data[i].svr_ver) {
                continue;
            }
            if (actVer && actVer != data[i].act_ver) {
                continue;
            }
            filterData.push(data[i]);
        }
        if (filterData.length === 0) {
            Utils.success("没有数据");
            $("#act_versions_tbody").html("");
            return;
        }

        let defaultSize = 20;
        render_act_versions(filterData, 1, defaultSize);
        let cnt = filterData.length;
        $("#paging-act").Paging({
            pagesize: defaultSize, // 默认每页多少条
            count: cnt, // 一共多少条
            toolbar: true,
            callback: function(page, size, count) { // page: 当前第几页，size: 一页多少条，count: 共几页
                render_act_versions(filterData, page, size);
            }
        });
    });
}

function query_ongoing_act() {
    let actVer = $("#query_act_ver").val().trim();
    if (!actVer) {
        Utils.alert("请输入活动版本号");
        return false;
    }
    Utils.queryWithoutUin("ongoing_act", {
        act_ver: actVer
    }, function (data) {
        console.log(data);
        if (!data) {
            data = [];
        }
        let html = "";
        for (let i = 0; i < data.length; ++i) {
            let closed = data[i].state === 0 ? "否" : "是";
            let op = data[i].state === 0 ? 1 : 0;
            let desc = op === 0 ? "开启" : "关闭";
            html = `${html}<tr><td><input type="text" class="form-control" value="${data[i].act_id}" readonly></td>
                    <td><input type="text" class="form-control" value="${data[i].gid}" readonly></td>
                    <td><input type="text" class="form-control" value="${data[i].begin_time}" readonly></td>
                    <td><input type="text" class="form-control" value="${data[i].end_time}" readonly></td>
                    <td><input type="text" class="form-control" value="${closed}" readonly></td>
                    <td><span class="input-group-btn">
                    <button type="button" class="btn btn-warning" onclick="activity_state_op($(this), ${actVer}, ${data[i].act_id}, ${op})">${desc}</button></span></td></tr>`
        }
        $("#ver_act_state").html(html);
    })
}

// state: 0-设置状态为0(开启), 1-设置状态为1(关闭)
function activity_state_op(e, actVer, actId, state) {
    Utils.confirmWithKey("确定执行该操作？", function () {
        let sp = $("#confirm_with_key_pwd").val()
        Utils.actionPostWithKey("gm/activity_state_op", {
            act_ver: actVer,
            act_id: actId,
            state: state,
            super_key: sp,
        }, function (data) {
            Utils.success("操作成功");
            let desc = "关闭";
            let stateStr = "否";
            let newState = 1;
            if (state === 1) {
                desc = "开启";
                stateStr = "是";
                newState = 0;
            }
            // 就是改下控件描述
            e.text(desc);
            e.attr("onclick", `activity_state_op($(this), ${actVer}, ${actId}, ${newState})`);
            let se = e.parent().parent().siblings("td").eq(4).children("input");
            se.val(stateStr);
        });
    });
}








