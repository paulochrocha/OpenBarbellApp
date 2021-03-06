import {
    DISMISS_DEFAULT_METRIC
} from 'app/ActionTypes';

import * as SettingsActionCreators from 'app/redux/shared_actions/SettingsActionCreators';
import * as SetsActionCreators from 'app/redux/shared_actions/SetsActionCreators';

export const saveDefaultMetricSetting = (metric = 'kgs') => {
    return SettingsActionCreators.saveDefaultMetric(metric);
};

export const dismissDefaultMetricSetter = () => ({
    type: DISMISS_DEFAULT_METRIC,    
});
