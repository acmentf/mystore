import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import { SearchBar, List } from "antd-mobile"
import _ from "lodash"
import qs from "qs"
import ContactItem from "@/components/contact/ContactItem"
import utils from "@/utils"
import GroupActions from "@/redux/GroupRedux"
import ChatRoomActions from "@/redux/ChatRoomRedux"
import OrganizeActions from "@/redux/OrganizeRedux"
import getTabMessages from "@/selectors/ChatSelector"
import getCurrentContacts from "@/selectors/ContactSelector"
import { OrganizeTypes } from "../../redux/OrganizeRedux";
import { setTimeout } from "timers";

class Contact extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            searchValue: ''
        };
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.location.pathname.indexOf("organize") !== -1){
            const { searchId } = qs.parse(nextProps.location.search);
            if( nextProps.location.search !== this.props.location.search ){
                nextProps.getOrganizes(searchId || "0", "id");
            }
        }
    }

    componentDidMount(){
        const { pathname, search } = this.props.location;
        const search_obj = qs.parse(search);
        
        if( pathname.indexOf('group') !== -1 &&
                pathname.indexOf('_') == -1 &&
                search.indexOf('ids') !== -1 &&
                search.indexOf('members') !== -1 ){
                    setTimeout(() => {
                        this.props.createGroups({
                            data: {
                                groupname: search_obj.members,
                                desc: "群聊",
                                members: search_obj.ids.split(','),
                                public: false,
                                approval: false,
                                allowinvites: false
                            },
                            success: ({data}) => {
                                console.log(`群聊创建成功`);
                                this.props.getGroups();
                                this.props.onClick({
                                    key: data.groupid,
                                    keyPath: [data.groupid]
                                });
                            },
                            error: (error) => {
                                console.log("创建群聊失败", error || "error");
                            }
                        });
                    }, 500);
        }

        this.props.getOrganizes(search_obj.searchId || "0", "id");
    }

    searchChange = (value) => {
        this.setState({ searchValue: value });
    };

    searchOrganize = (value) => {
        const { history, location } = this.props;
        let pathname_list = location.pathname.split('/');
        pathname_list[1] = "organize";
        history.push(pathname_list.join("/") + location.search);

        this.props.sortOrganizeList({ value, type: "name" });
    }

    searchCancel = () => {
        this.setState({
            searchValue: ""
        }, () => {
            this.props.sortOrganizeList({ value: "0", type: "id" });
        });
    }

    redirectSearch = () => {
        const { location, history } = this.props;
        const redirectPath = '/organize' + location.search;
        history.push(redirectPath);
    }

    changeSearchId = (id) => {
        const { pathname, search } = this.props.location;
        const query = qs.parse(search.replace('?', ''));
        query.searchId = id;

        this.props.history.push(pathname + "?" + qs.stringify(query));
    }

    isGroupExist = (e) => {
        const { location, history, group } = this.props;
        if( location.pathname.indexOf('organize') !== -1 ){
            const isExist = (target) => {
                return group.names.findIndex(item => {
                    const [ name, id ] = item.split("_#-#_")
                    return name == target;
                });
            };
    
            const [ membername, memberid ] = e.key.split('_');
            const index = isExist(membername);
            if( index !== -1 ){
                const [groupname, groupid] = group.names[index].split("_#-#_");
                // 更改参数并触发点击
                this.props.onClick({
                    ...e,
                    key: groupid,
                    keyPath: [groupid]
                });
            } else {
                // 创建群组
                this.props.createGroups({
                    data: {
                        groupname: membername,
                        desc: '发起聊天',
                        members: [memberid],
                        public: true,
                        approval: false,
                        allowinvites: true
                    },
                    success: ({ data }) => {
                        this.props.getGroups();
                        this.props.onClick({
                            ...e,
                            key: data.groupid,
                            keyPath: [data.groupid]
                        });
                    },
                    error: (error) => {
                        console.log(error || "error");
                    }
                })
            }
        } else {
            this.props.onClick(e);
        }
    }

    render(){
        const { history, match, common, location, organize, contacts, group, chatroom, stranger, message, blacklist, getGroups, getChatRooms, ...rest } = this.props;
        const { pathname, search } = location
        const paths = pathname.split("/")
        const chatType = paths[1]
        const chatId = paths[2]

        const fromPC = () => { return qs.parse(search).fromPC };
        // const findGoupId = (members, groups) => {
        //     debugger
        //     const member_arr = members.split("、");
        //     const group_index = groups.findIndex(g => {
        //         const equal = true,
        //               member_clone = member_arr.concat([]),
        //               group_clone  = g.groupname.split("、").concat([]);

        //         if( group_clone.lenght > member_clone ) return false;
        //         group_clone.map(n => {
        //             const index = member_clone.findIndex(c => c == n)
        //             if( index ){
        //                 member_clone.slice(index, 1);
        //             }
        //         });

        //         return member_clone.length == 0 && equal;
        //     });

        //     console.log("find group", group_index && groups[group_index]);
        //     return group_index && groups[group_index];
        // }

        // console.log(history, match, location, pathname, chatType, chatId)

        const chatTypes = {
            "contact": "chat",
            "group": "groupchat",
            "chatroom": "chatroom",
            "stranger": "stranger"
        }

        const items = []
        switch (chatType) {
        case "organize":
            if (!common.isGetGroupAlready) {
                setTimeout(() => {
                    getGroups()
                }, 0);
            }
            
            organize.sortEmployee.map(item => {
                items.push(item);
            });
            break;
        case "contact":
            const { byId, chat } = message
            _.forEach(_.get(contacts, "friends", []), (name, index) => {
                if (_.includes(blacklist.names, name)) return
                const info = utils.getLatestMessage(_.get(message, [ chatTypes[chatType], name ], []))
                const count = message.getIn([ "unread", "chat", name ], 0)
                items[index] = {
                    name,
                    unread: count,
                    ...info
                }
            })
            break
        case "group":
            if (!common.isGetGroupAlready) {
                setTimeout(() => {
                    getGroups();
                    // getGroups(function(res){
                    //     if( pathname.indexOf('group') !== -1 &&
                    //         pathname.indexOf('_') == -1 &&
                    //         search.indexOf('ids') !== -1 &&
                    //         search.indexOf('members') !== -1 ){
                    //             // debugger
                    //             // const groupid = findGoupId(qs.parse(search).members, res);
                    //             // if( groupid ){
                    //             //     this.props.onClick({
                    //             //         key: groupid,
                    //             //         keyPath: [groupid]
                    //             //     });
                    //             // } else {
                    //             //     this.props.createGroups({
                    //             //         data: {
                    //             //             groupname: search_obj.members,
                    //             //             desc: "群聊",
                    //             //             members: search_obj.ids.split(','),
                    //             //             public: false,
                    //             //             approval: false,
                    //             //             allowinvites: false
                    //             //         },
                    //             //         success: ({data}) => {
                    //             //             console.log(`群聊创建成功`);
                    //             //             this.props.getGroups();
                    //             //             this.props.onClick({
                    //             //                 key: data.groupid,
                    //             //                 keyPath: [data.groupid]
                    //             //             });
                    //             //         },
                    //             //         error: (error) => {
                    //             //             console.log("创建群聊失败", error || "error");
                    //             //         }
                    //             //     });
                    //             // }
                    //     }
                    // });
                }, 500);
            } else {
                _.forEach(_.get(contacts, "names", []), (v, index) => {
                    const [ name, id ] = v.split("_#-#_")
                    const info = utils.getLatestMessage(_.get(message, [ chatTypes[chatType], id ], []))
                    const count = message.getIn([ "unread", "groupchat", name ], 0)
                    items[index] = {
                        name,
                        id,
                        unread: count,
                        latestMessage: "",
                        latestTime: "",
                        ...info
                    }
                })
            }
            break
        case "chatroom":
            if (!common.isGetChatRoomAlready) {
                setTimeout(() => {
                    getChatRooms()
                }, 0);
            } else {
                _.forEach(_.get(contacts, "names", []), (v, index) => {
                    const [ name, id ] = v.split("_#-#_")
                    const info = utils.getLatestMessage(_.get(message, [ chatTypes[chatType], id ], []))
                    const count = message.getIn([ "unread", "chatroom", name ], 0)
                    items[index] = {
                        name,
                        id,
                        unread: count,
                        latestMessage: "",
                        latestTime: "",
                        ...info
                    }
                })
            }
            break
        case "stranger":
            _.forEach(_.get(contacts, "byId", []), (v, name) => {
                const info = utils.getLatestMessage(_.get(message, [ chatTypes[chatType], name ], []))
                const count = message.getIn([ "unread", "stranger", name ], 0)
                items.push({
                    name,
                    unread: count,
                    latestMessage: "",
                    latestTime: "",
                    ...info
                })
            })
            break
        default:
            break
        }
        // console.log(chatType, chatId, items)

        const HeaderList = () => {
            if( chatType == 'organize' ){
                return (
                    <List>
                        { organize.sortDepartment.map((item, index) => {
                            return (
                                <List.Item
                                    key={'organizes_' + item.id}
                                    arrow="horizontal"
                                    onClick={() => this.changeSearchId(item.id)}
                                >{item.name}</List.Item>
                            );
                        }) }
                    </List>
                );
            } else {
                return (
                    <List>
                        { !fromPC() && <List.Item arrow="horizontal" onClick={() => this.redirectSearch()}>组织架构</List.Item> }
                        <List.Item>常用联系人</List.Item>
                    </List>
                );
            }
        }

        return (
            <div>
                { !fromPC() &&
                    <SearchBar
                        value={this.state.searchValue}
                        placeholder="搜索"
                        maxLength={8}
                        onChange={this.searchChange}
                        onSubmit={this.searchOrganize}
                        onCancel={this.searchCancel} /> }
                { HeaderList() }
                <ContactItem {...rest} items={items} chatType={chatType} isGroupExist={this.isGroupExist} />
            </div>
        )
    }
}

Contact.propTypes = {
    collapse: PropTypes.bool
    // menuOptions: PropTypes.array.isRequired,
}

export default withRouter(
    connect(
        (state, props) => ({
            common: state.common,
            contacts: getCurrentContacts(state, props.match.params),
            organize: state.entities.organize,
            group: state.entities.group,
            message: state.entities.message,
            blacklist: state.entities.blacklist,
        }),
        dispatch => ({
            doLogin: (username, password) => {
            },
            getGroups: (cb) => dispatch(GroupActions.getGroups(cb)),
            createGroups: options => dispatch(GroupActions.createGroups(options)),
            getChatRooms: () => dispatch(ChatRoomActions.getChatRooms()),
            getOrganizes: (value, type) => dispatch(OrganizeActions.getOrganizes(value, type)),
            sortOrganizeList: (params) => dispatch(OrganizeActions.sortOrganizeList(params))
        })
    )(Contact)
)
