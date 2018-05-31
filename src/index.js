import { default as Web3 } from "web3";
import { default as contract } from "truffle-contract";
import React from 'react';
import ReactDOM from 'react-dom';
import MyToken from "../build/contracts/MyToken.json";
import "./styles/index.scss";

const MyTokenContract = contract(MyToken);

class SendMyTokens extends React.Component {

    constructor(props) {
        super(props);

        this.currentAccount = null;

        this.state = {
            balance: 0,
            address: '',
            amount: 0
        };

        this.changeAddress = this.changeAddress.bind(this);
        this.changeAmount = this.changeAmount.bind(this);
        this.sendTokens = this.sendTokens.bind(this);
    }

    componentWillMount() {
        if (typeof web3 !== "undefined") {
            web3 = new Web3(web3.currentProvider);
        }
        else {
            web3 = new Web3(
                new Web3.providers.HttpProvider("http://localhost:9545")
            );
        }

        MyTokenContract.setProvider(web3.currentProvider);
        web3.eth.getAccounts((err, accounts) => {
            this.currentAccount = accounts[0];
            
            if (!this.currentAccount) {
                alert('Error: No logged in account found');
            }
            else {
                MyTokenContract.deployed().then(instance => {
                    instance.balanceOf(this.currentAccount).then(res => {
                        this.setState({
                            balance: res.c['0']
                        });
                    });
                });
            }
        });
    }

    changeAddress(event) {
        this.setState({
            address: event.target.value
        });
    }

    changeAmount(event) {
        this.setState({
            amount: event.target.value
        });
    }

    sendTokens() {
        if (this.state.address.length !== 42) {
            alert('Address is incorrect');
            return;
        }
        if (this.state.amount === 0) {
            alert('Amount cannot be 0');
            return;
        }

        MyTokenContract.deployed().then(instance => {
            instance.transfer(this.state.address, this.state.amount, { from: this.currentAccount }).then(res => {
                this.setState({
                    balance: this.state.balance - res.logs['0'].args.value.c['0']
                });
            }).catch((err) => {
                console.log(err);
            })
        });
    }

    render() {
        return (
            <div className='center'>
                <h1>Send MyTokens</h1>
                <h2>Balance: {this.state.balance}</h2>
                <label htmlFor='address'>Address:</label>
                <input id='address' onChange={this.changeAddress.bind(this)} value={this.state.address || ''} />
                <br/>
                <label htmlFor='amount'>Amount:</label>
                <input id='amount' type='number' onChange={this.changeAmount.bind(this)} value={this.state.amount || '0'} />
                <br/>
                <button id='button-send' onClick={this.sendTokens}>Send</button>
            </div>
        );
    }
}

ReactDOM.render(<SendMyTokens />, document.getElementById('root'));
