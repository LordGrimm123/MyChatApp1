import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Send, LogOut, KeyRound, User, Tag } from 'lucide-react'; // Importing icons

function App() {
  const [usernameInput, setUsernameInput] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [error, setError] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null); // Stores the currently logged-in user's data
  const messagesEndRef = useRef(null);

  // Pre-defined users and their default passwords/display names
  // This data will be loaded into localStorage on first run if not present
  const defaultUsers = {
    ryan: { password: 'Ryo123', displayName: 'Ryan', email: 'ryan@chat.com' },
    guest: { password: 'Ryo123', displayName: 'Guest', email: 'guest@chat.com' },
    guest1: { password: 'Ryo123', displayName: 'Guest1', email: 'guest1@chat.com' },
    guest2: { password: 'Ryo123', displayName: 'Guest2', email: 'guest2@chat.com' },
    guest3: { password: 'Ryo123', displayName: 'Guest3', email: 'guest3@chat.com' },
  };

  // Initialize users from localStorage or set defaults
  useEffect(() => {
    const storedUsers = localStorage.getItem('chatAppUsers');
    if (!storedUsers) {
      localStorage.setItem('chatAppUsers', JSON.stringify(defaultUsers));
    }
  }, []);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const storedUsers = JSON.parse(localStorage.getItem('chatAppUsers'));
    const normalizedUsername = usernameInput.toLowerCase();
    const user = storedUsers[normalizedUsername];

    if (user && user.password === password) {
      setLoggedInUser({
        username: normalizedUsername,
        displayName: displayName.trim() || user.displayName, // Use provided display name or default
        email: user.email,
        uid: normalizedUsername // Using username as a unique ID for local simulation
      });
      // Update display name in localStorage if provided
      if (displayName.trim()) {
        const updatedUsers = { ...storedUsers };
        updatedUsers[normalizedUsername].displayName = displayName.trim();
        localStorage.setItem('chatAppUsers', JSON.stringify(updatedUsers));
      }
      setError('');
    } else {
      setError('Invalid username or password.');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    setError('');
    if (!message.trim() || !loggedInUser) return;

    const newMessage = {
      id: Date.now(), // Simple unique ID
      text: message,
      timestamp: new Date(),
      userId: loggedInUser.uid,
      username: loggedInUser.displayName, // Use the display name for messages
    };

    setChatMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage('');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    try {
      const storedUsers = JSON.parse(localStorage.getItem('chatAppUsers'));
      const updatedUsers = { ...storedUsers };
      updatedUsers[loggedInUser.username].password = newPassword;
      localStorage.setItem('chatAppUsers', JSON.stringify(updatedUsers));
      setError('Password updated successfully! (Note: This change is local to your browser.)');
      setShowPasswordChange(false);
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      console.error("Error changing password:", err);
      setError(`Failed to change password: ${err.message}`);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setUsernameInput('');
    setPassword('');
    setDisplayName('');
    setChatMessages([]); // Clear chat history on logout
    setError('');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen font-inter flex flex-col items-center justify-center p-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <div className={`bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-6 transition-colors duration-300 ${isDarkMode ? 'dark:bg-gray-800' : ''}`}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500">
            Pro Chat (Local)
          </h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:scale-105 transition-transform duration-200"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm text-center animate-fade-in">
            {error}
          </div>
        )}

        {!loggedInUser ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <p className="text-center text-gray-600 dark:text-gray-300">
              Please log in to start chatting.
            </p>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Predefined IDs: Ryan, Guest, Guest1, Guest2, Guest3 (Password: Ryo123)
            </p>
            <div>
              <label htmlFor="usernameInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <User size={16} className="inline-block mr-1" /> Username (e.g., Ryan, Guest)
              </label>
              <input
                type="text"
                id="usernameInput"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <KeyRound size={16} className="inline-block mr-1" /> Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Tag size={16} className="inline-block mr-1" /> Display Name (Optional, e.g., Ryan Chat)
              </label>
              <input
                type="text"
                id="displayName"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter display name"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Welcome, {loggedInUser.displayName}!
              </h2>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>

            <button
              onClick={() => setShowPasswordChange(!showPasswordChange)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 flex items-center justify-center gap-1"
            >
              <KeyRound size={18} /> {showPasswordChange ? 'Hide Password Change' : 'Change Password'}
            </button>

            {showPasswordChange && (
              <form onSubmit={handleChangePassword} className="flex flex-col gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg animate-fade-in">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Change Password</h3>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmNewPassword"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Update Password
                </button>
              </form>
            )}

            <div className="flex flex-col gap-3 h-80 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 shadow-inner">
              {chatMessages.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">No messages yet. Start chatting!</p>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.userId === loggedInUser.uid ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-xl shadow-md transition-all duration-300 ${
                        msg.userId === loggedInUser.uid
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-bl-none'
                      }`}
                    >
                      <p className="font-bold text-sm mb-1">
                        {msg.userId === loggedInUser.uid ? 'You' : msg.username}
                      </p>
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs text-right opacity-75 mt-1">
                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : 'Sending...'}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                required
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Send size={18} /> Send
              </button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              Your User ID: <span className="font-mono">{loggedInUser.uid || 'N/A'}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
