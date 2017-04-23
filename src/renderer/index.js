import React from "react"
import ReactDOM from "react-dom"
import {
  HashRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import {SocketWrapper} from "./socket"
import {Database} from "./database"
// import {Games} from "./games"


require("./index.less")

const Home = props => <div className="home">
        <div className="links">
            <h3 className="link"><Link to="/socket">远程LOG</Link></h3>
            <h3 className="link"><Link to="/database">数据库连接终端</Link></h3>
            {/* <h3 className="link"><Link to="/games">小游戏</Link></h3> */}
        </div>
</div>

class App extends React.Component{
    render(){
        return <Router>
            <div className="wrapper">
                <Route exact path="/" component={Home}/>
                <Route path="/socket" component={SocketWrapper} />
                <Route path="/database" component={Database}/>
                {/* <Route path="/games" component={Games}/> */}
            </div>
        </Router>
    }
}


ReactDOM.render(<App />,document.getElementById('app'))
