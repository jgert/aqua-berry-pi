import React from "react";
import {HashRouter, Route, Switch} from "react-router-dom";
import {Configuration} from "./Configuration";
import {API} from "./API/APIService";
import {MockedAPI} from "./API/Mocked";
import {Dashboard} from "./Dashboard";
import {Nav, Navbar} from "react-bootstrap";
import {RemoteAPI} from "./API/Remote";

interface Props {

}

interface State {

}

enum Routes {
    default = "/",
    dashboard = "/",
    configuration = "/configuration"
}

class App extends React.Component {
    services: API.Services

    constructor(props: any) {
        super(props);
        if (CONFIG.useMockedBackend) {
            this.services = new MockedAPI.MockedServices()
        } else {
            this.services = new RemoteAPI.RemoteService()
        }
    }

    render() {
        return (
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand>Aqua-Berry-PI</Navbar.Brand>
                    <Nav>
                        <Nav.Link href={"#" + Routes.dashboard}>Dashboard</Nav.Link>
                        <Nav.Link href={"#" + Routes.configuration}>Configuration</Nav.Link>
                    </Nav>
                </Navbar>
                <br/>
                <HashRouter>
                    <Switch>
                        <Route exact path={Routes.dashboard}><Dashboard services={this.services}/></Route>
                        <Route exact path={Routes.configuration}><Configuration services={this.services}/></Route>
                        <Route path={Routes.default}>Hello</Route>
                    </Switch>
                </HashRouter>
            </div>
        )
    }
}

export default App;
