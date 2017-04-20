import React from "react"
import ReactDOM from "react-dom"
import {
  HashRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import {SocketWrapper} from "./socket"
import {Database} from "./database"

require("./index.less")

const Home = props => <div className="home">
        <div className="links">
            <h3 className="link"><Link to="/socket">Socket连接终端</Link></h3>
            <h3 className="link"><Link to="/database">数据库连接终端</Link></h3>
        </div>
</div>

class App extends React.Component{
    render(){
        return <Router>
            <div className="wrapper">
                <Route path="/socket" component={SocketWrapper} />
                <Route path="/database" component={Database}/>
                <Route exact path="/" component={Home}/>
            </div>
        </Router>
    }
}


ReactDOM.render(<App />,document.getElementById('app'))
