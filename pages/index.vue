<script setup lang="ts">
import {useLocalStorage} from "@vueuse/core";

const activeAudioElem = ref<HTMLAudioElement | null>(null)
const itemUpload = ref<File | null>(null)
const activeAudioFileHash = ref<string | null>();
const timestamp =  ref<string | null>();
const isLoading = ref(false)


onMounted(() => {
  if (activeAudioElem.value ) {


    // load file
    /*fetch(activeAudioElem.value.src)
        .then(response => response.blob())
        .then(blob => {
          // Once you have the Blob, you can generate the hash
          generateFileHash(blob).then(hash => {
            activeAudioFileHash.value = hash
            console.log('File Hash:', hash);
            const storage = useLocalStorage(hash, timestamp.value || '0')
            activeAudioElem.value.currentTime = storage.value ? Number(storage.value) : 0
            // Use the hash as needed
          });
        })
        .catch(error => {
          console.error('Error fetching audio file:', error);
        });*/
  }
})

/*const loadLatestAudio = () => {
  console.log('loadLatestAudio')
  const latestAudioFileHash = localStorage.getItem('latestAudioFile')
  if (latestAudioFileHash) {
    activeAudioFileHash.value = latestAudioFileHash
    loadA
    getTimestampFromLocalStorage()
    const storage = useLocalStorage(activeAudioFileHash.value)
    activeAudioElem.value.src = URL.createObjectURL(storage.value)
    activeAudioElem.value.currentTime = timestamp.value ? parseFloat(timestamp.value) : 0
  }
}*/

const generateFileHash = async (file: File) => {
  console.log('generateFileHash')
  const buffer = await file.arrayBuffer()
  const hash = await crypto.subtle.digest('SHA-256', buffer)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

const updateLocalStorage = () => {
  console.log('updateLocalStorage')
  if (activeAudioFileHash.value) {
    const storage = useLocalStorage(activeAudioFileHash.value, timestamp.value || '0')
    storage.value = String(timestamp.value || '0')
  }
}

const updateTime = () => {
  console.log('updateTime')
  if (activeAudioElem.value && !isLoading.value) {
    console.log('updateTime', activeAudioElem.value.currentTime)
    timestamp.value = String(activeAudioElem.value.currentTime)
    let storage = useLocalStorage(activeAudioFileHash.value, timestamp.value || '0')
    storage.value = String(timestamp.value || '0')

  }
}

const getTimestampFromLocalStorage = () => {
  console.log('getTimestampFromLocalStorage')
  if (activeAudioFileHash.value) {
    //const storage = useLocalStorage(activeAudioFileHash.value)
    timestamp.value = localStorage.getItem(activeAudioFileHash.value)
    //timestamp.value = storage.value
  }
}

const uploadAudio = async (e: Event) => {
  isLoading.value = true
  console.log('uploadAudio')
  const files = (e.target as HTMLInputElement).files

  if(!activeAudioElem.value) return

  if(files && files.length > 0) {
    const file = files[0]
    activeAudioFileHash.value =  await generateFileHash(file)
    getTimestampFromLocalStorage()
    itemUpload.value = file
    activeAudioElem.value.src = URL.createObjectURL(file)
    activeAudioElem.value.currentTime = timestamp.value ? parseFloat(timestamp.value) : 0
    useLocalStorage('latestAudioFile', activeAudioFileHash.value).value = activeAudioFileHash.value
    isLoading.value = false
  }
}
</script>

<template>
  <div class="wrapper">
    <h1 v-if="activeAudioFileHash">Home</h1>
    <input @change="uploadAudio" ref="itemUpload" type="file" />
    <audio @timeupdate="updateTime" ref="activeAudioElem" controls />
  </div>

</template>

<style scoped>
.wrapper{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;
}
</style>