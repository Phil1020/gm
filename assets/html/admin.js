function QueryUserInfo() {
    const un = $("#user_name").val();
    const uri = `gm/query_user?user_name=${un}`;
    $.ajax({
        url: uri,
        method: "GET",
        success: function (result) {
            console.log(result)
            result = result.user
            let ele = $("#table_body")
            ele.empty()
            if (result.name == curUser) {
                ele.append(`<tr style="background: salmon"><th>${result.name}</th><th>${result.password}</th><th>${result.group}</th></tr>`)
            } else {
                ele.append(`<tr ><th>${result.name}</th><th>${result.password}</th><th>${result.group}</th></tr>`)
            }
        },
        error: function (e) {
            alert(e.responseJSON.error)
            console.log(e)
        }
    })
}

function QueryAllUserInfo() {
    $.ajax({
        url: "gm/query_all_user",
        method: "GET",
        success: function (result) {
            console.log(result)
            let ele = $("#table_body")
            ele.empty()
            for (const v of result.all_info) {
                if (v.name == curUser) {
                    ele.append(`<tr style="background: salmon"><th>${v.name}</th><th>${v.password}</th><th>${v.group}</th></tr>`)
                } else {
                    ele.append(`<tr><th>${v.name}</th><th>${v.password}</th><th>${v.group}</th></tr>`)
                }
            }
        },
        error: function (e) {
            alert(e.responseJSON.error)
            console.log(e)
        }
    })
}

function DeleteUser() {
    const u = $("#user_name").val();
    uri = `gm/delete_user?user_name=${u}&super_key=`;
    Utils.confirmWithKey(`确定要删除用户${u}吗?`, function () {
        const sk = this.$content.find('#confirm_with_key_pwd').val()
        uri += sk
        $.ajax({
            url: uri,
            method: "DELETE",
            success: function (result) {
                console.log(result)
                alert("成功")
            },
            error: function (e) {
                alert(e.responseJSON.error)
                console.log(e)
            }
        })
    })
}

function ChangePassword() {
    const name = $("#cp_user_name").val();
    const pwd = $("#user_pwd").val();
    const con = $("#confirm_pwd").val();

    if (pwd != con) {
        alert("两次密码不一致!")
        return
    }
    info=`user_name=${name}&password=${pwd}`
    var uri = `gm/modify_password`
    $.ajax({
        url: uri,
        method: "POST",
        success: function (result) {
            alert("修改成功")
        },
        data: info,
        error: function (e) {
            alert(e.responseJSON.error)
            console.log(e)
        }
    })
}

function CreateUser() {
    const u = $("#new_user").val();
    const pwd = $("#new_pwd").val();
    const con = $("#new_confirm_pwd").val();
    const group = $("#user_group_select").val();

    if (pwd != con) {
        alert("两次密码不一致!")
        return
    }
    info=`user_name=${u}&password=${pwd}&group_id=${group}`

    Utils.confirmWithKey(`确定要创建用户${u}吗?`, function () {
        const sk = this.$content.find('#confirm_with_key_pwd').val()
        info += `&super_key=${sk}`
        $.ajax({
            url: "gm/create_user",
            method: "POST",
            success: function (result) {
                alert("成功")
                QueryAllUserInfo()
            },
            error: function (e) {
                alert(e.responseJSON.error)
                console.log(e)
            },
            data: info,
        })
    })
}

function optionEle(k, v) {
    return `<option value="${k}">${v}</option>`
}

function GetAllGroup() {
    $.ajax({
        url: "gm/query_all_group",
        method: "GET",
        success: function (result) {
            console.log(result)
            let ele = $("#group_user_selection")
            let ele2 = $("#group_permission_selection")
            let ele3 = $("#user_group_select")
            ele2.empty()
            ele.empty()
            ele3.empty()
            for (const v of result.groups) {
                ele2.append(optionEle(v.group_id, v.group_name))
                ele.append(optionEle(v.group_id, v.group_name))
                ele3.append(optionEle(v.group_id, v.group_name))
            }
        },
        error: function (e) {
            alert(e.responseJSON.error)
            console.log(e)
        }
    })
}

