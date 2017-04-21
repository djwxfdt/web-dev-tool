import React from "react"
import ReactDOM from "react-dom"
const Redis = global.require('ioredis');


export class RedisIndex extends React.Component{
    constructor(props){
        super()
        this.state = {
            query:JSON.parse(props.match.params.query)
        }
    }

    componentDidMount(){
        let item = this.state.query
        this.redis = new Redis(item.port, item.host, {
            password: item.password,
        }).on('connect', ()=> {
        }).on('error', function(err){
            if (err.message.indexOf('max number of clients reached') !== -1) {
                console.log('redis connection closed')
            }
            alert(err.message)
            this.end(true)
        })

    }

    render(){
        return <div>
            dafas
        </div>
    }
}
