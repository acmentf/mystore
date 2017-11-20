import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import { message } from 'antd';
import { List } from 'antd-mobile'
import _ from "lodash"
import qs from "qs"
import ContactItem from "@/components/contact/ContactItem"
import Organizes from "@/containers/organize/Organizes"
import utils from "@/utils"
import GroupActions from "@/redux/GroupRedux"
import ChatRoomActions from "@/redux/ChatRoomRedux"
import OrganizeActions from '@/redux/OrganizeRedux';
import getTabMessages from "@/selectors/ChatSelector"
import getCurrentContacts from "@/selectors/ContactSelector"
import { config } from "@/config"

class Contact extends React.Component {
    componentWillReceiveProps(nextProps) {
        if(nextProps.location.pathname === "/organize"){
            const { searchId } = qs.parse(nextProps.location.search);
            if( nextProps.location.search !== this.props.location.search ){
                nextProps.getOrganizes(searchId || "0", "id");
            }
        }
    }

    componentWillMount(){
        const { pathname, search } = this.props.location;
        const search_obj = qs.parse(this.props.location.search);
        if( pathname.indexOf('group') !== -1 && search.indexOf('ids') !== -1 && search.indexOf('members') !== -1 ){
            this.props.createGroups({
                data: {
                    groupname: search_obj.members,
                    desc: "群聊",
                    members: search_obj.ids.split(','),
                    public: true,
                    approval: false,
                    allowinvites: true
                },
                success: () => {
                    message.success(`群聊创建成功`);
                    this.props.getGroups();
                },
                error: () => {
                    message.error("创建群聊失败");
                    // message.error(`Group ${name} failed`)
                }
            });
        }

        this.props.getOrganizes(search_obj.searchId || "0", "id");
    }

    changeSearchId = (id) => {
        const { pathname, search } = this.props.location;
        const query = qs.parse(search.replace('?', ''));
        query.searchId = id;

        this.props.history.push(pathname + "?" + qs.stringify(query));
    }

    render(){
        const {
            history,
            match,
            common,
            location,
            contacts,
            group,
            chatroom,
            stranger,
            message,
            blacklist,
            organize,
            getGroups,
            getChatRooms,
            ...rest
        } = this.props;

        const { pathname } = location
        const paths = pathname.split("/")
        const chatType = paths[1]
        const chatId = paths[2]
        const chatTypes = {
            "contact": "chat",
            "group": "groupchat",
            "chatroom": "chatroom",
            "stranger": "stranger"
        };

        const items = [];

        // organize
        if( chatType !== 'organize' ){
            // contact
            organize.organizes.map(item => {
                item.positionUserList.map(element => {
                    const info = utils.getLatestMessage(_.get(message, [ chatTypes[chatType], element.id ], []));
                    const count = message.getIn([ "unread", "chat", element.id ], 0);

                    if( count !== 0 ){
                        const exist = items.findIndex(i => i.id === element.id);
                        if( exist === -1 ){
                            items.push({
                                unread: count,
                                ...element,
                                ...info
                            });
                        }
                    }
                });
            });

            // group
            if (!common.isGetGroupAlready) {
                getGroups()
            } else {
                _.forEach(_.get(group, "names", []), (v, index) => {
                    const [ name, id ] = v.split("_#-#_")
                    const info = utils.getLatestMessage(_.get(message, [ chatTypes[chatType], id ], []))
                    const count = message.getIn([ "unread", "groupchat", name ], 0)
                    items.push({
                        name,
                        id,
                        unread: count,
                        latestMessage: "",
                        latestTime: "",
                        ...info
                    });
                });
            }
        }
        
        return (
            <div>
                {
                    chatType === "contact" || chatType === "group" ?
                        <List>
                            <List.Item arrow="horizontal" onClick={() => rest.changeTab({key: "organize"})}>组织架构</List.Item>
                            <List.Item arrow="down">常用联系人</List.Item>
                        </List> : ''
                }
                {
                    chatType === 'organize' ?
                        <Organizes department={organize.sortDepartment} employee={organize.sortEmployee} changeSearchId={this.changeSearchId} {...rest} /> : ''
                }
                {
                    chatType !== 'organize' ?
                        <ContactItem {...rest} items={items} chatType={chatType === 'organize' ? 'group' : chatType} /> : ''
                }
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
            group: state.entities.group,
            organize: state.entities.organize,
            message: state.entities.message,
            blacklist: state.entities.blacklist,
        }),
        dispatch => ({
            doLogin: (username, password) => {},
            createGroups: options => dispatch(GroupActions.createGroups(options)),
            getGroups: () => dispatch(GroupActions.getGroups()),
            getChatRooms: () => dispatch(ChatRoomActions.getChatRooms()),
            getOrganizes: (value, type) => dispatch(OrganizeActions.getOrganizes(value, type))
        })
    )(Contact)
)
