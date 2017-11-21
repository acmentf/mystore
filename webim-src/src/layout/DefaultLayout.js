import React, { Component } from "react"
import ReactDOM from "react-dom"
import Layout from "./Layout"
import { connect } from "react-redux"
import { I18n } from "react-redux-i18n"
import { withRouter, Route } from "react-router-dom"
import { NavBar, Icon, SearchBar } from 'antd-mobile';
import _ from "lodash"
import qs from 'qs';
import classNames from "classnames"
//import ContactItem from "@/components/contact/ContactItem"
import ChatRoomActions from "@/redux/ChatRoomRedux"
import Contact from "@/containers/contact/Contact"
import Chat from "@/containers/chat/Chat"
import HeaderTab from "@/components/header/HeaderTab"
import HeaderOps from "@/components/header/HeaderOps"
import GroupActions from "@/redux/GroupRedux"
import GroupMemberActions from "@/redux/GroupMemberRedux"
import MessageActions from "@/redux/MessageRedux"
import OrganizeActions from "@/redux/OrganizeRedux"
import { config } from "@/config"

const { SIDER_COL_BREAK, SIDER_COL_WIDTH, SIDER_WIDTH, RIGHT_SIDER_WIDTH } = config
const { Header, Content, Footer, Sider, RightSider, OrganzeSider } = Layout

let chat_message_status = {};

class DefaultLayout extends Component {
    constructor({ breakpoint, match }) {
        super()
        let { selectTab, selectItem = "" } = match.params

        if( selectTab === 'organize' ){
            selectTab = 'contact';
        }
        // console.log(selectTab, selectItem, "-----")

        this.state = {
            collapsed: breakpoint[SIDER_COL_BREAK],
            selectTab: selectTab,
            selectItem: selectItem,
            headerTabs: [
                {
                    key: "contact",
                    name: `${I18n.t("friends")}`,
                    icon: "fontello icon-comment"
                },
                {
                    key: "group",
                    name: `${I18n.t("groups")}`,
                    icon: "fontello icon-chat"
                },
                {
                    key: "chatroom",
                    name: `${I18n.t("chatrooms")}`,
                    icon: "fontello icon-users-1"
                },
                {
                    key: "stranger",
                    name: `${I18n.t("strangers")}`,
                    icon: "fontello icon-address-book-1"
                }
            ],
            rightSiderOffset: -1 * RIGHT_SIDER_WIDTH,
            roomId: NaN,
            room: {},
            contactItems: [],
            searchValue: ""
        }

        this.changeItem = this.changeItem.bind(this)
        this.changeTab = this.changeTab.bind(this)
        this.handleCloseRightSiderClick = this.handleCloseRightSiderClick.bind(this)

        // throw new Error("1")
        // throw new Error("crap")
        // this.props.c = 1
        // console.log(messageList, "---")
    }

    toggle = collapsed => {
        // console.log("collapsed", collapsed)
        this.setState({
            collapsed
        })
    }

    // switch chat type
    changeTab(e) {
        const { history, location } = this.props
        const { selectItem, selectTab } = this.state
        const redirectPath = "/" + [ e.key ].join("/")
        if (selectTab == e.key) return

        // quite previous chatroom
        if (selectItem) this.props.quitChatRoom(selectItem)

        this.props.switchRightSider({ rightSiderOffset: 0 })
        history.push(redirectPath + location.search);
    }

    // switch contact
    changeItem(e) {
        console.log("changeItem", e)
        const { history, location, group } = this.props;
        let { selectItem, selectTab } = this.state;
        const redirectPath = "/" + [ selectTab === "group" ? "group" : "organize", e.key ].join("/");
        const typeMap = {
            contact: "chat",
            group: "groupchat",
            chatroom: "chatroom",
            stranger: "stranger"
        }

        if( selectTab === 'organize' ){
            selectTab = 'contact';
            selectItem = selectItem.split('_').reverse()[0];
        }

        const key = e.key.split("_").reverse()[0];

        // chatroom will push recent messages automatically
        if (!chat_message_status[key] && typeMap[selectTab] !== "chatroom") {
            this.props.fetchMessage(key, typeMap[selectTab])
            chat_message_status[key] = true
        }

        this.props.clearUnread(typeMap[selectTab], key)

        if (selectItem == e.key) {
            return
        }

        if (selectTab === "group") {
            const groupId = key
            if (groupId) {
                this.setState({ roomId: groupId })
                const room = _.get(group, `byId.${groupId}`, {})
                this.setState({ room })
                // const { selectItem, selectTab } = _.get(this.props, [ "match", "params" ], {})
                // if (selectItem && selectTab === "group") {
                // const groupId = selectItem
                this.props.listGroupMemberAsync({ groupId })
                this.props.getMutedAsync(groupId)
                this.props.getGroupAdminAsync(groupId)
                // }

            }
        }

        if (selectTab == "chatroom") {
            // moved to changeTab
            //quit previous chatroom
            // if (selectItem) {
            //     this.props.quitChatRoom(selectItem)
            // }
            // join chatroom
            this.props.joinChatRoom(key)
        }

        history.push(redirectPath + location.search)
    }

    setSelectStatus() {
        const { history, location, match } = this.props
        // console.log(location.patchname, match)
        let { selectTab, selectItem = "" } = match.params
        
        if( selectTab === 'organize' ){
            selectTab = 'contact';
        }
        // console.log(match)
        this.setState({
            selectTab,
            selectItem
        })
    }

