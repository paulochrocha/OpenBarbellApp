// app/components/EditTextModal.js

import React, {Component} from 'react';
import {
	View,
	Text,
	TextInput,
	TouchableHighlight,
    TouchableOpacity,
	Modal,
	StyleSheet,
    FlatList
}  from 'react-native';

class EditTextModal extends Component {

    constructor(props) {
		super(props);

		this.state = { text: this.props.text };
	}

    componentWillReceiveProps(nextProps) {
        let text = nextProps.text;
        if (text === null || text === undefined) {
            text = '';
        }
        this._onChangeText(text);
	}

    // ACTIONS

    _onChangeText(input) {
        let suggestions = this.props.generateSuggestions(input);
        let suggestionsVM = suggestions.map((suggestion) => { return {key: suggestion}} );
        console.log(JSON.stringify(suggestionsVM));
        this.setState({
            text: input,
            suggestions: suggestionsVM
        });
    }

    _tappedDone() {
        this.props.closeModal();
        this.props.updateSet(this.props.setID, this.state.text);
    }

    // RENDER

    // TODO: grab the blue color for cancel from a global stylesheet
    _renderNavigation() {
        return (
            <View style={{height: 60, alignItems: 'center'}}>
                <View style={{position: 'absolute', left: 0, top: 0}}>
                    <TouchableHighlight onPress={() => this.props.closeModal()}>
                        <View style={{paddingTop: 30, paddingRight: 10, paddingBottom: 10, paddingLeft: 10}}>
                            <Text style={[styles.boldFont, {color: 'rgba(47, 128, 237, 1)'}]}>Cancel</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <View style={{top: 30}}>
                    <Text style={styles.boldFont}>{this.props.title}</Text>
                </View>

                <View style={{position: 'absolute', right: 0, top: 0}}>
                    <TouchableHighlight onPress={() => this._tappedDone() }>
                        <View style={{paddingTop: 30, paddingRight: 10, paddingBottom: 10, paddingLeft: 10}}>
                            <Text style={[styles.boldFont, {color: 'rgba(47, 128, 237, 1)'}]}>Done</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }

    _renderHeader() {

    }

    _renderTextField() {
        return (
            <View style={[{height: 50, marginHorizontal: 10, backgroundColor: 'white'}, styles.shadow]}>
                <TextInput
                    style={[{height: 35, margin: 10}, styles.boldFont]}
                    underlineColorAndroid={'transparent'}
                    editable = {true}
                    autoFocus={true}
                    placeholder={this.props.placeholder}
                    value={this.state.text}
                    onChangeText={(text) => this._onChangeText(text) }
                />
            </View>
        )
    }

    _renderList() {
        let data = this.state.suggestions;

        return (
            <FlatList
                style = {{padding: 10}}
                keyboardDismissMode='on-drag'
                keyboardShouldPersistTaps='always'
                initialNumToRender={13}
                data={data}
                renderItem={({item}) => this._renderRow(item)}
                ItemSeparatorComponent = {this._renderSeparator}
            />
        )
    }

    _renderRow(item) {
        return (
            <TouchableHighlight onPress={() => this._onChangeText(item.key)}>
                <View style={[{backgroundColor: 'white', height: 50, justifyContent: 'center'}, styles.rowShadow]}>
                    <Text style={{marginHorizontal: 10}}>{item.key}</Text>
                </View>
            </TouchableHighlight>
        );
    }

    // TODO: move 242 gray from global stylesheet
    _renderSeparator() {
        return (
            <View style={{ backgroundColor: 'white'}}>
                <View style={{marginHorizontal: 10, backgroundColor: 'rgba(242, 242, 242, 1)', height: 1}}></View>
            </View>
        )
    }

    // TODO: move 242 gray from global stylesheet
    render() {
        return (
            <Modal visible={this.props.modalShowing} animationType='fade'>
                <View style={{flex: 1, flexDirection: 'column', backgroundColor: 'rgba(242, 242, 242, 1)'}}>
                    {this._renderNavigation()}
                    {this._renderHeader()}
                    {this._renderTextField()}
                    {this._renderList()}
                </View>
            </Modal>
        );
    }

}

const styles = StyleSheet.create({
	shadow: {
		shadowColor: "#000000",
		shadowOpacity: 0.2,
		shadowRadius: 2,
		shadowOffset: {
			height: 1,
			width: 0
		},
	},
    rowShadow: {
        shadowColor: "#000000",
		shadowOpacity: 0.2,
		shadowRadius: 2,
		shadowOffset: {
			height: 4,
			width: 0
		},
    },
    boldFont: {
        fontWeight: 'bold'
    }
});

export default EditTextModal;