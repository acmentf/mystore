import { createReducer, createActions } from "reduxsauce";
import Immutable from "seamless-immutable";
import _ from "lodash";
import { store } from "@/redux";
import CommonActions from "@/redux/CommonRedux"
import { setTimeout } from "timers";
import request, { basicUrl } from '@/services/request';
import { message } from 'antd';

const { Types, Creators } = createActions({
    sortOrganizeList: ["params"],
    setOrganizes: ['organizes'],
    getOrganizes: (value, type) => {
        return (dispatch, getState) => {
            dispatch(CommonActions.fetching());
            const params = {
                tokenId: localStorage.getItem('signaturePwd'),
                data: {}
            };
            request(basicUrl + 'user/getAllPositionUser', params)
                .then(response => {
                    dispatch(CommonActions.fetched());
                    if(response && response.data){
                        dispatch(Creators.setOrganizes(response.data));
                        dispatch(Creators.sortOrganizeList({value, type}));
                    } else {
                        console.log("组织架构请求失败", response.msg || '系统异常');
                    }
                });
        }
    }
});

// types
export const OrganizeTypes = Types;

// actions
export default Creators;

// init state
const INITIAL_STATE = Immutable({
    organizes: [],
    sortDepartment: [],
    sortEmployee: []
});

// reducers
export const updateSearchId = (state = INITIAL_STATE, { id }) => {
  return Immutable.merge(state, { searchId: id });
}

export const setOrganizes = (state = INITIAL_STATE, { organizes }) => {
    return Immutable.merge(state, { organizes });
}

export const sortOrganizeList = (state = INITIAL_STATE, { params }) => {
  let department = [],
      employee = [];

  const { value, type } = params;

  if( type == "id" ){
    const finded = state.organizes.find(item => {
      return item.id == value;
    });

    if( finded ){
      employee = finded.positionUserList
    }

    department = state.organizes.filter(item => {
        return item.parentId == value;
    });
  } else if( type == "name" ){
    state.organizes.map(item => {
      item.positionUserList.map(v => {
        if( v.name.indexOf(value) !== -1 ) {
          const exist = employee.findIndex(element => element.id === v.id );
          if( exist === -1 ){
            employee.push(v);
          }
        }
      });
    });
  }
  
  console.log(department, employee);
  return Immutable.merge(state, {
    sortDepartment: department,
    sortEmployee: employee
  });
}

// reducers to types
export const reducer = createReducer(INITIAL_STATE, {
  [Types.SORT_ORGANIZE_LIST]: sortOrganizeList,
  [Types.SET_ORGANIZES]: setOrganizes
})