// import React, { useState, useRef } from 'react';
// import SocketManager from './SocketManager/index';

// export const SocketServer = {
//   aws: {
//     url: 'ws://52.79.85.51:4789',
//   },
//   koscom: {
//     url: 'ws://103.244.111.251:4789',
//   },
// };

// export const SocketContext = React.createContext({
//   queryManager: null,
//   listener: null,
//   connected: false,
//   reconnect: null,
// });

// function SocketProvider(props) {
//   const observer = useRef({});
//   const queryManager = useRef({});
//   const [connected, setConnected] = useState(false);

//   // React.useEffect(() => {
//   //   console.log('SOCKET!!!');
//   //   observer.current = new SocketManager();
//   //   queryManager.current = observer.current.connect(
//   //     SocketServer.koscom.url,
//   //   );
//   //   observer.current?.addListener(listener);
//   //   return () => {
//   //     observer.current?.removeListener();
//   //   };
//   // }, []);

//   const reconnect = () => {
//     if (!observer.current) {
//       observer.current = new SocketManager();
//     }
//     queryManager.current = observer.current.connect(
//       SocketServer.koscom.url,
//     );
//     observer.current?.addListener(listener);
//   };

//   const listener = (event) => {
//     if (event === 'Connected') {
//       console.log('[SocketProvider] CONNECTED');
//       setConnected(true);
//     } else {
//       setConnected(false);
//       queryManager.current = observer.current.connect(
//         SocketServer.koscom.url,
//       );
//       console.log('[SocketProvider] DISCONNECTED - RECONNECT');
//     }
//   };

//   return (
//     <SocketContext.Provider
//       value={{
//         queryManager,
//         listener,
//         connected,
//         reconnect,
//       }}
//     >
//       {props.children}
//     </SocketContext.Provider>
//   );
// }

// export default React.memo(SocketProvider);
