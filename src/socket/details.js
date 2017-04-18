import React from "react"
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
import JSONTree from 'react-json-tree'
import { Link } from 'react-router-dom'

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633'
};


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

    formatJson(item){
        let jsonData = {msg:"解析错误！"}
        try{
            jsonData = JSON.parse(item)
        }
        catch(e){
            console.error(e);
        }
        return jsonData;
    }

    setTop(){
        ipcRenderer.send('operation',{type:"alwaystop",data:true});
    }

    render(){
        return <div className="socket-details table-responsive container">

                <div className="header" style={{marginBottom:"20px"}}>
                    <Link to="/" className="btn btn-default">返回首页</Link>
                    <a href="JavaScript:;" className="btn btn-default" onClick={()=>this.setTop()}>置顶</a>
                </div>
                <div className="table-like">
                    <div className="table-header text-center">
                        <div className="col-1">序号</div>
                        <div className="col-2">时间</div>
                        <div className="col-3">内容</div>
                        <div className="col-4">操作</div>
                    </div>
                    <div className="table-content">
                        {this.state.msgs.map((item,index)=>{
                            let data = item.replace(/\\\"/,"")
                            if(item.length > 100){
                                data = item.substring(0,99) + "...}"
                            }

                            return <div className="item-container" key={index}>
                                <div  className="item">
                                    <div className="text-center col-1 column">{index + 1}</div>
                                    <div className="text-center col-2 column">{this.getTime()}</div>
                                    <div title={item} className="col-3 column">
                                        <pre>
                                            <code>
                                                {data}
                                            </code>
                                        </pre>
                                    </div>
                                    <div className="text-center col-4 column">
                                        <a className="btn btn-default" href="JavaScript:;" onClick={()=>this.setState({format:this.state.format == index?-1:index})}>format</a>
                                    </div>
                                </div>
                                {this.state.format == index ?<div className="format">
                                    <JSONTree data={this.formatJson(item)} theme={theme} invertTheme={true} />
                                </div>:null}
                            </div>

                        })}
                </div>
            </div>
        </div>
    }
}
