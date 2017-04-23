import React from "react"
import ReactDOM from "react-dom"
const MongoClient = global.require('mongodb').MongoClient;
import {NavBar} from "../../nav.js";
import JSONTree from 'react-json-tree'

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

require("./index.less")

export class MongoIndex extends React.Component {

    constructor(props) {
        super()
        this.state = {
            params: JSON.parse(props.match.params.query),
            collections:[]
        }
    }

    componentDidMount() {
        let auth = ""
        let item = this.state.params;
        if (item.username && item.password) {
            auth = `${item.username}:${item.password}@`
        }
        let query = `mongodb://${auth}${item.host}:${item.port}/${item.db}`
        MongoClient.connect(query, (err, db) => {
            if (!err) {
                this.db = db;
                this.init()
            } else {
                alert(err.message)
            }
        })
    }

    init() {
        this.db.collections((err, collections) => {
            this.setState({collections})
        });
    }

    selectCollection(collection){
        let con = this.db.collection(collection.collectionName)
        let res = con.find({}).toArray((err,docs)=>{
            this.setState({selectCollection:collection,docs})
        })
    }

    buildCollections() {
        return <div className="collections">
            <div className="db"><i className="fa fa-database" aria-hidden="true"></i>{this.state.params.db}</div>
            <div className="list">
                {this.state.collections.map(item=><div className="item" key={item.collectionName} onClick={()=>this.selectCollection(item)}>
                    <i className="fa fa-table" aria-hidden="true"></i>{item.collectionName}
                </div>)}
            </div>
        </div>
    }

    buildDocuments(){
        if(!this.state.docs){
            return null
        }

        return <div className="documents">
            {this.state.docs.map(doc=>{
                return <div className="item" key={doc._id}>
                    <JSONTree data={doc} theme={theme} invertTheme={true}/>
                </div>
            })}
        </div>
    }

    render() {
        return <div className="mongo-container">
            <NavBar navs={[
                {
                    name: "HOME",
                    path: "/"
                }, {
                    name: "CONNECTIONS",
                    path: "/database"
                }, {
                    name: "MONGO",
                    path: "#"
                }
            ]}/>
            <div className="mongo-body">
                {this.buildCollections()}
                {this.buildDocuments()}
            </div>
        </div>
    }

}
