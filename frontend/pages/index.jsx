import { BigNumber, Contract, providers, utils } from 'ethers';
import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import Web3Modal from 'web3modal';
import { BMAC_CONTRACT_ABI, BMAC_CONTRACT_ADDRESS } from '../constants/buyMeACoffee';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [memos, setMemos] = useState([]);

  const web3ModalRef = useRef();

  const onNameChange = event => {
    setName(event.target.value);
  };

  const onMessageChange = event => {
    setMessage(event.target.value);
  };

  const getProviderOrSigner = async () => {
    try {
      // Connect to Metamask
      // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);
      console.log('web3Provider...', web3Provider);

      // If user is not connected to the Goerli network, let them know and throw an error
      const { chainId } = await web3Provider.getNetwork();
      if (chainId !== 5) {
        window.alert('Change the network to goerli');
        throw new Error('Change network to goerli');
      }

      const signer = web3Provider.getSigner();
      const contract = new Contract(BMAC_CONTRACT_ADDRESS, BMAC_CONTRACT_ABI, signer);
      
      setWalletConnected(true);

      return { web3Provider, signer, contract };
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    await getProviderOrSigner();
  };

  const buyCoffee = async amount => {
    try {
      const { contract } = await getProviderOrSigner();
      if (contract) {
        const coffeeTxn = await contract.buyMeACoffee(
          name ? name : 'Akshay',
          message ? message : 'Enjoy your coffee!',
          { value: utils.parseEther(amount) },
        );
        await coffeeTxn.wait();

        setName('');
        setMessage('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMemos = async () => {
    try {
      const { contract } = await getProviderOrSigner();
      if (contract) {
        const memos = await contract.getMemos();
        setMemos(memos);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: 'goerli',
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }

    getMemos();
    async function newMemo(timestamp, amount, donater, name, message) {
      console.log('Memo received: ', donater, amount, timestamp, name, message);
      setMemos(prevState => [
        ...prevState,
        {
          address: donater,
          timestamp: timestamp,
          amount: amount,
          message,
          name,
        },
      ]);
    }
    let buyMeACoffee;
    const { ethereum } = window;

    if (ethereum) {
      const provider = new providers.Web3Provider(ethereum, 'goerli');
      const signer = provider.getSigner();

      buyMeACoffee = new Contract(BMAC_CONTRACT_ADDRESS, BMAC_CONTRACT_ABI, signer);
      // Listen for new memo events.
      buyMeACoffee.on('MemoAdded', newMemo);
    }

    return () => {
      if (buyMeACoffee) {
        buyMeACoffee.off('MemoAdded', newMemo);
      }
    };
  }, []);
  return (
    <div>
      <Head>
        <title>Buy Nisha a Coffee!!!</title>
        <meta name="description" content="Tipping-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Buy Nisha a Coffee!</h1>
          <div className={styles.description}>You can donate ethers to Nisha here and can send a message along</div>
          {walletConnected ? (
            <div>
              <form>
                <div className="formgroup">
                  <label>Name</label>
                  <br />

                  <input
                    id="name"
                    type="text"
                    placeholder="John"
                    value={name}
                    onChange={onNameChange}
                    style={{ width: '100%', margin: '10px 0px' }}
                  />
                </div>
                <br />
                <div className="formgroup">
                  <label>Send Nisha a message</label>
                  <br />

                  <textarea
                    rows={4}
                    placeholder="Enjoy your coffee!"
                    id="message"
                    value={message}
                    onChange={onMessageChange}
                    required
                    style={{ width: '100%', margin: '10px 0px' }}
                  ></textarea>
                </div>
                <div>
                  <button type="button" onClick={() => buyCoffee('0.001')} className={styles.button}>
                    Send 1 Coffee for 0.001ETH
                  </button>
                  <button type="button" onClick={() => buyCoffee('0.003')} className={styles.button}>
                    Buy Large Coffee for 0.003ETH
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button onClick={connectWallet} className={styles.button}>
              {' '}
              Connect your wallet{' '}
            </button>
          )}
        </div>
        <div>
          <img className={styles.image} src="./nisha.jpg" />
        </div>
      </div>
      <div className={styles.memo}>
        {walletConnected && <h1>Memos received</h1>}

        {walletConnected &&
          memos.map((memo, idx) => {
            return (
              <div key={idx} className={styles.memoItem}>
                <p style={{ 'fontWeight': 'bold' }}>"{memo.message}"</p>
                <p>
                  From: {memo.name} at {memo.timestamp.toString()}
                </p>
              </div>
            );
          })}
      </div>

      <footer className={styles.footer}>Made with &#10084; by Nisha for Road to Web3</footer>
    </div>
  );
}
