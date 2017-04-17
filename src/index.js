import React from "react"
import ReactDOM from "react-dom"
import {
  HashRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import {SocketWrapper} from "./socket"
import {SocketDetail} from "./socket/details.js"

const HomeLinks = ({match}) => <div className="links">
    <h3 className="link"><Link to="socket">Socket链接终端</Link></h3>
</div>

const Home = (props) => <div className="home">
        <HomeLinks match={props.match} />
</div>

class App extends React.Component{
    render(){
        return <Router>
            <div className="wrapper">
                <Route exact path="/socket" component={SocketWrapper} />
                <Route  path="/socket/details" component={SocketDetail}/>
                <Route exact path="/" component={Home}/>
            </div>
        </Router>
    }
}


ReactDOM.render(<App />,document.getElementById('app'))
