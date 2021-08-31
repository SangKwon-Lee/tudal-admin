import { KVQueryManager, KVWebsocketIO } from './manager';

export default class {
  constructor(connectionUrl, opts = {}) {
    this.format = opts.format && opts.format.toLowerCase();

    this.connectionUrl = connectionUrl;
    this.opts = opts;

    this.reconnection = this.opts.reconnection || false;
    this.reconnectionAttempts =
      this.opts.reconnectionAttempts || Infinity; // 재접속 횟수
    this.reconnectionDelay = this.opts.reconnectionDelay || 3000; // 재접속 시간 간격
    this.reconnectTimeoutId = 0;
    this.reconnectionCount = 0;
    this.isConnecting = false;
    this.queryManager = null;
    this.setSSL = true;
    var self = this;
  }

  connect(connectionUrl, opts = {}) {
    var tmp = connectionUrl.match(
      /^(wss?):\/\/([^:\/\s]+):([^\/]*)/i,
    );
    var protocol = tmp[1];
    var host = tmp[2];
    var port = tmp[3];

    if (!this.queryManager) {
      this.isConnecting = true;

      //this.queryManager = new KVQueryManager();
      this.queryManager = KVQueryManager;
      this.queryManager.setConnectCallback(
        this.onConnectedServer.bind(this),
      );
      this.queryManager.setClosedCallback(
        this.onClosedServer.bind(this),
      );

      //var bSSL = window.location.protocol === 'http:' ? false : true;
      var bSSL = false;
      if (protocol === 'wss') {
        bSSL = true;
      }

      // var nio = new KVWebsocketIO(this.queryManager, bSSL);
      // nio.protocols = 'wsmw-protocol';

      var nio = KVWebsocketIO;
      nio.setListener(this.queryManager);
      nio.setSSL(bSSL);
      nio.setProtocols('wsmw-protocol');

      this.queryManager.setNetworkIo(nio);
      this.queryManager.setQueryBuffer(
        12000,
        null,
        'utf-8',
        null,
        0x20,
      );
    }

    this.queryManager.startManager(host, port);
    console.log('[SocketManager] start manager');
    return this.queryManager;
  }

  addListener(fn) {
    this.listener = fn;
  }

  removeListener() {
    this.listener = null;
  }

  onConnectedServer() {
    console.log('Observer.onConnectedServer1');
    if (this.listener) {
      this.listener('Connected');
    }

    this.queryManager.clearAllRealCallbacks(); // 콜백 모두 제거 (unregisterReal가 동작하더라도 서버에 전송되지는 못함)

    if (this.reconnectTimeoutId != 0) {
      clearTimeout(this.reconnectTimeoutId);
    }
    this.isConnecting = false;
    if (
      this.reconnection &&
      this.queryManager.netIo.socket.readyState == 1
    ) {
      this.reconnectionCount = 0;
    }
  }

  onClosedServer() {
    if (this.listener) {
      this.listener('Closed');
    }
    console.log('Observer.onClosedServer');
  }

  reconnect() {
    if (this.reconnectionCount < this.reconnectionAttempts || true) {
      // 재접속시도 횟수 제한이 필요할 경우 || true 제거
      this.reconnectionCount++;

      console.log('--------ReconnectServer--------');
      console.log('reconnectionCount :', this.reconnectionCount);

      this.connect(this.connectionUrl, this.opts);
    }
  }

  checkPolling() {
    this.queryManager.pollingProcess(); //KVQueryManager.pollingReqCnt
    this.queryManager.pollingReqCnt++;
  }
}
