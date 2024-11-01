import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Sidebar({ onUserSelect }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 20; // Number of users per page

  // const fetchUsers = async () => {
  //   if (loading || !hasMore) return;

  //   setLoading(true);
  //   try {
  //     const response = await axios.get('/chats/users', {
  //       params: { limit, offset }
  //     });
  //     setUsers(prevUsers => [...prevUsers, ...response.data]);
      
  //     if (response.data.length < limit) {
  //       setHasMore(false);  // No more users to fetch
  //     }
  //     setOffset(prevOffset => prevOffset + limit); // Increment offset for next fetch
  //   } catch (error) {
  //     console.error("Error fetching users: ", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchUsers();  // Fetch initial user list
  // }, []);

  useEffect(() => {
    const handleScroll = (e) => {
      const { scrollTop, clientHeight, scrollHeight } = e.target;
      if (scrollHeight - scrollTop === clientHeight) {
        // fetchUsers();  // Fetch more users when scrolled to the bottom
        console.log('Fetching more users...');
      }
    };

    const sidebar = document.querySelector('.sidebar');
    sidebar.addEventListener('scroll', handleScroll);

    return () => {
      sidebar.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, loading]);

  return (
    <div className="sidebar bg-gray-100 w-1/4 h-full border-r overflow-y-auto" style={{ maxHeight: '400px' }}>
      <h2 className="text-lg font-bold p-4">Chats</h2>
      <ul>
        {users.map(user => (
          <li
            key={user.userId}
            className="p-4 hover:bg-gray-200 cursor-pointer"
            onClick={() => onUserSelect(user.userId)}  // Trigger chat window when clicked
          >
            User {user.userId}  {/* Replace with actual user details */}
          </li>
        ))}
      </ul>
      {loading && <p className="p-4 text-center">Loading more users...</p>}
    </div>
  );
};

export default Sidebar;
