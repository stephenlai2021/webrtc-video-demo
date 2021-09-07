import { ref, watchEffect } from "vue";
import { db, disk } from "src/boot/firebase";

const useCollection = (collection) => {
  const documents = ref(null);
  const error = ref(null);

  // references
  const collectionRef = db.collection(collection).orderBy("createdAt", "desc");

  const unsub = collectionRef.onSnapshot(
    (snap) => {
      // state.images = snap.docs.map(doc => {
      //   return { ...doc.data, id: doc.id }
      // })

      let results = [];
      snap.docs.forEach((doc) => {
        results.push({ ...doc.data(), id: doc.id });
      });

      // update values
      documents.value = results;
      error.value = null;
    },
    (err) => {
      console.log(err.message);
      documents.value = null;
      error.value = "could not fetch the data";
    }
  );

  watchEffect(onInvalid => {
    onInvalid(() => unsub())
  })

  return { documents, error };
};

export default useCollection;
