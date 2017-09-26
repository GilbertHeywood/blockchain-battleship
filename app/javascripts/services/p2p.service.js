import { default as io } from 'socket.io-client';
import { default as Socketiop2p} from 'socket.io-p2p';

class P2PService {
  constructor() {
    this.privateButton = {};
    let socket = io('http://localhost:3000');
    let opts = {peerOpts: {trickle: false}, autoUpgrade: false};
    this.p2psocket = new Socketiop2p(socket, opts, () =>  {
      this.privateButton.disabled = false
      this.p2psocket.emit('peer-obj', 'Hello there. I am ' + this.p2psocket.peerId)
    });
    this.p2psocket.on('peer-msg',  (data) => {
      console.log(data);
    })

    this.p2psocket.on('go-private',  () => {
      this.goPrivate()
    });
  }
  goPrivate () {
    if(!this.privateButton.disabled){
      this.p2psocket.useSockets = false;
      this.privateButton.disabled = true;
      this.p2psocket.emit('go-private', true);
    }
  }
  senddata(value){
    this.p2psocket.emit('peer-msg', {textVal: value});
  }
}

P2PService.$inject = [];

export default P2PService;