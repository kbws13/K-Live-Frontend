import message from "@arco-design/web-vue/es/message";

const Message = {
    success: (msg: string, callback?: Function) => {
        message.success({
            id: 'successId',
            content: msg,
            duration: 2000,
            onClose: () => {
                if(callback) {
                    callback();
                }
            }
        })
    },
    warning: (msg: string, callback?: Function) => {
        message.warning({
            id: 'warningId',
            content: msg,
            duration: 2000,
            onClose: () => {
                if(callback) {
                    callback();
                }
            }
        })
    },
    error: (msg: string, callback?: Function) => {
        message.error({
            id: 'errorId',
            content: msg,
            duration: 2000,
            onClose: () => {
                if(callback) {
                    callback();
                }
            }
        })
    },
}

export default Message;