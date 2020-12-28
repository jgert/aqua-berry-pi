import React from "react";
import Chart, {ChartDataSets} from "chart.js";

interface Props {
    dataSets: ChartDataSets[]
}

interface State {

}

export class GraphJSWrapper extends React.Component<Props, State> {
    canvasRef = React.createRef<HTMLCanvasElement>();
    chart: Chart | null = null

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        // @ts-ignore
        const current = this.canvasRef.current.getContext("2d");

        // @ts-ignore
        this.chart = new Chart(current, {
            type: "scatter",
            data: {
                datasets: this.props.dataSets,
            },
            options: {
                //Customize chart options
            }
        });
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        // @ts-ignore
        this.chart?.data = {
            datasets: this.props.dataSets
        }
        this.chart?.update()

    }

    render() {
        return (
            <canvas ref={this.canvasRef}/>
        )
    }
}
