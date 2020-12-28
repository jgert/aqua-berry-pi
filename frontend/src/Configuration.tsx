import React from "react";
import {TemperatureSensorTableRow} from "./TemperatureSensorTableRow";
import {Button, Table} from "react-bootstrap";
import {API} from "./API/APIService";
import {EditTemperatureSensor} from "./EditTemperatureSensor";

interface Props {
    services: API.Services
}

interface State {
    w1sensors: string[]
    temperatureSensors: API.TemperatureSensor[]
    selectedTemperatureSensor: API.TemperatureSensor | null
}

export class Configuration extends React.Component<Props, State> {

    abortController = new AbortController()

    constructor(props: Props) {
        super(props);
        this.state = {
            selectedTemperatureSensor: null,
            w1sensors: [],
            temperatureSensors: []
        }

        this.refreshTemperatureSensors()
    }

    refreshSensors() {
        this.props
            .services
            .w1Sensors
            .get(this.abortController)
            .then((items) => {
                this.setState({
                    w1sensors: items
                })
            })
    }

    refreshTemperatureSensors() {
        this.props
            .services
            .temperatureSensorServices
            .get(this.abortController)
            .then((items) => {
                this.setState({
                    temperatureSensors: items
                })
            })
    }

    addTemperatureSensor() {
        this.setState({
            selectedTemperatureSensor: {
                id: "0",
                w1id: "",
                name: ""
            }
        })
    }

    handleDismissEditTemperatureSensor() {
        this.setState({
            selectedTemperatureSensor: null
        })
    }

    modalEditTemperatureSensor() {
        const state = this.state
        if (state.selectedTemperatureSensor) {
            return (
                <EditTemperatureSensor
                    api={this.props.services}
                    visible={true}
                    w1sensors={state.w1sensors}
                    temperatureSensor={state.selectedTemperatureSensor}
                    abortController={this.abortController}
                    onDismiss={this.handleDismissEditTemperatureSensor.bind(this)}/>
            )
        } else {
            return (<div/>)
        }
    }

    render() {
        const state = this.state
        return (
            <div>
                <Button onClick={this.refreshSensors.bind(this)}>Refresh sensors</Button>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>w1</th>
                        <th>Temperature</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        state.temperatureSensors.map((item) => {
                            return <TemperatureSensorTableRow
                                service={this.props.services.temperatureSensorServices}
                                key={item.id}
                                temperatureSensor={item}
                                abortController={this.abortController}
                                onSelect={(sensor) => this.setState({
                                    selectedTemperatureSensor: sensor
                                })}/>
                        })
                    }
                    </tbody>
                </Table>
                <Button onClick={this.addTemperatureSensor.bind(this)}>Add temperature sensor</Button>
                {this.modalEditTemperatureSensor()}
            </div>
        )
    }

    componentWillUnmount() {
        this.abortController.abort()
    }
}
