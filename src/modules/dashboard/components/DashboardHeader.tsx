import React, { useEffect, useState } from "react";

import { ProfilePopover } from "./Profile";
import logo from "../../../assets/images/logo.svg";
import { useAppContext } from "context";

interface AccountInfo {
  name: string;
  email: string;
}

export interface DashboardHeaderProps {
  [key: string]: unknown;
}

const DashboardHeader = (props: DashboardHeaderProps): JSX.Element => {
  const { user: { userName, userEmail } } = useAppContext();
  const [profile, setProfile] = useState(null as unknown as AccountInfo);

  useEffect(() => {
    getProfile();
  }, []); // eslint-disable-line

  const getProfile = async (): Promise<void> => {
    try {
      const profile = { name: userName, email: userEmail };
      setProfile(profile);
    } catch (e) {
    }
  }

  // TODO: Add link to PredictDb page when it will be available

  return (
    <div className="dash-board__header">
      <div className="dash-board__logo">
        <a href="https://imagentherapeutics.com/predicttx"><img src={ logo } alt="PredictDb"/></a>
      </div>
      <div className="dash-board__right">
        <div className="dash-board__docs">
          <a href="https://docs.imagentherapeutics.com">Documentation</a>
        </div>
        { profile && <div className="dash-board__profile">
            <ProfilePopover
                userName={ profile.name }
            />
        </div>
        }
      </div>
    </div>
  )
}

export default DashboardHeader