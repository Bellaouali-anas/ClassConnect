import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileContextType {
  profilePhoto: string;
  setProfilePhoto: (photo: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profilePhoto, setProfilePhoto] = useState<string>("");

  return (
    <ProfileContext.Provider value={{ profilePhoto, setProfilePhoto }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
} 