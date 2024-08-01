import Swal from "sweetalert2";

const messageModule = {
    alert: (text: string, callback: Function|null, iconType: 'success'|'error'|'warning'|'info'|'question' = 'success') => {
        Swal.fire({
            html: text,
            icon: iconType,
            allowOutsideClick: false,
            didDestroy: () => {
                if (callback && callback instanceof Function) {
                    callback();
                }
            }
        });
    },
    confirm: (text: string, callback: Function|null, confirmText: string = '확인', cancelText: string = '취소') => {
        Swal.fire({
            html: text,
            icon: 'question',
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: confirmText,
            cancelButtonText: cancelText
        }).then(res => {
            if (callback && callback instanceof Function) {
                callback(res.value === true ? true : false);
            }
        });
    },
    error: (text: string, callback: Function|null) => {
        Swal.fire({
            html: text,
            icon: 'error',
            allowOutsideClick: false
        }).then(res => {
            if (callback && callback instanceof Function) {
                callback();
            }
        })
    },
    toast: (text: string, timer: number) => {
        Swal.fire({
            html: text,
            toast: true,
            position: 'center',
            showConfirmButton: false,
            timer: (timer??1500),
            timerProgressBar: true,
            customClass: {
                container: 'swal2-toast-container',
                popup: 'swal2-toast-popup',
                htmlContainer: 'swal2-toast-html-container',
                timerProgressBar: 'swal2-toast-progress'
            },
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
                toast.addEventListener('click', () => Swal.close());
            }
        });
    },
    reason: (text: string, callback: Function|null) => {
        Swal.fire({
            title: text,
            input: "text",
            inputAttributes: {
              autocapitalize: "off"
            },
            showCancelButton: true,
            confirmButtonText: "확인",
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (callback && callback instanceof Function) {
                if (result.isConfirmed) {
                    callback(result);
                }
            }
        });
    }
}

export default messageModule;