import React from "react";
import {API} from "./API/APIService";
import {TemperatureGraph} from "./TemperatureGraph";

interface Props {
    services: API.Services
}

interface State {

}

export class Dashboard extends React.Component<Props, State> {
    render() {
        return <div>
            <TemperatureGraph services={this.props.services}/>
        </div>
    }
}
