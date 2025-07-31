// src/pages/workspace-view.jsx

export default function WorkspaceView() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-blue-800 mb-4">
        SafetySync.AI Workspace
      </h1>
      <p className="text-gray-600 mb-6">
        Manage your OSHA compliance and safety training programs.
      </p>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">Total Employees</h3>
          <p className="text-3xl font-bold text-blue-600">247</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">Active Certifications</h3>
          <p className="text-3xl font-bold text-green-600">892</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800">Compliance Rate</h3>
          <p className="text-3xl font-bold text-emerald-600">98.5%</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">👥</div>
            <div className="text-sm font-medium">Manage Employees</div>
          </button>
          <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">📋</div>
            <div className="text-sm font-medium">Upload Training</div>
          </button>
          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">🏆</div>
            <div className="text-sm font-medium">Generate Certificates</div>
          </button>
          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
            <div className="text-2xl mb-2">⚙️</div>
            <div className="text-sm font-medium">Settings</div>
          </button>
        </div>
      </div>
    </div>
  );
}