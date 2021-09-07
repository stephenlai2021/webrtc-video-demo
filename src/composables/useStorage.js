import { ref, watchEffect } from 'vue'
import { db, disk, timestamp } from 'src/boot/firebase'

const useStorage = (file, data) => {
  const url = ref(null)
  const error = ref(null)
  const progress = ref(null)

  watchEffect(() => {
    // references
    const storageRef = disk.ref(data + '/' + file.name)

    // upload file
    storageRef.put(file).on('state_changed', snap => {
      // update the progress as file uploads
      let percentage = (snap.bytesTransferred / snap.totalBytes) * 100

      progress.value = percentage
      console.log(progress.value)
    }, err => {
      error.value = err.message
    }, async () => {
      url.value = await storageRef.getDownloadURL()

      db.collection(data).add({
        createdAt: timestamp(),
        url: url.value
      })
    })
  })

  return {
    url,
    error,
    progress,
  }
}

export default useStorage