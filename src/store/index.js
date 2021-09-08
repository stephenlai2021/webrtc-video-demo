import { reactive, watchEffect } from "vue";
import { db, disk, timestamp } from "src/boot/firebase";

const state = reactive({
  // storeage
  url: null,
  error: null,
  progress: null,

  peerId: null,

  // firestore
  documents: null,
  documentsError: null
});

const methods = {
  useStorage(file, data) {
    watchEffect(() => {
      // references
      const storageRef = disk.ref(data + '/' + file.name)
      const collectionRef = db.collection(data)
  
      // upload file
      storageRef.put(file).on('state_changed', snap => {
        // update the progress as file uploads
        let percentage = (snap.bytesTransferred / snap.totalBytes) * 100

        state.progress = percentage
        console.log(state.progress)
      }, err => {
        state.error = err.message
      }, async () => {
        state.url = await storageRef.getDownloadURL()

        await collectionRef.add({
          createdAt: timestamp(),
          url: state.url,
        });
      })
    })
  },
  useCollection(collection) {
    // references
    const collectionRef = db
      .collection(collection)
      .orderBy("createdAt", "desc");

    const unsub = collectionRef.onSnapshot(snap => {
      // state.images = snap.docs.map(doc => {
      //   return { ...doc.data, id: doc.id }
      // })

      let results = []
      snap.docs.forEach(doc => {
        results.push({ ...doc.data(), id: doc.id })
      })

      state.documents = results
      state.documentsError = null
    }, err => {
      console.log(err.message)
      state.documents = []
      state.documentsError = 'could not fetch the data'
    })

    watchEffect((onInvalidate) => {
      onInvalidate(() => unsub())
    })
  }
}

const getters = {}

export default {
  state,
  methods,
  getters,
};
