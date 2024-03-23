import { defineStore } from 'pinia'
import type {AudioState} from '@/types/audio'
import { useCheckForDuplicate} from "@/composables/useCheckForDuplicate";


/*export const useAudioStore = defineStore({
    id: 'audio',
    state: () => ({
        songs: [] as AudioState[],
    }),

  actions: {
    addSong(song: AudioState) {
        this.songs.push(song)
    },
    removeSong(song: AudioState) {
        const index = this.songs.findIndex((s) => s.hash === song.hash)
        if (index !== -1) {
            this.songs.splice(index, 1)
        }
    },
      getSong(hash: string) {
            return this.songs.find((s) => s.hash === hash)
      }
  },

})*/

export const useAudioStore = defineStore('audio', {
    state: () => ({
        songs: [] as AudioState[],
    }),
    actions: {
        addSong(song: AudioState) {
            const duplicate = useCheckForDuplicate().checkForDuplicate(this.songs, song.hash)
            if (duplicate) {
                return
            }
            this.songs.push(song)
        },
        removeSong(song: AudioState) {
            const index = this.songs.findIndex((s) => s.hash === song.hash)
            if (index !== -1) {
                this.songs.splice(index, 1)
            }
        },
        getSong(hash: string) {
            return this.songs.find((s) => s.hash === hash)
        }
    },
    persist: true
})
