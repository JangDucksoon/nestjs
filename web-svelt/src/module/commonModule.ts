import { jwtDecode, type JwtPayload } from "jwt-decode";
import { progress } from "../store"
import { axiosInstance } from "./axiosConfig";

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
    },
    isDate: function (date: string) {
        if (!date) {
            return false;
        }
        
        const dateStr:string = date.toString().replace(/[/.-]/g, "");
        
        if (!dateStr) {
            return false;
        }
        
        if (dateStr.length != 8) {
            return false;
        }

        if (isNaN(parseInt(dateStr))) {
            return false;
        }
        
        var dtYear: number = parseInt(dateStr.substring(0, 4));
        var dtMonth: number = parseInt(dateStr.substring(4, 6));
        var dtDay: number = parseInt(dateStr.substring(6, 8));
        
        if (dtMonth < 1 || dtMonth > 12) {
            return false;
        } else if (dtDay < 1 || dtDay > 31) {
            return false;
        } else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31) {
            return false;
        } else if (dtMonth == 2) {
            const isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay > 29 || (dtDay == 29 && !isleap)) {
                return false;
            }
        }
        
        return true;
    },
    isNumeric: (value: string|number) => {
        return !isNaN(parseFloat(value.toString()));
    },
    filterHangleAndSpace: (evt: Event) => {
        const input = evt.target as HTMLInputElement
        const value = input.value;
        const filterValue = value.replace(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣| ]/g, '');

        input.value = filterValue;
    },
    coonvertToNumber: (evt: Event) => {
        const input = evt.target as HTMLInputElement;
        input.value = input.value.replace(/\D/g, '');
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