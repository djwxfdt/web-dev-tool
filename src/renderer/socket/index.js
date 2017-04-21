import React from "react"
const electron = global.require('electron');
const ipcRenderer = electron.ipcRenderer;
import { withRouter ,Route} from 'react-router-dom'
import {SocketDetail} from "./details.js"
import {NavBar} from "../nav.js";


require("./index.less")

export class SocketIndex extends React.Component{

    componentDidMount(){
        console.log(this.props)
    }

    onSubmit(e){
        e.preventDefault();
        ipcRenderer.send("socket",{type:"open",port:this.refs.port.value || 13340});
        this.props.history.push('/socket/details')
    }

    render(){
        return <div className="socket-setting">
            <NavBar navs={[{
                name:"HOME",
                path:"/"
            },{
                name:"SOCKET SETTING",
                path:"#"
            }]}/>
            <form  onSubmit={(e)=>this.onSubmit(e)} className="col s12">
                <div className="row">
                    <div className="col s12">
                        <label htmlFor="input1" data-error="wrong" data-success="right">端口</label>
                        <input id="input1" type="text" className="validate" placeholder="13340" ref="port"/>
                    </div>
                </div>

                <div className="form-group">
                    <div className="col-sm-offset-10 col-sm-10">
                      <button type="submit" className="btn btn-default">确定</button>
                    </div>
                </div>
            </form>
        </div>
    }
}


export const Socket = ({match}) => <div className="socket-container">
    <Route path={`${match.url}/details`} component={SocketDetail} />
    <Route exact path={match.url} component={SocketIndex} />
</div>

export const SocketWrapper = withRouter(Socket)
