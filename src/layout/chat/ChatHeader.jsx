function ChatHeader({chatUser, groupChat, toggleDetail}) {
  return (
    <div className="flex items-center justify-between mb-4 border-b border-gray-600 pb-2">
      <div className="flex items-center">
        <img
          src={chatUser?.avatar || groupChat.avatar}
          alt="Chat Target"
          className="w-10 h-10 rounded-full mr-3"
        />
        <span className="font-bold">
          {chatUser?.username || groupChat.name}
        </span>
      </div>
      <div className="flex space-x-6 mr-5 text-gray-400">
        {/* <button className="hover:text-white">📞</button>
        <button className="hover:text-white">📹</button> */}
        <button className="hover:text-white" onClick={toggleDetail}>
          ℹ
        </button>
      </div>
    </div>
  );
}

export default ChatHeader;
