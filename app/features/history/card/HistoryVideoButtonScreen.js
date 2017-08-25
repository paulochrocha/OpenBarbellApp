import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import VideoButton from 'app/shared_features/set_card/VideoButton';
import * as Actions from './EditHistorySetFormActions';

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        tappedRecord: Actions.presentRecordVideo,
        tappedCommentary: Actions.presentRecordVideo,
        tappedWatch: Actions.presentWatchVideo
    }, dispatch);
};

const HistoryVideoButtonScreen = connect(
    null,
    mapDispatchToProps
)(VideoButton);

export default HistoryVideoButtonScreen;
