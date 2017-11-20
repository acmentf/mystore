import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route } from "react-router-dom";
import { Spin } from 'antd';
import { WhiteSpace, NavBar, Icon, SearchBar, List, Accordion,  } from 'antd-mobile';
import qs from 'qs';
// redux
import OrganizeActions from "@/redux/OrganizeRedux";
import ContactItem from "@/components/contact/ContactItem";


const { Item } = List,
      { Brief } = Item;

class OrganzeSider extends Component {
    componentWillMount(){
        const { search } = this.props.location;
        this.props.getOrganizes(qs.parse(search).searchId || "0");
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.location.search !== this.props.location.search){
            const searchId = qs.parse(nextProps.location.search).searchId || "0";
            nextProps.sortOrganizeList(searchId);
        }
    }
    
    changeSearchId = (id) => {
        const { pathname, search } = this.props.location;
        const query = qs.parse(search.replace('?', ''));
        query.searchId = id;

        this.props.history.push(pathname + "?" + qs.stringify(query));
    }

    renderAccordionNodes = (data) => {
        const nodes = data.map((item) => {
            return (
                <Accordion.Panel key={'accordion_' + item.id} header={item.label}>
                    {this.renderAccordionNodes(item.children)}
                </Accordion.Panel>
            );
        });

        return <Accordion>{nodes}</Accordion>
    }

    renderDepartment = () => {
        return this.props.organize.sortDepartment.map((item, index) => {
            return (
                <List.Item
                    key={'organizes_' + item.id}
                    arrow="horizontal"
                    onClick={() => this.changeSearchId(item.id)}
                >{item.name}</List.Item>
            );
        });
    }

    renderEmployee = () => {
        return this.props.organize.sortEmployee.map((item, index) => {
            return (
                <List.Item
                    key={'organizes_' + item.id}
                    arrow="horizontal"
                    onClick={() => this.changeSearchId(item.id)}
                >{item.name}</List.Item>
            );
        });
    }

    render() {
        const { organize, common } = this.props;
        return (
            <div style={{height: '100%'}}>
                <div>
                    <NavBar
                        mode="light"
                        icon={<Icon type="left" />}
                        onLeftClick={() => console.log('onLeftClick')}
                        rightContent={[
                            <i key="message" className="icon-message" />
                        ]}
                    >组织架构</NavBar>
                    <SearchBar placeholder="搜索" maxLength={8} />
                </div>
                {/* {this.renderAccordionNodes(organize.organizes || [])} */}
                <List>{ this.renderDepartment() }</List>
                {/* <List>{ this.renderEmployee() }</List> */}
                <ContactItem items={organize.sortEmployee} chatType="organize" />
            </div>
        );
    }
}

function mapStateToProps({ entities, common }) {
    return {
        common,
        organize: entities.organize
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getOrganizes: id => dispatch(OrganizeActions.getOrganizes(id)),
        sortOrganizeList: id => dispatch(OrganizeActions.sortOrganizeList(id))
    }
}

export default withRouter(
    connect(
        mapStateToProps, mapDispatchToProps
    )(OrganzeSider)
);