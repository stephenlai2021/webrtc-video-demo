# WebRTC / Peer.js 

### Step 1

創建一個 peer instance, 和 Peer Server 建立連線 - 這裡我們指定 host 和 port, 啟動自建的 Peer Server
```
const peer = new Peer({
  undefined, {
    host: '/',
    port: 3001
  }
})
```

如果不指定參數, 建立自己的 Peer Server, 就是使用默認的 Peer Server
```
const peer = new Peer()
```

---

### Step 2

和 Peer Server 建立連線後, 會得到一個 id, 我們可以監聽 'open' 事件, 印出 id
```
peer.on('open', id => {
  console.log('user connected: ', id)
})
```

Note: 一個 peer 代表一個視窗, 開啟五個視窗就有五個 peer

---

### Step 3 - 獲取影像

```
navigator
  .mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then(stream => {

    <!-- 我方 -->
    <!-- 顯示串流 -->     
    localVideo.srcObject = stream

    <!-- 撥電話給對方 - 把我方串流傳送給對方  -->
    const call = peer.call(otherUserId, localVideoStream)

    <!-- 接收對方串流 -->
    call.on('stream', remoteStream => {
      remoteVideo.srcObject = remoteVideoStream
    })

    <!-- 對方 -->
    <!-- 偵聽 call 事件 -->
    peer.on('call', call => {

      <!-- 回應對方串流 -->
      call.answer(stream)

      <!-- 偵聽串流事件, 顯示對方串流 -->
      call.on('stream', remoteVideoStream => {
        remoteVideo.srcObject = remoteVideoStream
      })
    })
  })


```