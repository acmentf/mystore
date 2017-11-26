import { createSelector } from "reselect"
import _ from "lodash"

// const currentContacts = (state, { selectTab, selectItem }) => {
//     const contactType = selectTab === "contact" ? "roster" : selectTab
//     return _.get(state, [ "entities", contactType ], [])
// }

const currentContacts = (state, { selectTab, selectItem }) => {
    // const contactType = selectTab === "contact" ? "roster" : selectTab
    const roster = _.get(state, [ "entities", "roster" ], [])
    const group = _.get(state, [ "entities", "group" ], [])
    return {
        ...roster,
        ...group
    }
}

const getCurrentContacts = createSelector(
    [ currentContacts ],
    (contacts) => contacts
)

export default getCurrentContacts
