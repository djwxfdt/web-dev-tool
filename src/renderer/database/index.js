import React from "react"
import ReactDOM from "react-dom"
import { Route} from 'react-router-dom'

class RouteIndex extends React.Component{
    render(){
        return <div>
            sfasfd
        </div>
    }
}

export const Database = ({match}) =><div className="database-container">
            <Route exact path={match.url} component={RouteIndex} />
        </div>
