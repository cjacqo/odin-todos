import _ from 'lodash'
import printMe from './print'

function app() {
    const appContainer = document.createElement('div')

    appContainer.innerHTML = 'App Start'
    // appContainer.innerHTML = _.join(['Hello', 'webpack'], '')

    return appContainer
}
document.body.appendChild(app())
