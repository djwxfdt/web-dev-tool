import React from "react"
import ReactDOM from "react-dom"
const Redis = global.require('ioredis');
import {NavBar} from "../../nav.js";

require('./index.less')

export class RedisIndex extends React.Component{
    constructor(props){
        super()
        this.state = {
            query:JSON.parse(props.match.params.query),
            list:[]
        }
    }

    scan(){
        let stream = this.redis.scanStream()
        let list = []
        stream.on('data',datas=>list = [...list,...datas.map(data=>{return {key:data}})])
        stream.on('end',()=>{
            this.setState({list})
            list.forEach(item=>{
                this.redis.type(item.key,(err,type)=>{
                    item.type = type
                    this.setState({list})
                })
            })

        })


    }

    componentDidMount(){
        let item = this.state.query
        this.redis = new Redis(item.port, item.host, {
            password: item.password,
        }).on('connect', ()=> {
            this.scan()
        }).on('error', function(err){
            if (err.message.indexOf('max number of clients reached') !== -1) {
                console.log('redis connection closed')
            }
            alert(err.message)
            this.end(true)
        })

    }

    render(){
        return <div className="redis-container">
            <NavBar navs={[{
                name:"HOME",
                path:"/"
            },{
                name:"CONNECTIONS",
                path:"/database"
            },{
                name:"REDIS",
                path:"#"
            }]}/>
            <div className="redis-content">
                <div className="left-bar">
                    <div className="search">
                        <input type="text" className="form-control" placeholder="Key name or reg"/>
                    </div>
                    <div className="list">
                        <table className="striped">
                            <thead>
                                <tr>
                                    <th>type</th>
                                    <th>name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.list.map((item,key)=><tr className="item" key={key}>

                                    <td><div className={"type " + item.type}>{item.type == "string"?"str":item.type}</div></td>
                                    <td className="key">{item.key}</td>
                                </tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="drag-bar"></div>
            </div>

        </div>
    }
}
