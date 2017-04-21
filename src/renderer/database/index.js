import React from "react"
import ReactDOM from "react-dom"
import {Route} from 'react-router-dom'
import {RedisIndex} from './redis'


const Redis = global.require('ioredis');

require("./index.less")

class DababaseIndex extends React.Component {
    constructor() {
        super()
        this.state = {
            list: [
                {
                    type: 'redis',
                    port: 6379,
                    host: '127.0.0.1',
                    password: null,
                    name: "local redis"
                }
            ]
        }
    }

    buildItem(item, k) {
        return <div className="item" key={k} onClick={() => this.connectItem(item)}>
            <div className={`logo-${item.type} logo`}></div>
            <div className="info">
                <div className="name">{item.name}</div>
                <div className="url">{`${item.host}:${item.port}`}</div>
            </div>

        </div>
    }

    connectItem(item) {
        let redis = new Redis(item.port, item.host, {
            password: item.password,
        })
        redis.on('connect', ()=> {
            this.props.history.push('/database/redis/' + JSON.stringify(item))
        }).on('error', function(err){
            if (err.message.indexOf('max number of clients reached') !== -1) {
                console.log('redis connection closed')
            }
            alert(err.message)
            this.end(true) // stop the retry strategy

        })

    }

    render() {
        return <div className="database-home">
            <div className="bar"></div>
            <div className="search-area">
                <input type="text" placeholder="search.." className="form-control"/>
                <a href="javascript:;" className="btn btn-default">Add</a>
            </div>
            <div className="list">
                {this.state.list.map((item, k) => this.buildItem(item, k))}
            </div>
        </div>
    }
}

export const Database = (props) =><div className = "database-container" >
    <Route path={`${props.match.url}/redis/:query`} component={RedisIndex}/>
    <Route exact path={props.match.url} component={DababaseIndex}/>
< /div>
