import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function NotificationAlert() {
  return (
    <>
      <ToastContainer position="bottom-right" newestOnTop={true} theme="light" />
    </>
  );
}
