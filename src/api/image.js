import axios from 'axios'

export const SERVER_URL = 'http://127.0.0.1:5000'

export const runProjection = (data) => {
    const url = `${SERVER_URL}/projection`
    const formData = new FormData()
    formData.append('file', data.image)
    return axios.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}
export const runInference = (data) => {
    const url = `${SERVER_URL}/inference`
    return axios.post(url, data)
}
