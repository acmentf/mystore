import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'antd-mobile';
import ContactItem from "@/components/contact/ContactItem"

class Organizes extends Component {
    render() {
        const { department, employee, changeSearchId, ...rest } = this.props;
        return (
            <div>
                <List>
                    {
                        department.map((item, index) => {
                            return (
                                <List.Item
                                    key={'organizes_department_' + item.id}
                                    arrow="horizontal"
                                    onClick={() => changeSearchId(item.id)}
                                >{item.name}</List.Item>
                            );
                        })
                    }
                </List>
                <ContactItem {...rest} items={employee} chatType={'organize'} />
            </div>
        );
    }
}

export default Organizes;