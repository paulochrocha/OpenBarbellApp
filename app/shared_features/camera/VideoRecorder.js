import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Alert,
    Platform
}  from 'react-native';
import Camera from 'react-native-camera';
import KeepAwake from 'react-native-keep-awake';

class VideoRecorder extends Component {

    componentWillReceiveProps(nextProps) {
        if (nextProps.isRecording !== this.props.isRecording) {
            if (nextProps.isRecording) {
                this._record();
            } else {
                this._stopRecording();
            }
        }
    }

    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = nil;
        }
    }

    // actions

    _closeModal() {
        if (!this.timer) {
            this.props.closeModal();
        }
    }

    // record

    _record() {
        this.camera.capture({
            mode: Camera.constants.CaptureMode.video,
            audio: true
        }).then((data) => {
            this.props.saveVideo(this.props.setID, data.path, this.props.videoType);
            // TODO: share options can be here, but for now just finish
        }).catch((err) => {
            console.tron.log("ERROR " + err);
            Alert.alert('There was an issue saving your video. Please try again');
        });
    }

    _stopRecording() {
        if (Platform.OS === 'ios') {
            // TODO: remove timer hack, this was necessary to prevent weird behavior when ending too quickly
            this.timer = setTimeout(() => {
                this.camera.stopCapture();
                clearTimeout(this.timer);
                this.timer = null;    
            }, 1000);
        } else {
            this.camera.stopCapture();
        }
    }

    // render

    _renderActionButton() {
        if (this.props.isSaving) {
            return (
                <View style={[styles.actionButton, styles.savingButton]}>
                    <Text style={styles.buttonText}>SAVING</Text>
                </View>
            );
        } else if (this.props.isRecording) {
            return (
                <TouchableOpacity onPress={()=>this.props.tappedStop()}>
                    <View style={[styles.actionButton, styles.stopButton]}>
                        <Text style={styles.buttonText}>END</Text>
                    </View>
                </TouchableOpacity>
            );
        } else {
            return (
                <TouchableOpacity onPress={()=>this.props.tappedStart(this.props.setID)}>
                    <View style={[styles.actionButton, styles.startButton]}>
                        <Text style={styles.buttonText}>START</Text>
                    </View>
                </TouchableOpacity>
            );
        }
    }

    _renderCamera() {
        if (this.props.isModalShowing) {
            return (
                <View style={[{flex: 1}, styles.container]}>                
                    <Camera
                        ref={(cam) => {this.camera = cam}}
                        style={{flex: 1}}
                        aspect={Camera.constants.Aspect.fit}>

                        <View style={styles.cancelButton}>
                            <View>
                            <TouchableOpacity onPress={()=>this._closeModal()}>
                                <View><Text style={styles.cancelText}>Cancel</Text></View>
                            </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{position: 'absolute', bottom: 50, left: 0, right: 0, alignItems: 'center'}}>
                            { this._renderActionButton() }
                        </View>

                    </Camera>
                    <KeepAwake />
                </View>
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <Modal visible={this.props.isModalShowing} animationType='fade'>
                { this._renderCamera() }
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black'
    },
    actionButton: {
        width: 70,
        height: 70,
        borderRadius: 70,
        alignItems: 'center',
        justifyContent: 'center'
    },
    startButton: {
        backgroundColor: 'green',
    },
    stopButton: {
        backgroundColor: 'red',
    },
    savingButton: {
        backgroundColor: 'darkgray'
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 30,
        marginLeft: 20,
        width: 100,
        backgroundColor: '#333333',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    cancelText: {
        color: 'white',
        fontWeight: 'bold',
        width: 50,
        height: 30,
        paddingTop: 5,
        textAlign: 'center'
    }
});

export default VideoRecorder;
