import {API} from "./APIService";
import {Networking} from "./Networking";

export namespace RemoteAPI {

    export class RemoteService implements API.Services {
        networking = new Networking()
        temperatureDataService: API.TemperatureDataService = new RemoteTemperatureDataService(this.networking)
        temperatureSensorServices: API.TemperatureSensorServices = new RemoteTemperatureSensorService(this.networking)
        w1Sensors: API.W1Sensors = new RemoteW1Sensors(this.networking)
    }

    export class RemoteTemperatureDataService implements API.TemperatureDataService {
        constructor(private networking: Networking) {
        }

        get(abortController: AbortController, temperatureSensor: API.TemperatureSensor, from: Date, to: Date): Promise<API.TemperatureData[]> {

            interface QueryItems {
                [key: string]: string | number | boolean;
            }
            let params: QueryItems = {
                id: temperatureSensor.id,
                from: from.toISOString(),
                to: to.toISOString()
            }

            let query = Object.keys(params)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                .join('&');

            return this.networking.get(abortController, `${CONFIG.backend.temperature.values}?${query}`)
        }
    }

    export class RemoteTemperatureSensorService implements API.TemperatureSensorServices {

        constructor(private networking: Networking) {
        }

        add(abortController: AbortController, sensor: API.TemperatureSensor): Promise<API.TemperatureSensor> {
            return this.networking.post(abortController, CONFIG.backend.temperature.sensors, sensor)
        }

        delete(abortController: AbortController, sensor: API.TemperatureSensor): Promise<void> {
            return this.networking.delete(abortController, `${CONFIG.backend.temperature.sensors}/${sensor.id}`)
        }

        get(abortController: AbortController): Promise<API.TemperatureSensor[]> {
            return this.networking.get(abortController, CONFIG.backend.temperature.sensors)
        }

        temperature(abortController: AbortController, sensor: API.TemperatureSensor): Promise<API.TemperatureData> {
            return this.networking.get(abortController,`${CONFIG.backend.w1sensors}/${sensor.w1id}`)
        }

        update(abortController: AbortController, sensor: API.TemperatureSensor): Promise<API.TemperatureSensor> {
            return this.networking.put(abortController, CONFIG.backend.temperature.sensors, sensor)
        }

    }

    export class RemoteW1Sensors implements API.W1Sensors {

        constructor(private networking: Networking) {
        }

        get(abortController: AbortController): Promise<string[]> {
            return this.networking.get(abortController, CONFIG.backend.w1sensors)
        }
    }
}