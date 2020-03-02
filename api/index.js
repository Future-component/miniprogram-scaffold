import config from '../config.js'

console.log('config: ', config)

const apiUrl = config.isDev ? config.devApi : config.proApi

export default {
}