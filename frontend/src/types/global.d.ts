interface TemperatureConfig {
    sensors: string,
    values: string
}

interface BackendConfig {
    baseURL: string
    w1sensors: string
    temperature: TemperatureConfig
}

interface AppConfig {
    backend: BackendConfig
    useMockedBackend: boolean
}

declare global {
    const CONFIG: AppConfig;
}

export {}
