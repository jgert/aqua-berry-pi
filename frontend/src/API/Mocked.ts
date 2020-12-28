import {v4} from "uuid";
import {API} from "./APIService";

export namespace MockedAPI {
    import TemperatureSensorServices = API.TemperatureSensorServices;

    export class MockedServices implements API.Services {
        temperatureSensorServices = new MockedTemperatureSensorServices()
        w1Sensors = new MockedW1Sensors()
        temperatureDataService = new MockedTemperatureDataService()
    }

    export class MockedTemperatureSensorServices implements TemperatureSensorServices {
        private temperatureSensors: API.TemperatureSensor[] = [
            {
                name: "s 1",
                id: "1",
                w1id: "1"
            },
            {
                name: "s 2",
                id: "2",
                w1id: "2"
            },
            {
                name: "s 3",
                id: "3",
                w1id: "3"
            },
        ]

        get(abortController: AbortController): Promise<API.TemperatureSensor[]> {
            return new Promise((resolve, reject) =>
                setTimeout(() => {
                    resolve(this.temperatureSensors)
                }, 500)
            )
        }

        add(abortController: AbortController, sensor: API.TemperatureSensor): Promise<API.TemperatureSensor> {
            return new Promise((resolve, reject) =>
                setTimeout(() => {
                    if (sensor.name == "") {
                        reject(new TypeError("name can't be nil"))
                        return
                    }
                    if (sensor.w1id == "") {
                        reject(new TypeError("w1 not assigned"))
                        return
                    }

                    let newSensor: API.TemperatureSensor = {
                        ...sensor,
                        id: v4(),
                    }
                    this.temperatureSensors.push(newSensor)
                    resolve(sensor)
                }, 500)
            )
        }

        update(abortController: AbortController, sensor: API.TemperatureSensor): Promise<API.TemperatureSensor> {
            return new Promise((resolve, reject) =>
                setTimeout(() => {
                    if (sensor.name == "") {
                        reject(new TypeError("name can't be nil"))
                        return
                    }
                    if (sensor.w1id == "") {
                        reject(new TypeError("w1 not assigned"))
                        return
                    }
                    if (sensor.id == "") {
                        reject(new TypeError("id is empty"))
                        return
                    }

                    let index = this.temperatureSensors.findIndex(value => value.id === sensor.id)
                    if (index == -1) {
                        reject(new TypeError("sensor not found " + sensor.id))
                        return
                    }

                    this.temperatureSensors[index] = sensor
                    resolve({...sensor})
                }, 500)
            )
        }

        delete(abortController: AbortController, sensor: API.TemperatureSensor): Promise<void> {
            return new Promise((resolve, reject) =>
                setTimeout(() => {

                    let index = this.temperatureSensors.findIndex(value => value.id == sensor.id)
                    if (index == -1) {
                        reject(new TypeError("sensor not found"))
                        return
                    }

                    this.temperatureSensors.splice(index, 1)
                    resolve()
                }, 500)
            )
        }

        temperature(abortController: AbortController, sensor: API.TemperatureSensor): Promise<API.TemperatureData> {
            return new Promise((resolve, reject) =>
                setTimeout(() => {

                    let index = this.temperatureSensors.findIndex(value => value.id == sensor.id)
                    if (index == -1) {
                        reject(new TypeError("sensor not found"))
                        return
                    }

                    const ret: API.TemperatureData = {
                        timestamp: new Date().toISOString(),
                        value: 20+20*Math.sin(Date.now()*0.0001)
                    }
                    resolve(ret)
                }, 500)
            )
        }
    }

    export class MockedW1Sensors implements API.W1Sensors {
        get(abortController: AbortController): Promise<string[]> {
            return new Promise((resolve, reject) =>
                setTimeout(() => {
                    resolve(["w1", "w2", "w3", "w4"])
                }, 500)
            )
        }

    }

    export class MockedTemperatureDataService implements API.TemperatureDataService {
        // randomData(from: number, to: number): number[] {
        //     const delta = (to-from)/60
        //     const phase = Math.random()*3
        //     let result: number[] = []
        //
        //     for(let a=0; a<delta; a++) {
        //         result.push({
        //             timestamp: new Date().toISOString(),
        //             value: 20+20*Math.sin(phase + a*Date.now()*0.001)
        //         })
        //     }
        //     return result
        // }

        get(abortController: AbortController, temperatureSensor: API.TemperatureSensor, from: Date, to: Date): Promise<API.TemperatureData[]> {

            return new Promise((resolve, reject) =>
                // setTimeout(() => {
                //     resolve(this.randomData(from., to))
                // }, 500+Math.random()*500)
                Promise.reject("Not implemented")
            )
        }
    }
}