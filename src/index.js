import _ from 'lodash'
import './styles.css'
import Database from './data'
import PageViewControl from './controller/PageViewControl'

const _app = (function() {
    Database.init()
    PageViewControl.init()
})()

export default _app