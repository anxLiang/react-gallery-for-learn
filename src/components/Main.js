require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

// imageDatas
let imageDatas = require('../datas/imageDatas.json');

imageDatas.forEach(function(item)
{
  item.imageURL = require('../images/' + item.filename);
})

var ImageComponent = React.createClass(
{
  handleClick : function(event)
  {
    event.stopPropagation();
    event.preventDefault();

    this.props.inverse();

    if (!this.props.arrange.isCenter)
    {
      this.props.beCenter();
    }
  },

  render : function()
  {
    /*
      * styleObj格式需是css样式对象格式，与jQuery的写法相同：
      * {
      *   width : ,
      *   height : ,
      *   position : ,
      *   ...
      * }
     */
    let styleObj = {};
    if (this.props.arrange.pos)
    {
      styleObj = this.props.arrange.pos;
    }

    if (this.props.arrange.rotate)
    {
      // 内敛样式需驼峰写法,moz与webkit首字大写
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function(item)
      {
        styleObj[item] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }

    if (this.props.arrange.isCenter)
    {
      styleObj.zIndex = 11;
    }

    let imgClassName = 'img-box transition-animation';
    imgClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
        <figure className={imgClassName} style={styleObj} onClick={this.handleClick}>
          <div className='img-front'>
            <img src={this.props.data.imageURL} alt={this.props.data.title} />
            <figcaption>
            <h4>{this.props.data.title}</h4>
            </figcaption>
          </div>
          <div className="img-back">{this.props.data.description}</div>
        </figure>
      )
  }
});

var ControlButton = React.createClass(
{
  handleClick : function(event)
  {
    event.stopPropagation();
    event.preventDefault();

    this.props.inverse();

    if (!this.props.arrange.isCenter)
    {
      this.props.beCenter();
    }
  },

  render : function()
  {
    let ctrlUnitClassName = 'ctrl-unit';
    ctrlUnitClassName += this.props.arrange.isCenter ? ' be-selected' : '';
    ctrlUnitClassName += this.props.arrange.isInverse ? ' ctrl-inverse' : '';

    return (
        <span className={ctrlUnitClassName} onClick={this.handleClick}></span>
      );
  }
});

/*
 * 使用  class Component extends React.component { ... }
 * 生成组件，报错：
 * Super expression must either be null or a function, not undefined
 */
// class ImageComponent extends React.component
// {
//   handleClick(event)
//   {
//     event.stopPropagation();
//     event.preventDefault();

//     this.props.inverse();

//     if (!this.props.arrange.isCenter)
//     {
//       this.props.beCenter();
//     }
//   }

//   render()
//   {
//     /*
//       * styleObj格式需是css样式对象格式，与jQuery的写法相同：
//       * {
//       *   width : ,
//       *   height : ,
//       *   position : ,
//       *   ...
//       * }
//      */
//     let styleObj = {};
//     if (this.props.arrange.pos)
//     {
//       styleObj = this.props.arrange.pos;
//     }

//     if (this.props.arrange.rotate)
//     {
//       // 内敛样式需驼峰写法,moz与webkit首字大写
//       (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function(item)
//       {
//         styleObj[item] = 'rotate(' + this.props.arrange.rotate + 'deg)';
//       }.bind(this));
//     }

//     if (this.props.arrange.isCenter)
//     {
//       styleObj.zIndex = 11;
//     }

//     let imgClassName = 'img-box transition-animation';
//     imgClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

//     return (
//         <figure className={imgClassName} style={styleObj} onClick={this.handleClick}>
//           <div className='img-front'>
//             <img src={this.props.data.imageURL} alt={this.props.data.title} />
//             <figcaption>
//             <h4>{this.props.data.title}</h4>
//             </figcaption>
//           </div>
//           <div className="img-back">{this.props.data.description}</div>
//         </figure>
//       )
//   }
// }

// class ControlButton extends React.component
// {
//   handleClick(event)
//   {
//     event.stopPropagation();
//     event.preventDefault();

//     this.props.inverse();

//     if (!this.props.arrange.isCenter)
//     {
//       this.props.beCenter();
//     }
//   }

