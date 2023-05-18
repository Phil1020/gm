var Local = Local || {};

function OnLoad() {
    let qs = window.location.search.substring(1);
    let ownerId = qs.substring(qs.indexOf('=')+1, qs.indexOf('&'));
    let postId = qs.substring(qs.lastIndexOf('=')+1);
    $("#owner_id").val(ownerId);
    $("#post_id").val(postId);
    $("#load_reply_count").val(0);

    fetchPost();
}

function ScroolTop() {
    //window.scroll(0, 0);
}

function replyEdit(e) {
    let index = e.parentNode.parentNode.parentNode.rowIndex
    var div = document.getElementById("reply_list").rows[index+1]
    if (div.style.display == "none") {
        div.style.display = ""
    } else {
        div.style.display = "none"
    }
}

function showReplyPost() {
    let td = document.getElementById("reply_post_div")
    if (td.style.display == 'none') {
        td.style.display = 'block'
    } else {
        td.style.display = 'none'
    }
}

function setUpvoteCount() {
    let ownerId = $("#owner_id").val();
    let postId = $("#post_id").val();
    let upvoteCount = $("#upvote_count").val();

    call("gm/set_upvote_count",
        { owner_id: ownerId, post_id: postId, upvote_count: upvoteCount,
    }, function (data) {

    });
}

function setGmShield() {
    let ownerId = $("#owner_id").val();
    let postId = $("#post_id").val();
    let gmShield = $("#gm_shield").val();

    call("gm/set_gm_shield",
        { owner_id: ownerId, post_id: postId, shield: gmShield,
        }, function (data) {

        });
}

function checkReply(replyerId, replyContent) {
    var re = /^[0-9]+.?[0-9]*$/;
    if (!re.test(replyerId)) {
        Utils.alert("请正确的输入你的账号ID");
        return false;
    }

    let newContent = replyContent.replace(/(^\s*)|(\s*$)/g, "");
    if (newContent == "") {
        Utils.alert("请输入回复内容");
        return false;
    }

    return true
}

function delPost() {
    let ownerId = $("#owner_id").val();
    let postId = $("#post_id").val();

    call("gm/del_post",
        {
            owner_id: ownerId,
            post_id: postId,
        },
        function (res) {

        });
}

function replyPost() {
    let ownerId = $("#owner_id").val();
    let postId = $("#post_id").val();
    let replyerId = $("#replyer_id").val();
    let replyContent = $("#reply_content").val();

    if (!checkReply(replyerId, replyContent)) {
        return false
    }

    call("gm/reply_post",
        {
            owner_id: ownerId,
            post_id: postId,
            reply_floor: 0,
            reply_acct: ownerId,
            replyer_id: replyerId,
            reply_content: replyContent,
        },
        function (res) {

    });
}

function replyPostReply(e) {
    let ownerId = $("#owner_id").val();
    let postId = $("#post_id").val();

    var p  = e.parentNode.parentNode
    let replyerId = p.getElementsByTagName("input")[0].value
    let replyContent = p.getElementsByTagName("input")[1].value

    if (!checkReply(replyerId, replyContent)) {
        return false
    }

    let index = e.parentNode.parentNode.parentNode.parentNode.parentNode.rowIndex
    var div = document.getElementById("reply_list").rows[index-1]
    let floor = div.cells[0].innerHTML;
    let replyAcct = div.cells[2].innerHTML;

    call("gm/reply_post",
        {
            owner_id: ownerId,
            post_id: postId,
            reply_floor: floor,
            reply_acct: replyAcct,
            replyer_id: replyerId,
            reply_content: replyContent,
        },
        function (res) {

    });
}

