// src/layouts/WorkspaceLayout.tsx
import Sidebar from "../components/Sidebar";
import WorkspaceView from "../pages/workspace-view";

export default function WorkspaceLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">
        <WorkspaceView />
      </main>
    </div>
  );
}