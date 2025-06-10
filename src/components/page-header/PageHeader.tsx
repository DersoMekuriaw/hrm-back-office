"use client";

import { ActionIcon } from "@mantine/core";
import { IconArrowLeft, IconMaximize, IconMinimize } from "@tabler/icons-react";

interface PageHeaderProps {
  name?: string;
  status?: 'active' | 'inactive';
  department?: string;
  position?: string;

  isFullScreen: boolean;
  backToPrevious: () => void;
  onToggleFullScreen: () => void;
}

export function PageHeader({
  name= 'New Employee',
  status,
  department,
  position,
  
  isFullScreen,
  backToPrevious,
  onToggleFullScreen
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between pl-4 pr-4 p-2 bg-white border-b border-gray-200 rounded-lg shadow-sm mb-2">
      {name &&(
        <>
          <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {name} 
                <span className="text-sm text-gray-700"> - {position} in {department} department</span>
              </h3>
          </div>
          <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${
              status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {status?.toUpperCase()}
          </span>
        </>
      )}
      {!name && <h3 className="text-lg leading-6 font-medium text-gray-900">{name}</h3>}

      <div className="flex items-center space-x-2">
        <ActionIcon 
          variant="subtle" 
          color="gray" 
          size="lg"
          onClick={onToggleFullScreen}
          aria-label={isFullScreen ? "Minimize" : "Maximize"}
          className="hover:bg-gray-100"
        >
          {isFullScreen ? <IconMinimize size={20} /> : <IconMaximize size={20} />}
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          color="blue"
          size="lg"
          onClick={backToPrevious}
          aria-label="Back"
          className="hover:bg-blue-50"
        >
          <IconArrowLeft size={20} />
        </ActionIcon>
      </div>
    </div>
  );
}