function queryAllPolicy() {
    axios.get('/gm/query_group', {
        params: {group_id: "0"}, data: {}
    }).then(function (rsp) {
        let ele2 =$("#group_opt_2")
        ele2.empty()
        for (const v of rsp.data.policy) {
            allow = ""
            idx = v.permission_id
            if (v.allowed == false) {
                allow = "disabled"
            }
            s = `<input class="form-check-input" name="${idx}_opt" type="checkbox" id="group_${idx}_opt_2" value="${idx}" ${allow}>
                 <label class="form-check-input" for="group_${idx}_opt">${v.description}</label>
                `
            ele2.append(s)
        }
    }).catch(function(err) {
        console.log(err)
    })
}

function QueryGroupPolicy() {
    const n = $("#group_permission_selection").val()
    axios.get('/gm/query_group', {
        params: {group_id: n}, data: {}
    }).then(function (rsp) {
        console.log(rsp)
        let ele = $("#group_opt")
        ele.empty()
        for (const v of rsp.data.policy) {
            let s = ""
            const idx = v.permission_id
            allow = ""
            if (v.allowed == false) {
                allow = "disabled"
            }
            if (v.has == true) {
                s = `<input class="form-check-input" name="${idx}_opt" type="checkbox" id="group_${idx}_opt" value="${idx}" checked="checked" ${allow}>
                     <label class="form-check-input" for="group_${idx}_opt">${v.description}</label>
                    `
            } else {
                s = `<input class="form-check-input" name="${idx}_opt" type="checkbox" id="group_${idx}_opt" value="${idx}" ${allow}>
                     <label class="form-check-input" for="group_${idx}_opt">${v.description}</label>
                    `
            }
            ele.append(s)
        }
    }).catch(function (err) {
        alert(err.response)
        console.log(err)
    })
}

function DeleteGroupPermission() {
    let gid = $("#group_permission_selection").val()
    let u = $("#group_permission_selection").find("option:selected").text()

    Utils.confirmWithKey(`确定要删除< ${u} >组吗?`, function () {
        const sk = this.$content.find('#confirm_with_key_pwd').val()
        axios({
            method: "delete", url: "gm/delete_group",
            params: {group_id: gid, super_key: sk},
        }).then(function(rsp) {
            console.log(rsp)
            console.log(rsp.data)
            alert("成功")
            GetAllGroup()
        }).catch(function(err) {
            alert(err.response.data.error)
            console.log(err)
        })
    })
}

function SaveGroupPolicy() {
    let arr = $("#group_opt").serializeArray()
    if (arr.length < 1) {
        return
    }
    let gid = $("#group_permission_selection").val()
    vals = []
    for (const v of arr) {
       vals.push(parseInt(v.value))
    }
    Utils.confirm(`确定要修改吗?`, function () {
        axios({
            method: "post", url: "gm/modify_group_policy",
            data: vals, params: {group_id: gid}
        }).then(function(rsp) {
            console.log(rsp.data)
            alert("成功")
        }).catch(function(err) {
            alert(err.response.data.error)
            console.log(err)
        })
    })
}

function CreatePermissionGroup() {
    let arr = $("#group_opt_2").serializeArray()
    if (arr.length < 1) {
        return
    }
    vals = []
    for (const v of arr) {
        vals.push(parseInt(v.value))
    }
    let gname = $("#group_name").val()
    Utils.confirm(`确定添加吗?`, function () {
        axios({
            method: "post", url: "gm/create_group",
            data: vals, params: {group_name: gname}
        }).then(function(rsp) {
            console.log(rsp.data)
            alert("成功")
            GetAllGroup()
        }).catch(function(err) {
            alert(err.response.data)
            console.log(err)
        })
    })
}

function ChangeUserPermissionGroup() {
    let uname = $("#group_user_name").val()
    let gid = $("#group_user_selection").val()
    axios({
        method: "post", url: "gm/modify_user_group",
        params: {user_name: uname, group_id: gid}
    }).then(function(rsp) {
        console.log(rsp.data)
        alert("成功")
    }).catch(function(err) {
        alert(err.response.data.error)
        console.log(err)
    })
}

