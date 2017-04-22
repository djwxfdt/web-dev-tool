import React from "react"
import ReactDOM from "react-dom"
const Redis = global.require('ioredis');
import {NavBar} from "../../nav.js";
import CodeMirror from 'react-codemirror'
require('codemirror/mode/javascript/javascript')
require('./index.less')
require('codemirror/lib/codemirror.css')
require('codemirror/mode/xml/xml');
require('codemirror/addon/selection/active-line');
require('codemirror/addon/edit/closebrackets');
require('codemirror/addon/edit/matchbrackets');

export class RedisIndex extends React.Component{
    constructor(props){
        super()
        this.state = {
            query:JSON.parse(props.match.params.query),
            list:[],
            selectedItem:{}
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

    selectKey(item,index){
        this.setState({selectedItem:item})
        this.redis.get(item.key,(err,res)=>{
            if(!err){
                if(item.key == this.state.selectedItem.key){
                    this.setState({res})
                }
            }
            else{
                console.error(err);
                this.setState({res:null})
            }
        })
    }

    buildRes(){
        if(this.state.res == undefined){
            return null
        }
        return <div className="content-section" onKeyDown={e=>this.onKeyDown(e)}>
            <CodeMirror value={this.state.res} options={{lineNumbers:true,mode: {name: "javascript", json: true},styleActiveLine: true}} onChange={code=>this.setState({res:code})}/>
        </div>
    }

    changeContent(e){
        this.setState({res:e.target.value})
    }

    onKeyDown(evt){
        if (!evt.ctrlKey && evt.metaKey && evt.keyCode === 83) {
          this.save();
          evt.preventDefault();
          evt.stopPropagation();
        }
    }

    save(){
        let item = this.state.selectedItem;
        switch(item.type){
            case 'string':{
                this.redis.set(item.key,this.state.res)
                break
            }
        }
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
                        <input type="text" placeholder="Key name or reg"/>
                    </div>
                    <div className="list">
                        <header>
                            <div className="type-col">type</div>
                            <div className="text-col">name</div>
                        </header>
                        <section>
                            {this.state.list.map((item,index)=><div className={`item ${this.state.selectedItem.key == item.key?"selected":""}`} key={index} onClick={()=>this.selectKey(item)}>
                                <div className="type-col"><div className={"type " + item.type}>{item.type == "string"?"str":item.type}</div></div>
                                <div className="key text-col" title={item.key}>{item.key}</div>
                            </div>)}
                        </section>

                    </div>
                </div>
                {this.buildRes()}
            </div>

        </div>
    }
}