    handleCloseRightSiderClick(e) {
        e.preventDefault()
        console.log(e.target)
        this.props.switchRightSider({ rightSiderOffset: 0 })
    }

    componentDidMount() {
        // this.setSelectStatus()
    }


    componentWillReceiveProps(nextProps) {
        // console.log("componentWillReceiveProps", this.props.location.pathname, nextProps.location.pathname)
        const { breakpoint, location } = this.props
        const nextBeakpoint = nextProps.breakpoint

        // if (breakpoint[SIDER_COL_BREAK] != nextBeakpoint[SIDER_COL_BREAK]) {
        // console.log(breakpoint, "---1")

        this.toggle(nextBeakpoint[SIDER_COL_BREAK])
        // }

        if (location.pathname != nextProps.location.pathname) {
            this.props = nextProps
            // console.log("componentWillReceiveProps", location)
            this.setSelectStatus()
        }
    }

    searchChange = (value) => {
        this.setState({ searchValue: value });
    };

    searchEmployee = (value) => {
        const { history, location } = this.props;
        if( location.indexOf("group") == -1 ) {
            let pathname_list = location.pathname.split('/');
            pathname_list[1] = "organize";
            history.push(pathname_list.join("/") + location.search);
    
            this.props.sortOrganizeList({ value, type: "name" });
        }
    }

    searchCancel = () => {
        this.setState({
            searchValue: ""
        }, () => {
            this.props.sortOrganizeList({ value: "0", type: "id" });
        });
    }

    goBack(){
        const { history } = this.props;
        history.goBack();
    }

    render() {
        const { collapsed, selectTab, selectItem, headerTabs, roomId, showOrganize } = this.state;
        const { login, rightSiderOffset, organizeOffset, location } = this.props;

        const NavTitle = location.pathname.indexOf("organize") !== -1 ? "组织架构" : "通讯录";
        const mainStyle = location.pathname.indexOf("group") !== -1 ? { top: 45 } : {};

        return (
            <Layout>
                <Header className="header">
                    <NavBar
                        mode="light"
                        icon={<Icon type="left" />}
                        onLeftClick={() => this.goBack()}
                    >{NavTitle}</NavBar>
                    { location.pathname.indexOf("group") == -1 &&
                        <SearchBar
                            value={this.state.searchValue}
                            placeholder="搜索"
                            maxLength={8}
                            onChange={this.searchChange}
                            onSubmit={this.searchEmployee}
                            onCancel={this.searchCancel} /> }
                </Header>
                <Content className="x-layout-main" style={mainStyle}>
                    <div
                        className="x-layout-sider"
                        style={{
                            // sider full display when breakpoint
                            width: collapsed ? "100%" : SIDER_WIDTH,
                            // sider display to left when breakpoint and has selectItem
                            left: selectItem && collapsed ? "-100%" : 0
                        }}
                    >
                        <Contact
                            collapsed={false}
                            onClick={this.changeItem}
                            changeTab={this.changeTab}
                            selectedKeys={[ selectItem ]} />
                    </div>
                    <Content
                        className="x-layout-chat"
                        style={{
                            overflowY: "scroll",
                            margin: collapsed ? "0" : `0 0 0 ${SIDER_WIDTH}px`
                        }}
                    >
                        <Route
                            path="/:selectTab/:selectItem"
                            render={props => <Chat collapsed={collapsed} {...props} />}
                        />
                    </Content>
                    <div
                        className={classNames("x-layout-right-sider", { "hide": rightSiderOffset === 0 })}
                        style={{
                            width: `${RIGHT_SIDER_WIDTH}px`,
                            marginLeft: `${rightSiderOffset}px`
                        }}
                    >
                        <RightSider roomId={roomId} room={this.state.room} ref="rightSider"/>
                    </div>
                    {/*<Footer style={{ textAlign: "center" }}>
                     Ant Design ©2016 Created by Ant UED
                     </Footer>*/}
                </Content>
            </Layout>

        )
    }
}

export default withRouter(
    connect(
        ({ breakpoint, entities, login, common }) => ({
            breakpoint,
            group: entities.group,
            login,
            common,
            organizeOffset: entities.organize.organizeOffset,
            rightSiderOffset: entities.group.rightSiderOffset,
        }),
        dispatch => ({
            getGroupMember: id => dispatch(GroupMemberActions.getGroupMember(id)),
            listGroupMemberAsync: opt => dispatch(GroupMemberActions.listGroupMemberAsync(opt)),
            switchRightSider: ({ rightSiderOffset }) => dispatch(GroupActions.switchRightSider({ rightSiderOffset })),
            joinChatRoom: roomId => dispatch(ChatRoomActions.joinChatRoom(roomId)),
            quitChatRoom: roomId => dispatch(ChatRoomActions.quitChatRoom(roomId)),
            clearUnread: (chatType, id) => dispatch(MessageActions.clearUnread(chatType, id)),
            getGroups: () => dispatch(GroupActions.getGroups()),
            getChatRooms: () => dispatch(ChatRoomActions.getChatRooms()),
            getMutedAsync: groupId => dispatch(GroupMemberActions.getMutedAsync(groupId)),
            getGroupAdminAsync: groupId => dispatch(GroupMemberActions.getGroupAdminAsync(groupId)),
            fetchMessage: (id, chatType, offset) => dispatch(MessageActions.fetchMessage(id, chatType, offset)),
            sortOrganizeList: (params) => dispatch(OrganizeActions.sortOrganizeList(params))
        })
    )(DefaultLayout)
)
