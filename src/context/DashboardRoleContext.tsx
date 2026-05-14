import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  defaultProfileId,
  executiveProfiles,
  type ExecutiveProfile,
  welcomeForRole,
  roleReadingHint,
} from "@/lib/roleConfig";

type DashboardRoleContextValue = {
  profile: ExecutiveProfile;
  setProfileId: (id: string) => void;
  roleKey: RoleKey;
  welcomeLine: string;
  readingHint: string;
};

const DashboardRoleContext = createContext<DashboardRoleContextValue | null>(null);

export function DashboardRoleProvider({ children }: { children: ReactNode }) {
  const [profileId, setProfileIdState] = useState(defaultProfileId);

  const setProfileId = useCallback((id: string) => {
    if (executiveProfiles.some((p) => p.id === id)) setProfileIdState(id);
  }, []);

  const value = useMemo(() => {
    const profile = executiveProfiles.find((p) => p.id === profileId) ?? executiveProfiles[0];
    const roleKey = profile.roleKey;
    return {
      profile,
      setProfileId,
      roleKey,
      welcomeLine: welcomeForRole(roleKey),
      readingHint: roleReadingHint(roleKey),
    };
  }, [profileId, setProfileId]);

  return <DashboardRoleContext.Provider value={value}>{children}</DashboardRoleContext.Provider>;
}

const fallbackValue: DashboardRoleContextValue = (() => {
  const profile = executiveProfiles[0];
  return {
    profile,
    setProfileId: () => {},
    roleKey: profile.roleKey,
    welcomeLine: welcomeForRole(profile.roleKey),
    readingHint: roleReadingHint(profile.roleKey),
  };
})();

export function useDashboardRole(): DashboardRoleContextValue {
  const ctx = useContext(DashboardRoleContext);
  return ctx ?? fallbackValue;
}
