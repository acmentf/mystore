<template>
    <aside id="offCanvasSide" class="mui-off-canvas-left public-switch-role-position">
        <!--侧滑菜单部分-->
        <div id="offCanvasSideScroll" class="mui-scroll-wrapper">
            <div class="mui-scroll">
                <div class="offCanvasSide-header">
                    <img :src="logoImg" alt="" class="offCanvasSide-header-avatar">
                    <p class="offCanvasSide-header-name">{{username}}</p>
                </div>

                <form class="offCanvasSide-role-wrap mui-input-group">
                    <div class="mui-input-row mui-radio mui-left" v-for="item in rolePositionList">
                        <label>{{item.name}}</label>
                        <input type="radio" v-bind:value="item.id" v-model="rolePositionId">
                    </div>
                </form>

                <div class="offCanvasSide-logout">
                    <button type="button" id="logout" class="mui-btn mui-btn-block">退出登录</button>
                </div>

                <p class="version">v{{wgtVer}}</p>
            </div>
        </div>
    </aside>
</template>
<script>
    export default {
        name: 'switchRolePosition',
        data () {
            return {
                logoImg: '../../assets/css/images/logo_login.png',
                username: '',
                rolePositionList: [],
                rolePositionId: '',
                //当前用户角色id
                currentRoleId: '',
                //版本号
                wgtVer: ''
            }
        },
        watch: {
            rolePositionId (val, oldVal) {
                if (oldVal !== '') {
                    this.switchRole(val)
                }
            }
        },
        methods: {
            init () {
                if (window.Role.currentPositions.length > 0) {
                    this.currentRoleId = window.Role.currentPositions[0].roleId;
                    console.log("当前用户的角色id" + this.currentRoleId)
                }
                this.rolePositionId = window.Role.userroleId // 岗位id
                this.username = window.Role.username // 用户昵称
                this.rolePositionList = window.Role.positions // 岗位列表
                console.log(JSON.stringify(this.rolePositionList))
                this.setVersion()
            },
            setVersion () {
                try {
                    GLOBAL_SHOOT.setVersion(this)
                } catch (error) {
                    console.log(error);
                }
            },
            openWindow () {
                if(window.Role.currentPositions.length>0){
                    this.currentRoleId = window.Role.currentPositions[0].roleId;
                    console.log("当前用户的角色id"+this.currentRoleId)
                }

                let roleId = window.Role.currentPositions[0].roleId;
                let windowParams = GLOBAL_SHOOT.getPageUrlWithPosition(roleId, 1);
                if(windowParams) {
                    this.$emit('before-switch-page')
                    GLOBAL_SHOOT.switchPositionOpenWindow(windowParams.windowId,windowParams.pageUrl,{},{})
                } else {
                    this.$emit('after-switch-role')
                    GLOBAL_SHOOT.switchPositionOpenWindow('order','../order/orderlist.html',{},{},lf.window.currentWebview())
                }
            },
            switchRole (roleId) {
                let params = {
                    positionId: roleId
                };
                lf.nativeUI.showWaiting();
                lf.net.getJSON('user/switchPosition', params, res => {
                    lf.nativeUI.closeWaiting();
                    if(res.code === '200') {
                        let data = res.data
                        window.Role.save({
                            usercode: data.id,
                            username: data.name,
                            phone: data.phone,
                            companyId: data.companyId,
                            userrole: data.positions[0].type,
                            userroleName: data.positions[0].name,
                            userroleId: data.positions[0].id,
                            tonken: data.token,
                            loginsign: '1',
                            auths: data.auths,
                            positions: data.userPositionList,
                            currentPositions: data.positions,
                            photograherId: data.photograherId
                        })
                        lf.nativeUI.toast('切换岗位成功');
                       this.openWindow()
                    } else {
                        lf.nativeUI.closeWaiting();
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(res) {
                    lf.nativeUI.closeWaiting();
                    lf.nativeUI.toast(res.msg);
                })
            },
            initMui () {
                this.init()
                mui('#offCanvasSideScroll').offCanvas();
                 // 退出登录
                mui('body').on('tap', '#logout', function() {
                    lf.nativeUI.confirm("操作提示", "确定要退出当前用户吗?", ["确定", "取消"], function(e) {
                        if (e.index == 0) {
                            window.Role.logout();
                            GLOBAL_SHOOT.restart();
                        }
                    });
                })
            }
        },
        created () {
            lf.ready(() => {
                this.initMui()
            })
        }
    }
</script>
<style lang="scss">
    .public-switch-role-position{
        .version {
            text-align: center
        }
    }
</style>