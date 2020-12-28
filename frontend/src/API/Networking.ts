
export class Networking {

    private fullURL(endpoint: string): string {
        console.log(CONFIG.backend.baseURL + endpoint)
        return CONFIG.backend.baseURL + endpoint
    }

    post<S, D>(abortController: AbortController, url: string, obj: S): Promise<D> {
        return fetch(this.fullURL(url), {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(obj),
            }
        ).then((data) => data.json())
    }

    put<S, D>(abortController: AbortController, url: string, obj: S): Promise<D> {
        return fetch(this.fullURL(url), {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(obj),
        })
            .then((data) => data.json())
    }

    get<D>(abortController: AbortController, url: string): Promise<D> {
        return fetch(this.fullURL(url), {signal: abortController.signal})
            .then((data) => data.json())
    }

    delete(abortController: AbortController, url: string): Promise<void> {
        return fetch(this.fullURL(url), {
            method: 'DELETE'
        }).then()
    }
}
