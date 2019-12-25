import React, {useState} from 'react';
import {Button,message} from 'antd'
import style from './css.less';
import classNames from 'classnames'
import bg from 'src/Res/image/bg.png';
import {demo} from 'src/Components/Demo/demo';
function Demo(props){
    const {msg} = props;
    const [count,setCount] = useState(0)
    const onTagClick = ()=>{
        message.success(msg);
        const count_ = count +1;
        setCount(count_)
        demo();
    };
    return(
        <div className={classNames(style.init)}>
            <img className={style.img} src={bg} />
            <div>
                <Button className={style.button} onClick={onTagClick}>点击我{count}</Button>
            </div>
        </div>
    )
}
Demo.defaultProps = {
    msg:'你好'
}
export default Demo