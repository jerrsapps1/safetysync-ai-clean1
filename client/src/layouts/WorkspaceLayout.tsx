// File: src/layouts/WorkspaceLayout.tsx

import React from "react";
import { Route, Switch } from "wouter";
// @ts-ignore
import WorkspaceView from "../pages/workspace-view.jsx";
// @ts-ignore  
import EmployeeManagement from "../pages/employee-management.jsx";
// @ts-ignore
import UploadTrainingRecord from "../pages/upload-training-record.jsx";
// @ts-ignore
import EmployeeProfile from "../pages/employee-profile.jsx";
// @ts-ignore
import InstructorBackgroundUpload from "../pages/instructor-background-upload.jsx";

export default function WorkspaceLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      <Switch>
        <Route path="/workspace" component={WorkspaceView} />
        <Route path="/workspace/employees" component={EmployeeManagement} />
        <Route path="/workspace/upload-training" component={UploadTrainingRecord} />
        <Route path="/workspace/employee/:id" component={EmployeeProfile} />
        <Route path="/workspace/instructor-backgrounds" component={InstructorBackgroundUpload} />
      </Switch>
    </div>
  );
}