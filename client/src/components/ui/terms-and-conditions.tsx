import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from './button';
import { ScrollArea } from './scroll-area';
import { Separator } from './separator';
import { Badge } from './badge';

interface TermsAndConditionsProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  userEmail?: string;
  planName?: string;
}

export function TermsAndConditions({ 
  isOpen, 
  onClose, 
  onAccept, 
  userEmail, 
  planName 
}: TermsAndConditionsProps) {
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(false);

  const canAccept = hasReadTerms && hasAcceptedTerms && hasAcceptedPrivacy;

  const handleAccept = () => {
    if (canAccept) {
      onAccept();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-blue-900">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-800">
            Service Agreement & Terms of Use
          </DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-blue-600">
              {planName || 'Professional Plan'}
            </Badge>
            <Badge variant="outline" className="text-blue-500">
              {userEmail || 'Client Agreement'}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 text-sm text-blue-600">
            
            {/* Service Agreement Overview */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Service Agreement Overview</h3>
              <p className="text-blue-800">
                This agreement establishes the terms for your SafetySync.AI OSHA compliance platform subscription. 
                By proceeding, you agree to these terms and create a binding service contract.
              </p>
            </div>

            {/* Key Terms Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">✓ Platform Features</h4>
                <ul className="text-green-800 space-y-1 text-sm">
                  <li>• AI-powered document processing and certificate generation</li>
                  <li>• Comprehensive employee management with 200+ employee database</li>
                  <li>• Training document hub with PDF extraction capabilities</li>
                  <li>• Instructor sign-in generator with customizable classes</li>
                  <li>• Employee portal with QR code verification system</li>
                  <li>• Digital wallet cards replacing physical certifications</li>
                  <li>• Real-time dashboard with customizable widget layout</li>
                  <li>• Advanced analytics and compliance reporting</li>
                  <li>• Mobile-responsive design for field access</li>
                  <li>• AI contextual help system with intelligent recommendations</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">🔒 Data & Privacy</h4>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• PostgreSQL database with enterprise-grade security</li>
                  <li>• JWT token authentication with 7-day expiration</li>
                  <li>• OpenAI GPT-4o integration with secure API handling</li>
                  <li>• Employee data protection with ID verification tracking</li>
                  <li>• GDPR and CCPA compliance with data retention policies</li>
                  <li>• Your training documents processed securely within platform</li>
                  <li>• Full data export capabilities with CSV format support</li>
                  <li>• Rate limiting and authentication protection on all endpoints</li>
                </ul>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">⚡ AI Services</h4>
                <ul className="text-purple-800 space-y-1 text-sm">
                  <li>• Intelligent compliance gap analysis</li>
                  <li>• Automated training schedule optimization</li>
                  <li>• Real-time risk assessment and alerts</li>
                  <li>• Smart certification monitoring</li>
                  <li>• AI chat assistant for compliance guidance</li>
                  <li>• Verify all AI recommendations independently</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-2">⚠️ Cancellation Policy</h4>
                <ul className="text-orange-800 space-y-1 text-sm">
                  <li>• Cancel anytime with 30-day notice</li>
                  <li>• No prorated refunds issued</li>
                  <li>• 30-day data migration period</li>
                  <li>• Export tools available during migration</li>
                  <li>• Automated audit reviews can be disabled</li>
                  <li>• Volume discounts apply at 2000+ employees</li>
                </ul>
              </div>
            </div>

            {/* Full Terms and Conditions */}
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-800">TERMS AND CONDITIONS OF SERVICE</h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-blue-800">1. SERVICE DESCRIPTION</h4>
                  <p className="mt-1">
                    SafetySync.AI provides comprehensive AI-powered OSHA compliance management software as a service (SaaS). 
                    Our platform includes: AI-powered document processing with OpenAI GPT-4o integration, automated certificate generation, 
                    employee management system with 200+ employee database, comprehensive training document hub, instructor sign-in generator, 
                    AI contextual help system, compliance reporting and analytics, employee portal with QR code verification, 
                    digital wallet cards replacing physical certifications, real-time dashboard with customizable widgets, 
                    multi-departmental analytics, bulk operations management, advanced search and filtering capabilities, 
                    CSV export functionality, mobile-responsive design, and enterprise-grade security with authentication protection.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800">2. SUBSCRIPTION AND BILLING</h4>
                  <p className="mt-1">
                    <strong>Monthly Billing:</strong> Services are billed monthly in advance based on your selected plan and employee count.
                    <br />
                    <strong>Payment Terms:</strong> Payment is due immediately upon subscription activation.
                    <br />
                    <strong>Certificate & Card Generation:</strong> Each plan includes specific certificate and digital wallet card allowances for the first month (Essential: 15, Professional: 50, Enterprise: 100, Enterprise Plus: 250). Additional usage beyond included amounts is automatically billed at $5.95 per item.
                    <br />
                    <strong>Usage Billing:</strong> Certificate and digital wallet card overage charges at $5.95 per item are automatically added to your monthly billing based on actual usage. Service remains uninterrupted - you can generate certificates and cards as needed.
                    <br />
                    <strong>Plan Changes:</strong> Upgrades take effect immediately; downgrades take effect at the next billing cycle.
                    <br />
                    <strong>Auto-Renewal:</strong> Subscriptions automatically renew monthly unless cancelled with 30 days notice.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800">3. CERTIFICATE AND DIGITAL WALLET CARD PRICING</h4>
                  <p className="mt-1">
                    <strong>Plan-Specific Allowances:</strong> Each subscription plan includes different certificate and digital wallet card allowances for the first month: Essential (15), Professional (50), Enterprise (100), Enterprise Plus (250).
                    <br />
                    <strong>Overage Charges:</strong> Additional certificates or digital wallet cards beyond the included amounts are automatically charged at $5.95 per item.
                    <br />
                    <strong>Automatic Billing:</strong> Overage charges are automatically calculated and added to your monthly invoice based on actual usage. Service remains uninterrupted regardless of usage.
                    <br />
                    <strong>No Service Interruption:</strong> You can generate certificates and cards as needed without service limitations - additional usage is simply billed to your monthly subscription.
                    <br />
                    <strong>Professional Quality:</strong> All generated certificates and digital wallet cards meet OSHA, ANSI, and EM 385-1-1 compliance standards.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800">4. AI SERVICES AND DATA PROCESSING</h4>
                  <p className="mt-1">
                    <strong>AI Features:</strong> Our platform uses artificial intelligence for clone detection, compliance analysis, risk assessment, and chat assistance.
                    <br />
                    <strong>Data Processing:</strong> You consent to AI processing of your compliance data to provide intelligent insights and recommendations.
                    <br />
                    <strong>Data Privacy:</strong> AI processing occurs within secure, encrypted environments. Your data is not used to train external AI models.
                    <br />
                    <strong>Accuracy Disclaimer:</strong> AI insights are recommendations only. You remain responsible for verifying and acting on compliance requirements.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800">5. API ACCESS AND DEVELOPER SERVICES</h4>
                  <p className="mt-1">
                    <strong>API Usage:</strong> API access is governed by rate limits and fair use policies outlined in our developer portal.
                    <br />
                    <strong>Integration Rights:</strong> You may integrate our API with your systems for legitimate business purposes only.
                    <br />
                    <strong>Developer Portal:</strong> Access to documentation, SDKs, and testing tools is included with Professional and Enterprise plans.
                    <br />
                    <strong>API Restrictions:</strong> You may not reverse engineer, resell, or use our API to compete with our services.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800">5. CUSTOM BRANDING AND WHITE-LABEL SERVICES</h4>
                  <p className="mt-1">
                    <strong>Branding Rights:</strong> Essential, Professional, and Enterprise plans include custom branding capabilities.
                    <br />
                    <strong>Logo Usage:</strong> You grant us license to display your logo within your branded platform instance only.
                    <br />
                    <strong>Brand Guidelines:</strong> Custom branding must comply with professional standards and applicable laws.
                    <br />
                    <strong>Intellectual Property:</strong> Your branding remains your property; our platform technology remains ours.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800">7. COLLABORATION AND MULTI-LOCATION FEATURES</h4>
                  <p className="mt-1">
                    <strong>Team Collaboration:</strong> Real-time collaboration tools enable secure team communication within your organization.
                    <br />
                    <strong>Multi-Location Management:</strong> Enterprise features support unlimited locations with centralized oversight.
                    <br />
                    <strong>Data Sharing:</strong> Collaboration features share data only within your authorized team members.
                    <br />
                    <strong>Access Controls:</strong> You control user permissions and data access for your team members.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800">8. CANCELLATION AND REFUND POLICY</h4>
                  <p className="mt-1">
                    <strong>Cancellation:</strong> You may cancel your subscription at any time with 30 days written notice.
                    <br />
                    <strong>No Prorated Refunds:</strong> We do not provide prorated refunds for partial months of service.
                    <br />
                    <strong>Data Migration Period:</strong> Following cancellation notice, you will retain access for 30 days to migrate your data.
                    <br />
                    <strong>Data Export:</strong> We provide data export tools during the migration period.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800">4. DATA OWNERSHIP AND PRIVACY</h4>
                  <p className="mt-1">
                    <strong>Your Data:</strong> You retain ownership of all data uploaded to our platform.
                    <br />
                    <strong>Data Security:</strong> We implement enterprise-grade security measures to protect your data.
                    <br />
                    <strong>Data Retention:</strong> Upon cancellation, data is retained for 30 days then permanently deleted.
                    <br />
                    <strong>Privacy:</strong> We comply with applicable privacy laws and our Privacy Policy.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800">6. SERVICE AVAILABILITY</h4>
                  <p className="mt-1">
                    <strong>Uptime:</strong> We strive for 99.9% uptime but do not guarantee uninterrupted service.
                    <br />
                    <strong>Maintenance:</strong> Scheduled maintenance will be announced 48 hours in advance.
                    <br />
                    <strong>Support:</strong> Technical support is available during business hours for paid plans.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800">8. AUTOMATED AUDIT REVIEW SERVICES</h4>
                  <p className="mt-1">
                    <strong>Service Description:</strong> Optional automated monthly compliance gap analysis available for $99/month.
                    <br />
                    <strong>Opt-Out Rights:</strong> You may disable automated audit reviews at any time through your dashboard settings.
                    <br />
                    <strong>Review Scope:</strong> Automated reviews analyze your data for compliance gaps and provide recommendations.
                    <br />
                    <strong>Professional Responsibility:</strong> Automated reviews supplement but do not replace professional compliance oversight.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800">9. TIER-BASED FEATURES AND LIMITATIONS</h4>
                  <p className="mt-1">
                    <strong>Essential Plan:</strong> Up to 50 employees, basic features, custom branding, email support.
                    <br />
                    <strong>Professional Plan:</strong> Up to 500 employees, advanced analytics, API access, priority support.
                    <br />
                    <strong>Enterprise Plan:</strong> Up to 2,000 employees, unlimited locations, real-time risk assessment, dedicated support.
                    <br />
                    <strong>Enterprise Plus:</strong> Up to 10,000 employees, white-label options, volume discounts, custom integrations.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800">10. COMPLIANCE AND LIABILITY</h4>
                  <p className="mt-1">
                    <strong>Compliance Tool:</strong> SafetySync.AI assists with OSHA compliance tracking and documentation but does not guarantee regulatory compliance.
                    <br />
                    <strong>Professional Responsibility:</strong> You remain solely responsible for ensuring actual compliance with OSHA, EPA, and other applicable regulations.
                    <br />
                    <strong>AI Document Processing:</strong> AI extraction from training documents and certificate generation are tools only; verify all results independently.
                    <br />
                    <strong>Training Records:</strong> While platform helps organize training documentation, you must ensure all training meets regulatory requirements.
                    <br />
                    <strong>Employee Verification:</strong> ID verification and employee data accuracy remain your responsibility despite platform tracking capabilities.
                    <br />
                    <strong>Limitation of Liability:</strong> Our liability is limited to the amount paid for services in the preceding 12 months.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800">11. ACCEPTABLE USE</h4>
                  <p className="mt-1">
                    You agree not to: (a) violate any laws, (b) infringe intellectual property rights, 
                    (c) transmit malicious code, (d) attempt to gain unauthorized access, (e) use the service 
                    for any unlawful purpose, (f) abuse AI features or API rate limits, (g) reverse engineer our algorithms,
                    or (h) use collaboration tools for non-business purposes.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800">12. DATA SECURITY AND PRIVACY</h4>
                  <p className="mt-1">
                    <strong>Database Security:</strong> All data stored in secure PostgreSQL database with encrypted connections and access controls.
                    <br />
                    <strong>Authentication:</strong> JWT token-based authentication with secure session management and rate limiting protection.
                    <br />
                    <strong>AI Processing:</strong> OpenAI GPT-4o integration processes documents securely without storing sensitive data externally.
                    <br />
                    <strong>Employee Data:</strong> Employee information protected with ID verification tracking and departmental access controls.
                    <br />
                    <strong>Data Retention:</strong> Training records, certificates, and employee data retained for duration of subscription plus 90 days.
                    <br />
                    <strong>GDPR Compliance:</strong> Full compliance with data protection regulations including right to deletion and data portability.
                    <br />
                    <strong>Third-Party Access:</strong> Only OpenAI API used for document processing; no data shared with other third parties.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800">13. MODIFICATIONS</h4>
                  <p className="mt-1">
                    We reserve the right to modify these terms with 30 days notice. Continued use of the service 
                    constitutes acceptance of modified terms. Material changes affecting pricing or core functionality 
                    will include opt-out provisions.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-800">14. GOVERNING LAW</h4>
                  <p className="mt-1">
                    This agreement is governed by the laws of the jurisdiction where SafetySync.AI is incorporated. 
                    Any disputes will be resolved through binding arbitration. Class action lawsuits are waived except 
                    where prohibited by law.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Contact Information</h4>
              <p className="text-blue-600">
                For questions about these terms or your account, contact our support team at{' '}
                <span className="font-medium">support@safetysync.ai</span>
              </p>
              <p className="text-xs text-blue-400 mt-2">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex flex-col gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="read-terms" 
                checked={hasReadTerms}
                onChange={(e) => setHasReadTerms(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-blue-100 border-blue-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label 
                htmlFor="read-terms" 
                className="text-sm font-medium leading-none cursor-pointer"
              >
                I have read and understand the complete terms and conditions above
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="accept-terms" 
                checked={hasAcceptedTerms}
                onChange={(e) => setHasAcceptedTerms(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-blue-100 border-blue-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label 
                htmlFor="accept-terms" 
                className="text-sm font-medium leading-none cursor-pointer"
              >
                I agree to be bound by these terms and conditions
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="accept-privacy" 
                checked={hasAcceptedPrivacy}
                onChange={(e) => setHasAcceptedPrivacy(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-blue-100 border-blue-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label 
                htmlFor="accept-privacy" 
                className="text-sm font-medium leading-none cursor-pointer"
              >
                I acknowledge the cancellation policy and data migration terms
              </label>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleAccept}
              disabled={!canAccept}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Accept Terms & Create Account
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}