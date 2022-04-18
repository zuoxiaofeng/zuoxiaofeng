import React from 'react';
import './App.scss';

class ItemProps {
  op1 = 0;
  op = "+";
  op2 = 0;
  done = (right: Boolean) => { };
}
class Item extends React.Component<ItemProps, { ret: String, right: Boolean, done: Boolean }> {
  constructor(props: ItemProps) {
    super(props);
    this.state = {
      ret: "",
      right: false,
      done: false,
    }
  }
  inputRet(e: React.ChangeEvent<{ value: String }>) {
    this.setState(
      {
        ret: e.target.value
      }
    )
  }

  rightRet() {
    if (this.props.op === "+") {
      return this.props.op1 + this.props.op2;
    }
    else {
      return this.props.op1 - this.props.op2;
    }
  }

  setDone() {
    if (this.state.ret === '' || this.state.done) {
      return;
    }
    const nRet = Number(this.state.ret)
    if (!isNaN(nRet)) {
      var right = this.rightRet() === nRet;
      this.setState({ right: right, done: true })
      this.props.done(right);
    }
  }
  componentDidUpdate(prevProps: ItemProps) {
    if (prevProps !== this.props) {
      this.setState({
        ret: "",
        right: false,
        done: false,
      })
    }
  }
  render(): React.ReactNode {
    var checkRet = () => {
      if (this.state.done) {
        if (this.state.right) {
          return (<div className='op-right'>√</div>)
        }
        else {
          return (<div className='op-wrong'>× <span className='op-right-ret'>正确答案:{this.rightRet()}</span> </div>)
        }
      }
      else {
        return (<div></div>)
      }
    };

    return <div className="cal-item">
      <div className="op-item">{this.props.op1}</div>
      <div className="op">{this.props.op}</div>
      <div className="op-item">{this.props.op2}</div>
      <div className='op'>=</div>
      <input className="op-ret" type="text" value={this.state.ret.toString()} disabled={this.state.done === true} onChange={this.inputRet.bind(this)} onBlur={this.setDone.bind(this)} />
      {checkRet()}
    </div>
  }
}

class App extends React.Component<{}, { nCount: Number }> {
  constructor() {
    super({})
    this.state = {
      nCount: 5,
    }
  }

  nRight = 0;
  nWrong = 0;
  awardTarget = "https://www.bilibili.com/bangumi/play/ss41321?spm_id_from=333.337.0.0";
  saveRet(right: Boolean) {
    console.log(window.location.href.split('?')[1])
    if (right) {
      this.nRight++;
    }
    else {
      this.nWrong++;
    }
    console.log(this.nRight)
    if (this.nRight === this.state.nCount) {
      console.log("right")
      window.open(this.awardTarget, "_blank")
    }
  }

  setCount(e: React.ChangeEvent<{ value: String }>) {
    this.nRight = 0;
    this.nWrong = 0;
    this.setState({ nCount: Number(e.target.value) })
  }

  render(): React.ReactNode {
    const items = () => {
      var its = []
      for (var i = 0; i < this.state.nCount; ++i) {
        let op = '+';
        let op1 = 0;
        let op2 = 0;
        if (Math.random() > 0.3) {
          op = '-'
          op1 = Math.floor(Math.random() * 16) + 4
          op2 = Math.floor(op1 * Math.random()) + 1;
        }
        else {
          op1 = Math.floor(Math.random() * 20)
          op2 = Math.floor((20 - op1) * Math.random());
        }

        its.push(<Item key={i} op={op} op1={op1} op2={op2} done={this.saveRet.bind(this)}></Item>)
      }
      return (its)
    }
    return (
      <div className="App">
        <input type="text" id="award_target" onChange={
          (e: React.ChangeEvent<{ value: string }>) => { this.awardTarget = e.target.value }
        } />
        <select name="count" id="item_count" value={this.state.nCount.toString()} onChange={this.setCount.bind(this)}>
          <option value="5">5</option>
          <option value="10">10</option>
        </select>
        {items()}
      </div>
    );
  }
}

export default App;
