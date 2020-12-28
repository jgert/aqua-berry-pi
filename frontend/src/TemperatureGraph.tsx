import React from "react";
import Chart, {ChartDataSets} from "chart.js";
import {API} from "./API/APIService";
import {GraphJSWrapper} from "./GraphJSWrapper";
import {Button} from "react-bootstrap";

interface Props {
    services: API.Services
}

interface State {
    dataSets: Map<string, ChartDataSets>
    from: Date,
    to: Date
}

export class TemperatureGraph extends React.Component<Props, State> {

    abortController = new AbortController()

    constructor(props: Props) {
        super(props);
        const from = new Date()
        from.setHours(0, 0, 0, 0)
        const to = new Date()
        to.setHours(24, 0, 0, 0)

        this.state = {
            dataSets: new Map<string, Chart.ChartDataSets>(),
            from: from,
            to: to
        }
        this.reload()
    }

    reload() {
        this.abortController.abort()
        this.abortController = new AbortController()
        this.props
            .services
            .temperatureSensorServices
            .get(this.abortController)
            .then((items) => {
                items.forEach((item) => {
                    this.props.services.temperatureDataService.get(this.abortController, item, this.state.from, this.state.to)
                        .then((values) => {
                            let dataSets = this.state.dataSets
                            dataSets.set(item.name, {
                                label: item.name,
                                data: values.map(
                                    (v) => {
                                        return {x: new Date(Date.parse(v.timestamp)), y: v.value};
                                    })
                            })
                            this.setState({
                                dataSets: dataSets
                            })
                        })
                        .catch((e) => {
                            if (e.name == "AbortError") {
                                return
                            } else {
                                console.log(e)
                            }
                        })
                })
            })
            .catch((e) => {
                if (e.name == "AbortError") {
                    return
                } else {
                    console.log(e)
                }
            })
    }

    render() {
        const dataSets = Array.from(this.state.dataSets.values())
        return (<div>
            <Button onClick={this.reload.bind(this)}>Reload</Button>
            <GraphJSWrapper dataSets={dataSets}/>
        </div>)
    }

    componentWillUnmount() {
        this.abortController.abort()
    }
}