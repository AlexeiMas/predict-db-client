import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Popover, { PopoverOrigin } from "@material-ui/core/Popover";

import profile from "assets/images/profile.svg";
import { SignOutIcon } from "shared/components/Icons";
import storage from "../../../services/storage.service";
import { routes } from "../../../routes";
export interface ProfilePopoverProps {
  userName?: string;
  profileMenuActive?: boolean;
  toggleProfileMenu?: () => void;
}

export function ProfilePopover(props: ProfilePopoverProps): JSX.Element {
  const [state, updateState] = useState({
    profileMenuActive: false,
  });

  const history = useHistory();

  const anchorOrigin: PopoverOrigin = { vertical: "top", horizontal: "right", };
  const transformOrigin: PopoverOrigin = { vertical: "top", horizontal: "center", };
  const popoverAnchorElement = document.querySelector('.dash-board__profile');

  const toggleProfileMenu = () => {
    const profileMenuActive = !state.profileMenuActive;
    updateState({ ...state, profileMenuActive });

    if (props.toggleProfileMenu) {
      props.toggleProfileMenu();
    }
  };

  const logout = async () => {
    try {
      storage.clear();
      history.push(routes.signIn);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="dash-board__profile">
      <Popover
        open={ state.profileMenuActive }
        anchorOrigin={ anchorOrigin }
        transformOrigin={ transformOrigin }
        anchorEl={ popoverAnchorElement }
        onClose={ toggleProfileMenu }
      >
        <div className="profile">
          <div className="profile__header">
            <div className="profile__image">
              <img src={ profile } alt="aside"/>
            </div>

            <div>
              <h3 className="profile__title">{ props.userName || 'Unknown user'}</h3>
            </div>
          </div>

          <div className="profile__footer">
            <span className="profile__sign-out-icon">
              <SignOutIcon/>
            </span>
            <button className="profile__sign-out" onClick={ logout }>Sign out</button>
          </div>
        </div>
      </Popover>

      <div className="user-photo" onClick={ toggleProfileMenu }>
        <img src={ profile } alt="aside"/>
      </div>
    </div>
  );
}
