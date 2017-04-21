import React from "react"
import { Link } from 'react-router-dom'
export const NavBar = props => <nav>
    <div className="nav-wrapper">
      <div className="col s12">
          {props.navs.map((item,k)=>{
              if(k == props.navs.length - 1){
                  return  <a className="breadcrumb" key={k} href="javascript:;">{item.name}</a>
              }
             return <Link to={item.path} className="breadcrumb" key={k}>{item.name}</Link>
          })}
      </div>
    </div>
  </nav>
