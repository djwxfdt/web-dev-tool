import React from "react"
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
import JSONTree from 'react-json-tree'
import { Link } from 'react-router-dom'
import _ from 'lodash'

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
        this.state = {msgs:[],tags:{}}
        this.online = true;
    }

    componentDidMount(){
        ipcRenderer.on('socket',(event, arg)=>{
            switch(arg.type){
                case "data":{
                    if(this.online){
                        let list = this.state.msgs;
                        try{
                            let data = JSON.parse(arg.data)
                            data.time = new Date().getTime()
                            let tags = this.state.tags

                            tags[data.tag] = (tags[data.tag] || 0) + 1

                            list.push(data)
                            this.setState({msgs:list,tags:tags})
                        }
                        catch(e){
                            console.error(e,arg.data);
                        }
                    }
                    break;
                }
            }
        })
    }

    componentWillUnmount(){
        this.online = false;
    }

    getTime(time){
        let date = new Date(time)
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

    buildTags(){
        if(Object.keys(this.state.tags).length == 0){
            return <div></div>
        }
        let list = []
        let index = 0
        _.forEach(this.state.tags,(v,k)=>{
            index++
            list.push(<a key={index} href="javascript:;" className={`tag ${this.state.tag == k?"selected":""}`} onClick={()=>this.setTag(this.state.tag == k?null:k)} >{k}({v})</a>)
        })
        return <div className="tags" style={{marginBottom:"20px"}}>
            {list}
        </div>
    }

    setTag(tag){
        this.setState({tag})
    }

    buildRows(){
        let list = []
        if(this.state.tag){
            list = this.state.msgs.filter(item=>item.tag == this.state.tag)
        }else{
            list = this.state.msgs;
        }
        return list.map((item,index)=>{
            let data = item.data.replace(/\\\"/,"")
            if(data.length > 100){
                data = data.substring(0,99) + "...}"
            }

            return <div className="item-container" key={index}>
                <div  className="item">
                    <div className="text-center col-1 column">{item.tag}</div>
                    <div className="text-center col-2 column">{this.getTime(item.time)}</div>
                    <div className="col-3 column">
                        <pre>
                            <code>
                                {data}
                            </code>
                        </pre>
                    </div>
                    <div className="text-center col-4 column">
                        <a className="btn btn-default" href="JavaScript:;" onClick={()=>this.setState({format:this.state.format == index?-1:index})}>格式化</a>
                    </div>
                </div>
                {this.state.format == index ?<div className="format">
                    <JSONTree data={this.formatJson(item.data)} theme={theme} invertTheme={true} />
                </div>:null}
            </div>
        })
    }

    render(){
        return <div className="socket-details table-responsive container">

                <div className="header" style={{marginBottom:"20px"}}>
                    <Link to="/" className="btn btn-default">返回首页</Link>
                    <a href="javascript:;" className="btn btn-default" onClick={()=>this.setState({msgs:[],tags:{}})}>清空</a>
                    <a href="javascript:;" className="btn btn-default" onClick={()=>this.setTop()}>置顶</a>
                </div>

                {this.buildTags()}

                <div className="table-like">
                    <div className="table-header text-center">
                        <div className="col-1">标签</div>
                        <div className="col-2">时间</div>
                        <div className="col-3">内容</div>
                        <div className="col-4">操作</div>
                    </div>
                    <div className="table-content">
                        {this.buildRows()}
                </div>
            </div>
        </div>
    }
}