function  fetchPost() {
    let ownerId = $("#owner_id").val();
    let postId = $("#post_id").val();
    let loadCount = $("#load_reply_count").val();

    call("gm/fetch_post",
        {owner_id: ownerId, post_id : postId, load_count: loadCount},
        function (data) {
            console.log(data);
            let html = "";
            let replys = data.replys
            for (let i = 0; i < replys.length; ++i) {
                let reply = replys[i];
                let floor =  reply.floor,
                    replyAcct = reply.reply_acct,
                    replyId = reply.replyer_id,
                    text = reply.text;

                html = `${html} 
                <tr>
                    <td id="floor">${floor}</td>
                    <td>${replyAcct}</td>
                    <td>${replyId}</td>
                    <td>${text}</td>
                    <td><span class="input-group-btn"><button class="btn btn-info" type="button" href="javascript:void(0);" onclick="replyEdit(this)">回复</button></span></td>
                </tr>
                <tr style="display: none">
                    <td colspan="5" >
                     <div class="table-responsive">
                        <div class="input-group">
                            <span class="input-group-addon">
                                你的账号ID：
                            </span>
                            <span class="text-success">
                                 <input type="text" class="form-control" style="width: 160px;" id="owner_id" value="" />
                            </span>
                            <span class="input-group-addon" style="width: auto">
                                回复内容:
                            </span>
                            <span class="text-success" style="width: auto">
                                 <input type="text" class="form-control" id="load_count" value="" />
                            </span>
                            <span class="input-group-btn">
                                <button class="btn btn-info" type="button" onclick="replyPostReply(this)" style="width: 55px;">
                                    提交
                                </button>
                            </span>
                        </div>
                     <div>
                    </td>
                </tr>`;
            }
            //console.log(html);
            $("#reply_div").show();
            $("#reply_list").append(html);
            if (replys.length < 10) {
                $("#load_more").hide();
            } else {
                $("#load_more").show();
            }

            $("#upvote_count").val(data.gm_upvote_count)
            $("#gm_shield").val(data.gm_shield)
            console.log(replys.length + parseInt(loadCount))
            $("#load_reply_count").val(replys.length + parseInt(loadCount));
    });
}

function loadMoreReply() {
    let ownerId = $("#owner_id").val();
    let postId = $("#post_id").val();
    let loadCount = $("#load_reply_count").val();

    call("gm/fetch_post_reply",
        {owner_id: ownerId, post_id : postId, load_count: loadCount},
        function (replys) {
            console.log(replys);
            let html = "";
            for (let i = 0; i < replys.length; ++i) {
                let reply = replys[i];
                let floor =  reply.floor,
                    replyAcct = reply.reply_acct,
                    replyId = reply.replyer_id,
                    text = reply.text;

                html = `${html}         
                <tr>
                <td>${floor}</td>
                <td>${replyAcct}</td>
                <td>${replyId}</td>
                <td>${text}</td>
                <td><span class="input-group-btn"><button class="btn btn-info" type="button" href="javascript:void(0);" onclick="replyEdit(this)">回复</button></span></td>
                </tr>
               <tr style="display: none">
                    <td colspan="5">
                     <div class="table-responsive">
                        <div class="input-group">
                            <span class="input-group-addon">
                                你的账号ID：
                            </span>
                            <span class="text-success">
                                 <input type="text" class="form-control" style="width: 160px;" id="replyer_id"  value="" />
                            </span>
                            <span class="input-group-addon" style="width: auto">
                                回复内容:
                            </span>
                            <span class="text-success" style="width: max-content">
                                 <input type="text" class="form-control" id="reply_content" value="" />
                            </span>
                            <span class="input-group-btn">
                                <button class="btn btn-info" type="button" onclick="replyPostReply(this)" style="width: 55px;">
                                    提交
                                </button>
                            </span>
                        </div>
                     <div>
                    </td>
                </tr>`;
            }
            //console.log(html);
            $("#reply_div").show();
            $("#reply_list").append(html);
            if (replys.length < 10) {
                $("#load_more").hide();
            } else {
                $("#load_more").show();
            }
            console.log(replys.length + parseInt(loadCount))
            $("#load_reply_count").val(replys.length + parseInt(loadCount));
    });
}

function call(url, args, callback) {
    $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        data: args,
        success: function (res) {
            if (res.result == 0) {
                callback(res.msg)
                Utils.success("成功")
            } else {
                Utils.alert("服务器错误：" + Utils.json2str(res.error));
            }
        },
        error: function () {
            Utils.alert("请求服务器错误！");
        }
    });
}

window.setTimeout(OnLoad, 100);