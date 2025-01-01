import { Modal } from '@arco-design/web-vue';

interface ConfirmOptions {
    message: string;
    okfun?: () => void;
    showCancelBtn?: boolean;
    okText?: string;
}

const confirm = ({ message, okfun, showCancelBtn = true, okText = '确定' }: ConfirmOptions) => {
    Modal.confirm({
        title: '提示',
        content: message,
        okText: okText,
        cancelText: '取消',
        hideCancel: !showCancelBtn, // 是否隐藏取消按钮
        onOk: () => {
            if (okfun) {
                okfun();
            }
        },
        onCancel: () => {
            // 可以在这里处理取消事件
        },
    });
};

export default confirm;
