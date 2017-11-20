import { createSelector } from "reselect"
import _ from "lodash"

const chatType = {
    contact: "chat",
    group: "groupchat",
    chatroom: "chatroom",
    stranger: "stranger"
}

const getTabMessageArray = (state, props) => {
    let { selectTab, selectItem } = props.match.params;
    
    if( selectTab === 'organize' ){
        selectTab = 'contact';
        selectItem = selectItem.split('_').reverse()[0];
    }
    
    return _.get(state, [ "entities", "message", chatType[selectTab], selectItem ])
}


const getTabMessages = createSelector(
    [ getTabMessageArray ],
    (TabMessageArray) => {
        console.log("getTabMessages", TabMessageArray)
        return TabMessageArray
    }
)

export default getTabMessages