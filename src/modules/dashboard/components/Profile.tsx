import React from "react";
import Popover, { PopoverOrigin } from "@material-ui/core/Popover";

import profile from "assets/images/profile.svg";
import { SignOutIcon } from "shared/components/Icons";
import { useAppContext } from 'context';
import storage from "services/storage.service";
import { useHistory } from 'react-router-dom';
import { routes } from '../../../routes';
export interface ProfilePopoverProps {
  profileMenuActive?: boolean;
  toggleProfileMenu?: () => void;
}

export function ProfilePopover(props: ProfilePopoverProps): JSX.Element {
  const appCTX = useAppContext()
  const history = useHistory()
  const name = storage.get("user_name")
  const [state, updateState] = React.useState({ profileMenuActive: false });
  const anchorOrigin: PopoverOrigin = { vertical: "top", horizontal: "right", };
  const transformOrigin: PopoverOrigin = { vertical: "top", horizontal: "center", };
  const popoverAnchorElement = document.querySelector('.dash-board__profile');

  const toggleProfileMenu = () => {
    const profileMenuActive = !state.profileMenuActive;
    updateState({ ...state, profileMenuActive });
    if (props.toggleProfileMenu) props.toggleProfileMenu();
  };

  const logout = () => {
    appCTX.controls.clearState()
    return history.push(routes.default)
  }

  return (
    <div className="dash-board__profile">
      <Popover
        open={state.profileMenuActive}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        anchorEl={popoverAnchorElement}
        onClose={toggleProfileMenu}
      >
        <div className="profile">
          <div className="profile__header">
            <div className="profile__image">
              <img src={profile} alt="aside" />
            </div>

            <div>
              <h3 className="profile__title">{name || 'Unknown user'}</h3>
            </div>
          </div>

          <div className="profile__footer">
            <span className="profile__sign-out-icon">
              <SignOutIcon />
            </span>
            <button className="profile__sign-out" onClick={() => logout()}>Sign out</button>
          </div>
        </div>
      </Popover>

      <div className="user-photo" onClick={toggleProfileMenu.bind(null)}>
        <img src={profile} alt="aside" />
      </div>
    </div>
  );
}
