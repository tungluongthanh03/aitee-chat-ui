// ChatApp.js
import React, { useState } from 'react';
import "./styles/global.css";
import Sidebar from './layout/Sidebar';
import ChatWindow from './layout/ChatWindow';
import { useSelector } from 'react-redux';

const ChatApp = () => {
  const [currentUser, setCurrentUser] = useState({
    username: 'tunn_03',
    avatar: 'https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpg',
  });

  const [onlineUsers, setOnlineUsers] = useState([
    { id: 1, avatar: 'https://scx2.b-cdn.net/gfx/news/hires/2022/hawk.jpg' },
    { id: 2, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu4-n38DUyT4kF8_Ga46xx5qGh4VH4_8goQQ&s' },
    { id: 3, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-4THL3Qr6SfLCdBuAXX3L9FC5DbN8WUVwJw&s' },
    { id: 4, avatar: 'https://cdn.pixabay.com/photo/2024/04/24/19/01/ai-generated-8718371_960_720.png' },
    { id: 5, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV14dpvXjAkUxAHViayqoD4FXkKE1rmZ_lLQ&s' },
    { id: 6, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx8LVPj7aJvEZBdasZvSnvcdQbflPtc7P0cw&s' },
    { id: 7, avatar: 'https://cdn.pixabay.com/photo/2024/04/24/19/01/ai-generated-8718371_960_720.png' },
    { id: 8, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu4-n38DUyT4kF8_Ga46xx5qGh4VH4_8goQQ&s' },
    { id: 9, avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-4THL3Qr6SfLCdBuAXX3L9FC5DbN8WUVwJw&s' },
    // ... other online users
  ]);

  const [chattedUsers, setChattedUsers] = useState([
    { id: 1, username: 'Dogg_007', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB', latestMessage: 'good night!' },
    { id: 2, username: 'Dogg_007', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB', latestMessage: 'good night!' },
    { id: 3, username: 'Dogg_007', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB', latestMessage: 'good night!' },
    { id: 4, username: 'Dogg_007', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB', latestMessage: 'good night!' },
    { id: 5, username: 'Dogg_007', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB', latestMessage: 'good night!' },
    { id: 6, username: 'Dogg_007', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB', latestMessage: 'good night!' },
    { id: 7, username: 'Dogg_007', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB', latestMessage: 'good night!' },
    { id: 8, username: 'Dogg_007', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB', latestMessage: 'good night!' },
    // ... other chatted users
  ]);

  // const [selectedUser, setSelectedUser] = useState({
  //   username: 'Dogg_007',
  //   avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB',
  // });

  const selectedUser = useSelector((state) => state.chatUser);

  const [messages, setMessages] = useState([
    { sender: 'Dogg_007', content: 'Chào Tùng, làm gì đó?', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB' },
    { sender: 'me', content: 'Làm đồ án cnpm nè', avatar: 'path-to-my-avatar' },
    { sender: 'me', content: 'Làm đồ án cnpm nè', avatar: 'path-to-my-avatar' },
    { sender: 'me', content: 'Làm đồ án cnpm nè', avatar: 'path-to-my-avatar' },
    { sender: 'Dogg_007', content: 'Chào Tùng, làm ghttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFBhttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFBhttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFBhttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFBhttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFBì đó?', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB' },
    { sender: 'me', content: 'Làm đồ ánhttps://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpghttps://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpghttps://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpghttps://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpghttps://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpghttps://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpghttps://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpghttps://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpghttps://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpg cnpm nè', avatar: 'path-to-my-avatar' },
    { sender: 'Dogg_007', content: 'Chào Tùng, làm gì đó?', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB' },
    { sender: 'me', content: 'Làm đồ án cnpm nè Làm đồ án cnpm nèLàm đồ án cnpm nèLàm đồ án cnpm nèLàm đồ án cnpm nèLàm đồ án cnpm nèLàm đồ án cnpm nèLàm đồ án cnpm nèLàm đồ án cnpm nèLàm đồ án cnpm nèLàm đồ án cnpm nèLàm đồ án cnpm nèLàm đồ án cnpm nèLàm đồ án cnpm nèLàm đồ án cnpm nèLàm đồ án cnpm nèLàm đồ án cnpm nèLàm đồ án cnpm nè', avatar: 'path-to-my-avatar' },
    { sender: 'Dogg_007', content: 'Chào Tùng, làm gì đó?', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB' },
    { sender: 'me', content: 'Làm đồ án cnpm nè', avatar: 'path-to-my-avatar' },
    { sender: 'Dogg_007', content: 'Chào Tùng, làm gì đó?', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB' },
    { sender: 'me', content: 'Làm đồ án cnpm nè', avatar: 'path-to-my-avatar' },
    { sender: 'Dogg_007', content: 'Chào Tùng, làm gì đó?', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB' },
    { sender: 'me', content: 'Làm đồ án cnpm nè', avatar: 'path-to-my-avatar' },
    { sender: 'Dogg_007', content: 'Chào Tùng, làm gì đó?', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB' },
    { sender: 'me', content: 'Làm đồ án cnpm nè', avatar: 'path-to-my-avatar' },
    { sender: 'Dogg_007', content: 'Chào Tùng, làm gì đó?', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB' },
    { sender: 'me', content: 'Làm đồ án cnpm nè', avatar: 'path-to-my-avatar' },
    { sender: 'Dogg_007', content: 'Chào Tùng, làm gì đó?', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB' },
    { sender: 'me', content: 'Làm đồ án cnpm nè', avatar: 'path-to-my-avatar' },
    { sender: 'Dogg_007', content: 'Chào Tùng, làm gì đó?', avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyXeKDN29AmZgZPLS7n0Bepe8QmVappBwZCeA3XWEbWNdiDFB' },
    { sender: 'me', content: 'trời hôm nay nhiều mây cực, đặt bàn tay mình ngay ngực, nghe con tim mình xóc nảy, chiều mướt mải làn tóc bay. Tâm cứ tựa như bánh tráng, mỏng và có màu cánh dán, không muốn lòng cứ âm u, giữa căn phòng nhiều ánh sáng.', avatar: 'path-to-my-avatar' },
    // ... other messages
  ]);

  return (
    <div className="flex h-screen mx-2">
      <Sidebar currentUser={currentUser} chattedUsers={chattedUsers} onlineUsers={onlineUsers} />
      <ChatWindow chatUser={selectedUser} messages={messages} />
    </div>
  );
};

export default ChatApp;
