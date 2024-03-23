import type {AudioState} from '@/types/audio'

export const useCheckForDuplicate = () => {
    const checkForDuplicate = (array: AudioState[], hash:string) => {
        return array.some((item) => item.hash=== hash);
    };
    return { checkForDuplicate };
}