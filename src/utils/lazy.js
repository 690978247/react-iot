import React , { Component } from 'react';

export default function lazy(loading){//传过来一个函数
  return class extends Component {
    constructor ( props ) {
      super ( props );
      this.state={
        Com:null
      };
      this.load()
    };

    load(props){
      loading().then((Com)=>{  //调用函数获取它传过来的路径
        this.setState({
          Com:Com.default?Com.default:null
        });
      })
    };

    render () {
      let Com=this.state.Com;
      return Com?<Com/>:null;
    };
  };
}
