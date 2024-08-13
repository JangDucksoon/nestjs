import { jwtDecode, type JwtPayload } from "jwt-decode";
import { progress, serverProgress } from "../store"
import { axiosInstance } from "./axiosConfig";

export const commonModule = {
    currentProgress: 0,
    currentServerProgress: 0,
    intervalFunc: null as null | NodeJS.Timeout,
    intervalServerFunc: null as null | NodeJS.Timeout,
    increaseProgress: (time: number = 10, type:string = 'normal') => {
        if (type === 'normal') {
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
        } else if (type ==='server') {
            if (commonModule.intervalServerFunc !== null) return;

            const unsubscribes = serverProgress.subscribe((value) => {
                commonModule.currentServerProgress = value;
            });
            
            const updateProgress = () => {
                if (commonModule.currentServerProgress >= 100) {
                    commonModule.destroyProgress();
                    unsubscribes();
                } else {
                    serverProgress.update(n => n + 1);
                }
            }

            commonModule.intervalServerFunc = setInterval(updateProgress, time);
        }
    },
    destroyProgress: () => {
        progress.set(0);
        serverProgress.set(0);

        if (commonModule.intervalFunc !== null) {
            clearInterval(commonModule.intervalFunc);
            commonModule.intervalFunc = null;
        }

        if (commonModule.intervalServerFunc !== null) {
            clearInterval(commonModule.intervalServerFunc);
            commonModule.intervalServerFunc = null;
        }
    },
    filterHangleAndSpace: (evt: Event) => {
        const input = evt.target as HTMLInputElement
        const value = input.value;
        const filterValue = value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣| ]/g, '');

        input.value = filterValue;
    },
    coonvertToNumber: (evt: Event) => {
        const input = evt.target as HTMLInputElement;
        input.value = input.value.replace(/[^\d,]/g, '');
    },
    decodeJwtToken: (token: string|null|undefined) => {
        if (!token) return null;
        return jwtDecode(token);
    },
    checkAdministrator: () => {
        const user: any = commonModule.decodeJwtToken(localStorage.getItem('accessToken'));
        
        if (user?.auth === 'sys') {
            return true;
        } else {
            return false;
        }
    },
    verifyToken: async (callback: Function) => {
        try {
            const res = await axiosInstance.get('/auth/verifyToken');

            if (res.status === 200) {
                if (callback) {
                    callback();
                }
            }
        } catch (error) {
            
        }
    }
}