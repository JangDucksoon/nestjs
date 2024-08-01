import { progress } from "../store"

export const commonModule = {
    currentProgress: 0,
    intervalFunc: null as null | NodeJS.Timeout,
    increaseProgress: (time: number = 10) => {
        if (commonModule.intervalFunc !== null) return;

        const unsubscribes = progress.subscribe((value) => {
            commonModule.currentProgress = value;
        });
        
        const updateProgress = () => {
            if (commonModule.currentProgress >= 100) {
                commonModule.destroyProgress();
                unsubscribes();
            } else {
                progress.update(n => n + 1);
            }
        }

        commonModule.intervalFunc = setInterval(updateProgress, time);
    },
    destroyProgress: () => {
        progress.set(0);
        if (commonModule.intervalFunc !== null) {
            clearInterval(commonModule.intervalFunc);
            commonModule.intervalFunc = null;
        }
    }
}