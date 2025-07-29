import React from 'react';
import { LoadingSpinner, CardLoading } from './loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Skeleton } from './skeleton';

// Table Loading State
export function TableLoading({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Dashboard Cards Loading State
export function DashboardCardsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-8 w-16" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Form Loading State
export function FormLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-20 w-full" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>
  );
}

// Employee List Loading State
export function EmployeeListLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Chart Loading State
export function ChartLoading({ height = 'h-64' }: { height?: string }) {
  return (
    <div className={`${height} flex items-center justify-center`}>
      <LoadingSpinner size="md" message="Loading chart data..." />
    </div>
  );
}

// Upload Loading State
export function UploadLoading({ message = 'Processing upload...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50/50">
      <LoadingSpinner size="lg" message={message} />
      <div className="mt-4 text-center">
        <div className="w-64 bg-blue-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '45%' }} />
        </div>
        <p className="text-sm text-blue-600 mt-2">Processing your document...</p>
      </div>
    </div>
  );
}

// Certificate Generation Loading
export function CertificateGenerationLoading() {
  return (
    <div className="text-center space-y-6 p-8">
      <LoadingSpinner size="xl" message="Generating certificates..." />
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-100">Processing training records</span>
          <span className="text-blue-200">●●●○○</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-100">Validating compliance data</span>
          <span className="text-blue-200">●●○○○</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-100">Generating QR codes</span>
          <span className="text-blue-200">●○○○○</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-blue-100">Creating digital certificates</span>
          <span className="text-blue-200">○○○○○</span>
        </div>
      </div>
    </div>
  );
}

// AI Processing Loading
export function AIProcessingLoading({ message = 'AI is analyzing your document...' }: { message?: string }) {
  return (
    <div className="text-center space-y-6 p-8">
      <div className="relative">
        <LoadingSpinner size="xl" message={message} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 border-2 border-violet-300/30 rounded-full animate-ping" />
        </div>
      </div>
      
      <div className="max-w-md mx-auto">
        <div className="flex justify-between text-xs text-blue-200 mb-2">
          <span>Processing</span>
          <span>85%</span>
        </div>
        <div className="w-full bg-blue-800/30 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-400 to-violet-400 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: '85%' }}
          />
        </div>
      </div>
      
      <div className="text-sm text-blue-200 space-y-1">
        <p>🤖 Extracting training data...</p>
        <p>📋 Identifying employee records...</p>
        <p>✅ Validating OSHA compliance...</p>
      </div>
    </div>
  );
}