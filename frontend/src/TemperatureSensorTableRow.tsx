import React from "react";
import {API} from "./API/APIService";

interface Props {
    service: API.TemperatureSensorServices
    temperatureSensor: API.TemperatureSensor
    onSelect: (sensor: API.TemperatureSensor) => void
    abortController: AbortController
}

interface State {
    temperature: number
}

export class TemperatureSensorTableRow extends React.Component<Props, State> {

    timer: number | null = null
    mounted: boolean = false

    constructor(props:Props) {
        super(props);
        this.state = {
            temperature: 0
        }
    }

    readTemperature() {
        this.props.service.temperature(this.props.abortController, this.props.temperatureSensor)
            .then((value) => {
                if (this.mounted) {
                    this.setState({
                        temperature: value.value
                    })
                }
            })
    }

    componentDidMount() {
        this.timer = window.setInterval(this.readTemperature.bind(this), 10000)
        this.mounted = true
    }

    componentWillUnmount() {
        this.mounted = false
        if(this.timer != null) {
            window.clearInterval(this.timer)
        }
        super.componentWillUnmount?.()
    }

    render() {
        return (
            <tr onClick={() => this.props.onSelect(this.props.temperatureSensor)}>
                <td>{this.props.temperatureSensor.name}</td>
                <td>{this.props.temperatureSensor.w1id}</td>
                <td>{this.state.temperature.toFixed(2)}</td>
            </tr>
        )
    }
}