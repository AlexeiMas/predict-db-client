import * as React from 'react';
import {Tabs} from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Box from '@material-ui/core/Box'
import {Link as ReactLink} from 'react-router-dom'

const NavigationTabs = ({activeTab, setActiveTab}): JSX.Element => {

  const handleChange = (event:React.ChangeEvent<string | unknown>, value: string) => {
    setActiveTab(value);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
      >
        <Tab value="dashboard" label="Model Selection" component={ReactLink} to={'/dashboard'} />
        <Tab value="analytics" label="Analytics" component={ReactLink} to={'/analytics'} />
      </Tabs>
    </Box>
  );
};

export default NavigationTabs;