//   render()
//   {
//     let ctrlUnitClassName = 'ctrl-unit';
//     ctrlUnitClassName += this.props.arrange.isCenter ? ' be-selected' : '';
//     ctrlUnitClassName += this.props.arrange.isInverse ? ' ctrl-inverse' : '';

//     return (
//         <span className={ctrlUnitClassName} onClick={this.handleClick}></span>
//       );
//   }
// }

class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    this.Constant =
    {
      // 初始化为0
      // 中心位置取值
      centerPos :
      {
        left : 0,
        top : 0
      },
      // 左右两部分取值范围，其Y值取值范围一样
      LRPosRange :
      {
        // 数组值1为下限，值2为上限
        leftSecX : [0, 0],
        rightSecX : [0, 0],
        y: [0, 0]
      },
      // 中上部分取值范围
      MTPosRange :
      {
        // 数组值1为下限，值2为上限
        x : [0, 0],
        y : [0, 0]
      }
    };
      // 为组件中每一个img组件添加状态，以便控制
    this.state =
      {
          imgArrangeArr : [
           /* {
                pos : {
                  left : 0,
                  top : 0
                },
                rotate : 0,
                isCenter : false,   //是否处于中心
                isInverse : false   //是否已经翻转
            }*/
          ]
      };

      // 初始化标志
      this.inited = false;
  }

  // 生成范围内随机数
  getRangeRandom(min, max)
  {
    return Math.random() * (max - min) + min;
  }

  // 生成旋转角度 -30~+30
  getRotateDeg()
  {
    return Math.random() * 30 * (Math.random() >= 0.5 ? 1 : -1);
  }

  // 排布图片
  reArrange(centerIndex)
  {
    let imgArrangeArr = this.state.imgArrangeArr,
        Constant = this.Constant,
        MTPosX = Constant.MTPosRange.x,
        MTPosY = Constant.MTPosRange.y,
        leftSecX = Constant.LRPosRange.leftSecX,
        rightSecX = Constant.LRPosRange.rightSecX,
        y = Constant.LRPosRange.y;

    // 取出中心图，初始化其位置,不加旋转
    let centerImg = imgArrangeArr.splice(centerIndex, 1);
    centerImg.pos = {
      left : Constant.centerPos.left,
      top : Constant.centerPos.top
    };
    centerImg.rotate = 0;
    centerImg.isCenter = true;

    // 取出上方图，随机其位置,上方图可0或1张
    let topImgNum = Math.ceil(Math.random()),
        topImgIndex = Math.floor(Math.random() * (imgArrangeArr.length - topImgNum)),
        topImg = null;
    if (topImgNum != 0)
    {
      topImg = imgArrangeArr.splice(topImgIndex, topImgNum);
      topImg[0].pos = {
        left : this.getRangeRandom(MTPosX[0], MTPosX[1]),
        top : this.getRangeRandom(MTPosY[0], MTPosY[1])
      };
      topImg[0].rotate = this.getRotateDeg();
      topImg[0].isCenter = false;
      topImg[0].isInverse = false;
    }

      let LORX = null;
    // 分两侧布局
    for (let i = 0, l = imgArrangeArr.length, m = l / 2; i < l; i++)
    {
      // 取前一半，放左侧
      if (i < m)
      {
        LORX = leftSecX;
      }
      else  //放右侧
      {
        LORX = rightSecX;
      }
      imgArrangeArr[i].pos = {
        left : this.getRangeRandom(LORX[0], LORX[1]),
        top : this.getRangeRandom(y[0], y[1])
      };
      imgArrangeArr[i].rotate = this.getRotateDeg();
      imgArrangeArr[i].isCenter = false;
      imgArrangeArr[i].isInverse = false;
    }

    // 合并数组,如果取了上方图
    if (topImg && topImg[0])
    {
      imgArrangeArr.splice(topImgIndex, 0, topImg[0]);
    }

    // 合并中心图
    imgArrangeArr.splice(centerIndex, 0, centerImg);

    // 更改所有组件状态重新加载页面视图，这很重要
    this.setState(
    {
      imgArrangeArr : imgArrangeArr
    });

  }


  // 加载后初始化位置范围值
  componentDidMount()
  {
     // 未初始化范围值，则初始化。   只有组件全加载完成后才能获取到。
    if (!this.inited)
    {
      // 获取舞台展示区大小
      let stage = ReactDOM.findDOMNode(this.refs.imgStage),
          stageWidth = stage.scrollWidth,
          stageHeight = stage.scrollHeight,
          halfStageW = Math.floor(stageWidth / 2),
          halfStageH = Math.floor(stageHeight / 2);

      // 获取图片大小
      let img = ReactDOM.findDOMNode(this.refs.img0),
          imgWidth = img.scrollWidth,
          imgHeight = img.scrollHeight,
          halfImgW = Math.floor(imgWidth / 2),
          halfImgH = Math.floor(imgHeight / 2);
      // 初始化范围值
      this.Constant.centerPos = {
        left : halfStageW - halfImgW,
        top : halfStageH - halfImgH
      };

      this.Constant.LRPosRange = {
        leftSecX : [-halfImgW, halfStageW - halfImgW * 3],
        rightSecX : [halfStageW + halfImgW, stageWidth - halfImgW],
        y : [-halfImgH, stageHeight - halfImgH]
      };

      this.Constant.MTPosRange = {
        x : [halfStageW - imgWidth, halfStageW],
        y : [-halfImgH, halfStageH - halfImgH * 3]
      };

      this.inited = true;
    }

    // 随机排布
    this.reArrange(0);
  }

  /*
    * 将reArrange(index)封装成闭包函数以供子组件调用,使触发点击的非中心图片居中
    * 注意要将this绑定到父组件上
    * @params index 触发点击的图片index
    * @return [function]，匿名执行reArrange(centerIndex)
    *
    * 另一种方式：
    * makeCenter(){ return (function(index){ this.reArrange(index); }.bind(this)) }
   */
  makeCenter(index)
  {
    return (function()
    {
      this.reArrange(index);
    }.bind(this))
  }

  //inverse翻转同理
  inverse(index)
  {
    return (function()
    {
      var tempImgStatus = this.state.imgArrangeArr;
      tempImgStatus[index].isInverse = !tempImgStatus[index].isInverse;
      this.setState(
      {
        imgArrangeArr : tempImgStatus
      });
    }.bind(this));
  }

  render() {

    let images = [];
    let ctrlUnits = [];
    imageDatas.forEach(function(item, index)
    {
      if (!this.state.imgArrangeArr[index])
      {
        this.state.imgArrangeArr[index] = {
          pos : {
            left : 0,
            top : 0
          },
          rotate : 0,
          isCenter : false,
          isInverse : false
        };
      }

      /*
        绑定this到父组件上实现为每个子组件传值
        子组件的点击函数，需要用到父组件的重排布函数，可以将父组件的函数封装成闭包函数，以返回值的形式
        传给子组件的属性，子组件便可通过闭包环境调用自身属性而使用父组件的函数
        beCenter={this.makeCenter(index)会立即执行this.makeCenter(index)函数，返回匿名函数给beCenter

        另一种方式是将子组件的index传给子组件，将reArrange(centerIndex)函数封装在一个带参(index)的匿名
        函数中，传给子组件属性，子组件在调用时再将自身的index传入从而实现reArrange。
        beCenter={this.makeCenter()}
        this.props.beCenter(this.props.selfIndex)
       */
      images.push(<ImageComponent key={index} data={item} ref={'img' + index} arrange={this.state.imgArrangeArr[index]}  beCenter={this.makeCenter(index)} inverse={this.inverse(index)} />);

      // 控制组件具有和图片组件几乎一样的行为，因此图片组件所需要的属性、行为，控制组件也一样需要
      ctrlUnits.push(<ControlButton key={index} arrange={this.state.imgArrangeArr[index]}  beCenter={this.makeCenter(index)} inverse={this.inverse(index)} />);

    }.bind(this));

    return (
      <section className="stage" ref="imgStage">
        <section className="img-sec">
          {images}
        </section>
        <nav className="ctrl-nav">
          {ctrlUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
