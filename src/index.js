import _ from 'lodash'
import './styles.css'
import Controller from './controller'
import Database from './data'
import PageViewControl from './controller/PageViewControl'
import StateControl from './controller/StateControl'

const _app = (function() {
    Database.init()
    // Controller.init()
    PageViewControl.init(Database.getFolders())
})()

export default _app