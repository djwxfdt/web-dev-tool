import React from "react"
import ReactDOM from "react-dom"
import { Route} from 'react-router-dom'

require("./index.less")

class RouteIndex extends React.Component{
    constructor(){
        super()
        this.state = {
            list:[{
                type:'redis',
                port:6319,
                host:'127.0.0.1',
                password:'',
                username:'',
                name:"local redis"
            }]
        }
    }

    buildItem(item,k){
        return <div className="item" key={k}>
            <div className={`logo-${item.type} logo`}></div>
            <div className="info">
                <div className="name">{item.name}</div>
                {item.username && item.username.length > 0 ? <div className="url">{`${item.host}:${item.port}`}</div> : null}
                <div className="url">{`${item.host}:${item.port}`}</div>
            </div>

        </div>
    }

    render(){
        return <div className="database-home">
            <div className="bar">

            </div>
            <div className="search-area">
                <input type="text" placeholder="search.." className="form-control" />
                <a href="javascript:;" className="btn btn-default">Add</a>
            </div>
            <div className="list">
                {this.state.list.map((item,k)=>this.buildItem(item,k))}
            </div>
        </div>
    }
}

export const Database = ({match}) =><div className="database-container">
            <Route exact path={match.url} component={RouteIndex} />
        </div>
