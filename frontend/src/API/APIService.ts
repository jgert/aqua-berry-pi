export namespace API {

    export interface TemperatureSensor {
        id: string
        name: string
        w1id: string
    }

    export interface TemperatureData {
        timestamp: string,
        value: number
    }

    export interface TemperatureSensorServices {
        get(abortController: AbortController): Promise<TemperatureSensor[]>
        add(abortController: AbortController, sensor: TemperatureSensor): Promise<TemperatureSensor>
        update(abortController: AbortController, sensor: TemperatureSensor): Promise<TemperatureSensor>
        delete(abortController: AbortController, sensor: TemperatureSensor): Promise<void>
        temperature(abortController: AbortController, sensor: TemperatureSensor): Promise<TemperatureData>
    }

    export interface W1Sensors {
        get(abortController: AbortController): Promise<string[]>
    }

    export interface Services {
        readonly temperatureSensorServices: TemperatureSensorServices
        readonly w1Sensors: W1Sensors
        readonly temperatureDataService: TemperatureDataService
    }

    export interface TemperatureDataService {
        get(abortController: AbortController, temperatureSensor: TemperatureSensor, from: Date, to: Date): Promise<TemperatureData[]>
    }
}
