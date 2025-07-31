// File: src/layouts/WorkspaceLayout.tsx

import React from "react";
import { Route, Switch } from "wouter";
// @ts-ignore
import Sidebar from "../components/Sidebar.tsx";
// @ts-ignore
import WorkspaceView from "../pages/workspace-view.jsx";
// @ts-ignore
import EmployeeManagement from "../pages/employee-management.jsx";
// @ts-ignore
import UploadTraining from "../pages/upload-training.jsx";
// @ts-ignore
import InstructorBackgrounds from "../pages/instructor-backgrounds.jsx";
// @ts-ignore
import Certificates from "../pages/certificates.jsx";
// @ts-ignore
import WorkspaceSettings from "../pages/workspace-settings.jsx";

export default function WorkspaceLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div style={{ flex: "1", backgroundColor: "#f3f4f6", padding: "20px" }}>
        <Switch>
          <Route path="/workspace" component={WorkspaceView} />
          <Route path="/workspace/employee-management" component={EmployeeManagement} />
          <Route path="/workspace/upload-training" component={UploadTraining} />
          <Route path="/workspace/instructor-backgrounds" component={InstructorBackgrounds} />
          <Route path="/workspace/certificates" component={Certificates} />
          <Route path="/workspace/settings" component={WorkspaceSettings} />
        </Switch>
      </div>
    </div>
  );
}