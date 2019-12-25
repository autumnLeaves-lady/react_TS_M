import React, {findDOMNode, Component} from 'react';
import { string, object, number, array, bool, func, symbol } from 'prop-types';
import { Tooltip,Button,Icon} from 'antd';
import classNames from 'classnames'
import style from './css.less';
export default class Ellipsis extends Component{
    constructor(props){
        super(props)
    }
    static propTypes = {
        //文本
        text:string,
        //长度
        length:number,
        //是否提示
        tooltip:bool,
        //是否显示阅读全文
        readAll:bool,
        //是否高亮
        highLight:bool,
        //高亮关键字
        highLightKey:string,
        //阅读全文的回调
        readAllCallBack:func
    };
    static defaultProps = {
        length:20,
        text:'',
        tooltip:false,
        highLight:false,
        highLightKey:'',
        readAllCallBack:()=>{}
    };
    /*字符串高亮
       * @text文本 @keyword高亮关键字
       * */
    highLight = (text='',keyword='')=>{
        // let keyword = this.state.keyword;
        let span = <span className={style.highLight}>{keyword}</span>;
        let textArr = text.split(keyword);
        let index = 1;
        textArr.forEach(()=>{
            textArr.splice(index,0,span);
            index =  + index + 2;
        });
        try{
            textArr.length = textArr.length-1;
        }catch(e){
            return [];
        }
        return textArr;
    };
    textFormat = ()=>{
        let text  = this.props.text;
        let title  = this.props.title;
        let length = this.props.length;
        let tooltip = this.props.tooltip;
        let readAll = this.props.readAll;
        let highLight = this.props.highLight;
        let highLightKey = this.props.highLightKey;

        const tail = '...';
        let button = null;
        let result;
        if(typeof text!=='string'){
            text = '';
        }
        if(text.length < length || length<0 || (length - tail.length<=0) || (text.length - tail.length <=0)){
            //文本小于长度,或规定长度小于0，或规定长度小于尾巴长度，或字符串长度小于尾巴长度
            result = text;
        }else{
            if(readAll){
                button = <span className={style.readAll} onClick={this.props.readAllCallBack}>阅读全文<Icon type="down" className={style.icon}/></span>
            }
            result = text.slice(0,length - tail.length);
            if(highLight){
                result = this.highLight(result,highLightKey);
                //返回的是一个数组，因此尾巴要push进来
                result.push(tail);
            }else{
                result = result + tail;
            }
        }
        if(tooltip){
            return (
                <span className={classNames(this.props.className)}>
                    <Tooltip overlayStyle={{ wordBreak: 'break-all' }} title={title||text}>
                        <span>{result}</span>
                    </Tooltip>
                    {button}
                </span>
            )
        }else{
            return (
                <span className={classNames(this.props.className)} title={title||text}>
                    <span>{result}</span>
                    {button}
                </span>
            )
        }
    };
    render(){
        return(
            this.textFormat()
        )
    }
}
