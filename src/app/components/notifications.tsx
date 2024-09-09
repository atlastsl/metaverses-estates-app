import { toast, Id, TypeOptions } from 'react-toastify';

export const NOTIFICATION_SUCCESS : TypeOptions = 'success';
export const NOTIFICATION_WARNING : TypeOptions = 'warning';
export const NOTIFICATION_ERROR : TypeOptions = 'error';
export const NOTIFICATION_INFO : TypeOptions = 'info';

export function ShowNotification (type: TypeOptions, message: string, autoClose?: number): Id {
    return (
        toast(
            <div>
                <span className="text-center">{message}</span>
            </div>,
            {
                position: "top-right",
                autoClose: autoClose != null ? autoClose : 6000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                type: type
            }
        )
    )
}