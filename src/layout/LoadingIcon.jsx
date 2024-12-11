import { FaSpinner } from "react-icons/fa";

const LoadingIcon = () => (
  <div className="flex justify-center items-center h-12 w-12">
    <FaSpinner className="animate-spin text-gray-400 text-xl" />
  </div>
);

export default LoadingIcon;
