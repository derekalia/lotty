import React, { Component } from 'react';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {
  state = { manager: '', players: [], balance: '', value: 0, message: '' };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    //print out the balance which is how much money is at stake to win
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  // pickWinner(){
  //   lottery.methods.pickWinner().call()
  // }

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'waiting on transaction success' });

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: ' success' });

  };

  onSubmit = async event => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'waiting on transaction success' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: 'you have been entered' });
  };

  render() {
    console.log(web3.version);
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>this contract is managed by {this.state.manager}</p>
        <p>
          there are currently {this.state.players.length} people competeting to win{' '}
          {web3.utils.fromWei(this.state.balance, 'ether')} ether.
        </p>

        <form onSubmit={this.onSubmit}>
          <h4>want to try your luck</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input value={this.state.value} onChange={event => this.setState({ value: event.target.value })} />
          </div>
          <button>Enter</button>
        </form>

        <div>
          <h1>{this.state.message}</h1>
        </div>

        <div>
          <div>
            Time to pick a winner?
            <button onClick={this.onClick}>Pick 'Em</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
