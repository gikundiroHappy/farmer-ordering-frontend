export default function LogoutButton() {
  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <button
      onClick={logout}
      className="text-sm text-red-600 hover:underline"
    >
      Logout
    </button>
  );
}
