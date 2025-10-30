import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import { ROLE_CONFIG, Role } from '@/constants/NAVIGATION';

interface RoleContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const STORAGE_KEY = 'ga-x-selected-role';

// Get default role (pilot)
const getDefaultRole = (): Role => {
  // Find pilot role specifically as default
  for (const group of ROLE_CONFIG.groups) {
    const pilotRole = group.roles.find(role => role.id === 'pilot' && role.visible);
    if (pilotRole) return pilotRole;
  }
  // Fallback to first visible role
  for (const group of ROLE_CONFIG.groups) {
    const visibleRole = group.roles.find(role => role.visible);
    if (visibleRole) return visibleRole;
  }
  // Last fallback
  return ROLE_CONFIG.groups[0]?.roles[0] || { id: 'pilot', name: 'Pilot', icon: 'airplane', label: 'Pilot', visible: true };
};

// Get role by ID from ROLE_CONFIG
const getRoleById = (roleId: string): Role | null => {
  const role = ROLE_CONFIG.getRoleById(roleId);
  return role || null;
};

export function RoleProvider({ children }: { children: ReactNode }) {
  // Initialize with saved role or default
  const getInitialRole = (): Role => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      try {
        const savedRoleId = localStorage.getItem(STORAGE_KEY);
        if (savedRoleId) {
          const savedRole = getRoleById(savedRoleId);
          if (savedRole && savedRole.visible) {
            return savedRole;
          }
        }
      } catch (error) {
        console.warn('Failed to load saved role from localStorage:', error);
      }
    }
    return getDefaultRole();
  };

  const [currentRole, setCurrentRoleState] = useState<Role>(getInitialRole());

  // Save role to localStorage when it changes
  useEffect(() => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, currentRole.id);
      } catch (error) {
        console.warn('Failed to save role to localStorage:', error);
      }
    }
  }, [currentRole]);

  // Wrapper function to update role
  const setCurrentRole = (role: Role) => {
    setCurrentRoleState(role);
  };

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoleContext() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRoleContext must be used within a RoleProvider');
  }
  return context;
}

