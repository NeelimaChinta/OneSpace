import { GET_ERRORS} from "../actions/types"

const initalState = {}

export default function (state = initalState, action) {
    switch(action.type) {
        case GET_ERRORS:
            return action.payload
        default:
            return state
    }
}