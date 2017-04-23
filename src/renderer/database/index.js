import React from "react"
import ReactDOM from "react-dom"
import {Route} from 'react-router-dom'
import {RedisIndex} from './redis'
import {NavBar} from "../nav.js";
import {MongoIndex} from './mongo'

const Redis = global.require('ioredis');
const MongoClient = global.require('mongodb').MongoClient;

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
                },{
                    type:'mongodb',
                    port:27017,
                    host:'127.0.0.1',
                    username:null,
                    password:null,
                    name:"local mongo",
                    db:"test"
                }
            ]
        }
    }

    buildItem(item, k) {
        return <div className="item card horizontal" key={k} onClick={() => this.connectItem(item)}>
            <div className={`logo-${item.type} logo card-image`}></div>
            <div className="card-stacked">
                <div className="card-content">
                    <span className="card-title activator grey-text text-darken-4">{item.name}</span>
                </div>
                <a className="card-action" href="#">{`${item.host}:${item.port}`}</a>
            </div>

        </div>
    }

    connectItem(item) {
        switch(item.type){
            case "redis":{
                this.connectRedis(item)
                break
            }
            case "mongodb":{
                this.connectMongo(item)
                break
            }
            default:{
                alert("引擎未实现")
            }
        }
    }

    connectRedis(item){
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

    connectMongo(item){
        let auth = ""
        if(item.username && item.password){
            auth = `${item.username}:${item.password}@`
        }
        let query = `mongodb://${auth}${item.host}:${item.port}/${item.db}`
        let conn = MongoClient.connect(query,(err,db)=>{
            if(!err){
                this.props.history.push('/database/mongo/' + JSON.stringify(item))
                db.close()
            }
            else{
                alert(err.message)
            }
        })

    }

    render() {
        return <div className="database-home">
            <NavBar navs={[{
                name:"HOME",
                path:"/"
            },{
                name:"CONNECTIONS",
                path:"#"
            }]}/>
            <div className="search-area">
                <input type="text" placeholder="search.." className="form-control"/>
                <a className="btn-floating  waves-effect waves-light red"><i className="material-icons">add</i></a>
            </div>
            <div className="list">
                {this.state.list.map((item, k) => this.buildItem(item, k))}
            </div>
        </div>
    }
}

export const Database = (props) =><div className = "database-container" >
    <Route path={`${props.match.url}/redis/:query`} component={RedisIndex}/>
    <Route path={`${props.match.url}/mongo/:query`} component={MongoIndex}/>
    <Route exact path={props.match.url} component={DababaseIndex}/>
< /div>
