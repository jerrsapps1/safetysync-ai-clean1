          {/* Dashboard - Standalone */}
          <Button
            variant="ghost"
            className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 ${
              activeTab === "unified-dashboard" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
            }`}
            onClick={() => handleTabSwitch("unified-dashboard")}
          >
            <Home className="w-5 h-5 mr-3" />
            {sidebarOpen && "Dashboard"}
          </Button>

          {/* Compliance & Reporting Section */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50"
              onClick={() => toggleSection('compliance-reporting')}
            >
              <FileText className="w-5 h-5 mr-3" />
              {sidebarOpen && "Compliance & Reporting"}
              {sidebarOpen && (
                expandedSections['compliance-reporting'] ? 
                  <ChevronDown className="w-4 h-4 ml-auto" /> : 
                  <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </Button>
            {expandedSections['compliance-reporting'] && (
              <div className="ml-6 space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 ${
                    activeTab === "analytics-reports" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("analytics-reports")}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {sidebarOpen && "Analytics & Reports"}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 ${
                    activeTab === "reports" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("reports")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {sidebarOpen && "Compliance Reports"}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 ${
                    activeTab === "document-manager" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("document-manager")}
                >
                  <Database className="w-4 h-4 mr-2" />
                  {sidebarOpen && "Document Management"}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 ${
                    activeTab === "trends" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("trends")}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {sidebarOpen && "Safety Trends"}
                </Button>
              </div>
            )}
          </div>

          {/* Employee Management Section */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50"
              onClick={() => toggleSection('employee-management')}
            >
              <Users className="w-5 h-5 mr-3" />
              {sidebarOpen && "Employee Management"}
              {sidebarOpen && (
                expandedSections['employee-management'] ? 
                  <ChevronDown className="w-4 h-4 ml-auto" /> : 
                  <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </Button>
            {expandedSections['employee-management'] && (
              <div className="ml-6 space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 ${
                    activeTab === "employees" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("employees")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  {sidebarOpen && "Employee Management"}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 ${
                    activeTab === "employee-insights" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("employee-insights")}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {sidebarOpen && "Employee Insights"}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 ${
                    activeTab === "employee-portal" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("employee-portal")}
                >
                  <FileUser className="w-4 h-4 mr-2" />
                  {sidebarOpen && "Employee Portal"}
                </Button>
              </div>
            )}
          </div>

          {/* Organization Section */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50"
              onClick={() => toggleSection('organization')}
            >
              <Building className="w-5 h-5 mr-3" />
              {sidebarOpen && "Organization"}
              {sidebarOpen && (
                expandedSections['organization'] ? 
                  <ChevronDown className="w-4 h-4 ml-auto" /> : 
                  <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </Button>
            {expandedSections['organization'] && (
              <div className="ml-6 space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 ${
                    activeTab === "company-profile" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("company-profile")}
                >
                  <Building className="w-4 h-4 mr-2" />
                  {sidebarOpen && "Company Profile"}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 ${
                    activeTab === "instructors" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("instructors")}
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  {sidebarOpen && "Instructor Management"}
                </Button>
              </div>
            )}
          </div>

          {/* System & Tools Section */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50"
              onClick={() => toggleSection('system-tools')}
            >
              <Settings className="w-5 h-5 mr-3" />
              {sidebarOpen && "System & Tools"}
              {sidebarOpen && (
                expandedSections['system-tools'] ? 
                  <ChevronDown className="w-4 h-4 ml-auto" /> : 
                  <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </Button>
            {expandedSections['system-tools'] && (
              <div className="ml-6 space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 ${
                    activeTab === "achievements" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("achievements")}
                >
                  <Award className="w-4 h-4 mr-2" />
                  {sidebarOpen && "Achievements & Milestones"}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 ${
                    activeTab === "notifications" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("notifications")}
                >
                  <Bell className="w-4 h-4 mr-2" />
                  {sidebarOpen && "Notifications & Alerts"}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 ${
                    activeTab === "settings" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("settings")}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {sidebarOpen && "Workspace Settings"}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 ${
                    activeTab === "subscription-billing" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("subscription-billing")}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {sidebarOpen && "Subscription & Billing"}
                </Button>
              </div>
            )}
          </div>

          {/* Training & Certification Section */}
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50"
              onClick={() => toggleSection('training-certification')}
            >
              <BookOpen className="w-5 h-5 mr-3" />
              {sidebarOpen && "Training & Certification"}
              {sidebarOpen && (
                expandedSections['training-certification'] ? 
                  <ChevronDown className="w-4 h-4 ml-auto" /> : 
                  <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </Button>
            {expandedSections['training-certification'] && (
              <div className="ml-6 space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 ${
                    activeTab === "certificates" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("certificates")}
                >
                  <Award className="w-4 h-4 mr-2" />
                  {sidebarOpen && "Certificate Generation"}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 ${
                    activeTab === "training-calendar" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("training-calendar")}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  {sidebarOpen && "Training Calendar"}
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-gray-300 hover:text-white hover:bg-gray-700/50 ${
                    activeTab === "training" ? "text-white border-b-2 border-blue-400 rounded-b-none bg-gray-700/30" : ""
                  }`}
                  onClick={() => handleTabSwitch("training")}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {sidebarOpen && "Training Management"}
                </Button>
              </div>
            )}
          </div>