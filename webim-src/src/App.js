import React, { Component } from "react"
import { connect } from "react-redux"
import {
    // BrowserRouter as Router,
    // HashRouter as Router,
    Route,
    Switch,
    Fade,
    Redirect,
    withRouter
} from "react-router-dom"
import Layout from "@/layout/DefaultLayout"
import Login from "@/containers/loginregister/Login"
import Chat from "@/containers/chat/Chat"
import ChinaMobile from "@/containers/chinamobile/Chinamobile"
import Register from "@/containers/loginregister/Register"
import LoginActions from "@/redux/LoginRedux"
import Loading from "@/components/common/LoadingComponent"
import { store } from "@/redux"
import utils from "@/utils"

const debug = false

// const AuthorizedComponent = ({ token, Layout, ...rest }) => {
//     console.log("auth", token)
//     if (!token && !debug) {
//         return <Redirect to="/login" />
//     }

//     return <Layout {...rest} />

//     // return (
//     //     <Switch>
//     //         <Route path="/:selectTab/:selectItem" render={props => <Layout {...rest} />} />
//     //         <Route path="/:selectTab" render={props => <Layout {...rest} />} />
//     //     </Switch>
//     // )
// }

class AuthorizedComponent extends Component {
    render() {
        const { token, ...rest } = this.props;

        if( !token ){
            return <Loading show={true} />;
        }

        return (
            <Switch>
                <Route path="/:selectTab/:selectItem" render={props => <Layout {...rest} />} />
                <Route path="/:selectTab" render={props => <Layout {...rest} />} />
            </Switch>
        )
    }
}

class App extends Component {
    constructor() {
        super()

        this.state = {
            hasToken: utils.hasToken() && utils.getUserName()
        }
    }

    componentDidMount() {
        // 1. check user auth by cookie
        const { hasToken, isLogin, login, loginByToken } = this.props;
        
        // if (hasToken && !debug) {
        //     return loginByToken(utils.getUserName(), utils.getToken())
        // }

        if( !isLogin ) {
            return login(utils.getUserName(), utils.getUserName());
        }
    }

    render() {
        const { isLogin, token, isLoading, loginByToken } = this.props
        const { hasToken } = this.state
        console.log("App render:", isLogin, token, isLoading, hasToken)
        if (!isLogin && hasToken && !debug) return <Loading show={true} />

        // const authorizedComponent = <AuthorizedComponent {...this.props} token={token} Layout={Layout} />
        // const authorizedComponent = <Layout {...this.props} token={token} />

        return (
            <div>
                <Loading show={isLoading} />
                <Switch>
                    {/* <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} /> */}
                    {/* 素质编程 best编程 */}
                    {/* <Route path="/cnm" component={ChinaMobile} /> */}
                    {/* <Route path="/" children={authorizedComponent} /> */}
                    {/* <Route path="/" component={AuthorizedComponent} /> */}
                    <Route path="/" render={props => <AuthorizedComponent {...this.props} token={token} />} />
                </Switch>
            </div>
        )
    }
}

export default withRouter(
    connect(
        ({ breakpoint, login, common }) => ({
            breakpoint,
            token: login.token,
            isLogin: login.isLogin,
            isLoading: common.fetching
        }),
        dispatch => ({
            login: (username, password) => dispatch(LoginActions.login(username, password)),
            loginByToken: (username, token) => dispatch(LoginActions.loginByToken(username, token))
        })
    )(App)
)
