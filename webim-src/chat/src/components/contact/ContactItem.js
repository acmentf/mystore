import React from "react"
import PropTypes from "prop-types"
import { Menu, Icon, Badge } from "antd"
import ContactHead from "./ContactHead"
import { getOrganizeUserName } from "@/utils/utils"

const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

const ContactItem = ({ chatType, items, collapse, hasLogo, ...rest }) => {
    const tabs = items //["Contacts", "Chat", "Public"]
    const tabsLen = tabs.length
    const tabCls = collapse ? "" : ""

    const renderName = function (name, type) {
        if (type == "group") return name
        
        let userName = getOrganizeUserName(rest.organize, name)

        return userName.length > 8 ? userName.substr(0, 8) + "..." : userName
    }

    const tabsItem = tabs.map(item =>
        <Menu.Item key={item.chatType == "chatroom" || item.chatType == "group" ? item.id : item.name} className={tabCls}>
            <ContactHead className="fl nav-img" name={renderName(item.name, item.chatType)} imgUrl={item.headImg} width={50} />
            <div style={{ "overflow": "hidden" }} onClick={() => {rest.changeItem(item)}}>
                <div className="nav-text">
                    <div>
                        {renderName(item.name, item.chatType)}

                        {/*
                            <Badge
                            count={109}
                            style={{
                                backgroundColor: "#87d068",
                                marginLeft: 10,
                                verticalAlign: "middle"
                            }}
                        />
                        */}
                        {/* {chatType === "group" ? <Badge count={item.unread} style={{ marginLeft: 10 }} /> : ""} */}
                        <Badge count={item.unread} style={{ marginLeft: 10 }} />
                    </div>
                    <div className="nav-text-desc">
                        {chatType === "organize" ? item.position : item.latestMessage}
                    </div>
                </div>
                <div className="nav-op">
                    {item.latestTime}
                </div>
            </div>
        </Menu.Item>
    )

    return (
        <Menu id="x-contact-item" mode={"inline"} inlineIndent={24} {...rest} inlineCollapsed={false}>
            {tabsItem}
        </Menu>
    )
}

ContactItem.propTypes = {
    collapse: PropTypes.bool
    // menuOptions: PropTypes.array.isRequired,
}

export default ContactItem
