import React from "react"
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;


export class SocketDetail extends React.Component{

    constructor(){
        super()
        this.state = {msgs:[]}
        this.online = true;
    }

    componentDidMount(){
        ipcRenderer.on('socket',(event, arg)=>{
            switch(arg.type){
                case "data":{
                    if(this.online){
                        let list = this.state.msgs;
                        list.push(arg.data)
                        this.setState({msgs:list})
                    }
                    break;
                }
            }
        })
    }

    componentWillUnmount(){
        this.online = false;
    }

    getTime(){
        let date = new Date()
        let seconds = date.getSeconds()
        let mini = date.getMilliseconds()
        let minutes = date.getMinutes()
        return `${minutes}:${seconds}.${mini}`

    }

    render(){
        return <table className="table table-bordered table-hover socket-details">
            <thead>
                <tr className="text-center">
                    <td>序号</td>
                    <td>时间</td>
                    <td>内容</td>
                </tr>
            </thead>
            <tbody>
                {this.state.msgs.map((item,index)=>{
                    return <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{this.getTime()}</td>
                        <td >
                            <pre>
                                <code dangerouslySetInnerHTML={{__html:item}}>
                                </code>
                            </pre>
                        </td>
                    </tr>
                })}
            </tbody>
        </table>
    }
}
