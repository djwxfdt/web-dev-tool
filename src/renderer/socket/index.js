import React from "react"
const electron = global.require('electron');
const ipcRenderer = electron.ipcRenderer;
import { withRouter ,Route} from 'react-router-dom'
import {SocketDetail} from "./details.js"

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
        return <form className="socket-setting form-horizontal" onSubmit={(e)=>this.onSubmit(e)}>
            <div className="form-group">
                <label htmlFor="input1" className="col-sm-2 control-label">端口：</label>
                <div className="col-sm-10">
                  <input type="num" className="form-control" id="input1" placeholder="13340" ref="port"/>
                </div>
            </div>

            <div className="form-group">
                <div className="col-sm-offset-10 col-sm-10">
                  <button type="submit" className="btn btn-default">确定</button>
                </div>
            </div>
        </form>
    }
}


export const Socket = ({match}) => <div className="socket-container">
    <Route path={`${match.url}/details`} component={SocketDetail} />
    <Route exact path={match.url} component={SocketIndex} />
</div>

export const SocketWrapper = withRouter(Socket)
