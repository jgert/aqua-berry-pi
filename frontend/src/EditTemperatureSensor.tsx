import React from "react";
import {Alert, Button, Form, Modal, ModalBody, Spinner} from "react-bootstrap";
import {API} from "./API/APIService";

export interface Props {
    api: API.Services
    visible: boolean
    w1sensors: string[]
    temperatureSensor: API.TemperatureSensor
    abortController: AbortController

    onDismiss: () => void
}

enum WorkingState {
    idle,
    working,
    error
}

export interface State {
    sensorId: string
    sensorw1id: string
    sensorName: string
    workingState: WorkingState
    errorMessage: string | null
}

export class EditTemperatureSensor extends React.PureComponent<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            sensorId: props.temperatureSensor.id,
            sensorw1id: props.temperatureSensor.w1id,
            sensorName: props.temperatureSensor.name,
            workingState: WorkingState.idle,
            errorMessage: null
        }
    }

    submit(event: any) {
        event.preventDefault()
    }

    nameChanged(event: any) {
        this.setState({
            sensorName: event.target.value
        })
    }

    w1Changed(event: any) {
        this.setState({
            sensorw1id: event.target.value
        })
    }

    handleSubmit() {
        this.setState({
            workingState: WorkingState.working,
            errorMessage: null,
        })

        let promise: Promise<API.TemperatureSensor>
        let sensor = {
            id: this.state.sensorId,
            w1id: this.state.sensorw1id,
            name: this.state.sensorName
        };
        if (this.state.sensorId == "0") {
            promise = this.props.api.temperatureSensorServices.add(this.props.abortController, sensor)
        } else {
            promise = this.props.api.temperatureSensorServices.update(this.props.abortController, sensor)
        }

        promise
            .then(() => {
                this.setState({
                    workingState: WorkingState.idle
                }, this.handleDismiss)
            })
            .catch((e) => {
                this.setState({
                    workingState: WorkingState.error,
                    errorMessage: e.message
                })
            })
    }

    handleDelete() {
        this.setState({
            workingState: WorkingState.working,
            errorMessage: null
        })

        this.props.api.temperatureSensorServices.delete(
            this.props.abortController, {
                w1id: this.state.sensorw1id,
                id: this.state.sensorId,
                name: this.state.sensorName
            }).then(() => {
            this.setState({
                workingState: WorkingState.idle,
                errorMessage: null
            }, this.handleDismiss)
        }).catch((e) => {
            this.setState({
                workingState: WorkingState.error,
                errorMessage: e.message
            })
        })
    }

    handleDismiss() {
        this.setState({
            workingState: WorkingState.idle,
            errorMessage: null
        }, this.props.onDismiss)
    }

    deleteButton() {
        if (this.state.sensorId == "0") {
            return <div/>
        } else {
            return <Button variant={"danger"} onClick={this.handleDelete.bind(this)}>Delete</Button>
        }
    }

    submitButton() {
        return (
            <Button variant="primary"
                    disabled={!(this.state.workingState != WorkingState.working)}
                    onClick={this.handleSubmit.bind(this)}>
                <Spinner
                    size="sm"
                    role="status"
                    animation="border"
                    hidden={this.state.workingState != WorkingState.working}/>
                Submit
            </Button>
        )
    }

    render() {
        const state = this.state;

        return (
            <Modal show={this.props.visible}>
                <ModalBody>
                    <Form onSubmit={this.submit.bind(this)}>
                        <Form.Group>
                            <Form.Label>{state.sensorId}</Form.Label>
                            <Form.Label>Sensor name</Form.Label>
                            <Form.Control
                                id="name"
                                type="text"
                                placeholder="name of the temperature sensor"
                                value={state.sensorName}
                                onChange={this.nameChanged.bind(this)}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Control
                                as="select"
                                value={state.sensorw1id}
                                id="w1"
                                onChange={this.w1Changed.bind(this)}>
                                {this.props.w1sensors.map((item) => {
                                    return (<option key={item}>{item}</option>)
                                })}
                            </Form.Control>
                        </Form.Group>
                        <Alert
                            variant={"warning"}
                            show={state.errorMessage != null}>
                            {state.errorMessage}
                        </Alert>
                    </Form>
                </ModalBody>
                <Modal.Footer>
                    {this.deleteButton()}
                    {this.submitButton()}
                    <Button
                        variant={"secondary"}
                        onClick={this.handleDismiss.bind(this)}>
                        Cancel
                    </Button>
                </Modal.Footer>

            </Modal>
        )
    }
}