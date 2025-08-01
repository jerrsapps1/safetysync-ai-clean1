// src/components/Sidebar.tsx

export default function Sidebar() {
  return (
    <div className="w-64 bg-blue-800 text-white p-4 h-full">
      <h2 className="text-xl font-bold mb-4">Workspace</h2>
      <nav className="space-y-2">
        <div className="block p-2 rounded bg-blue-700">Dashboard</div>
        <div className="block p-2 rounded hover:bg-blue-700 cursor-pointer">Employees</div>
        <div className="block p-2 rounded hover:bg-blue-700 cursor-pointer">Upload Training</div>
        <div className="block p-2 rounded hover:bg-blue-700 cursor-pointer">Instructor Backgrounds</div>
        <div className="block p-2 rounded hover:bg-blue-700 cursor-pointer">Certificates</div>
        <div className="block p-2 rounded hover:bg-blue-700 cursor-pointer">Settings</div>
      </nav>
    </div>
  );
}