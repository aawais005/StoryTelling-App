import React from "react";
import {
    Platform,
    Dimensions,
    Linking,
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    Image,
} from "react-native";
import MasonryList from "react-native-masonry-list";

// import testData from "./data";


const testData = [

    {
        uri: 'https://firebasestorage.googleapis.com/v0/b/storytellingapp-afcd9.appspot.com/o/images%2F1.jpeg?alt=media&token=1892c7a1-1a20-4e5d-aa11-90b9c33967e7',
    },
    {
        uri: 'https://firebasestorage.googleapis.com/v0/b/storytellingapp-afcd9.appspot.com/o/images%2F4.jpeg?alt=media&token=4b91513b-0d6e-4575-8c6d-7b5d373316b2',
    },
    {
        uri: 'https://firebasestorage.googleapis.com/v0/b/storytellingapp-afcd9.appspot.com/o/images%2F2.jpeg?alt=media&token=3dd6777f-d74e-4d9d-b9ba-406945d2c332',
    },
    {
        uri: 'https://firebasestorage.googleapis.com/v0/b/storytellingapp-afcd9.appspot.com/o/images%2F3.jpeg?alt=media&token=43153aef-500b-4b3b-a7b7-83300d815273',
    },    
];

function idGenerator() {
    return Math.random().toString(36).substr(2, 9);
}

// module.exports = data;





const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const platform = Platform.OS;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9F9F9"
    },
    header: {
        height: isIPhoneX() ? 74 : 64,
        backgroundColor: "transparent"
    },
    mobileHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    masonryHeader: {
        position: "absolute",
        zIndex: 10,
        flexDirection: "row",
        padding: 5,
        alignItems: "center",
        backgroundColor: "transparent"
    },
    title: {
        fontSize: 25,
        color: '#ff8000',
    },
    userPic: {
        height: 200,
        width: 20,
        borderRadius: 10,
        marginRight: 10
    },
    userName: {
        fontSize: 15,
        color: "#fafafa",
        fontWeight: "bold"
    },
    listTab: {
        height: 32,
        flexDirection: "row",
        borderTopLeftRadius: 7.5,
        borderTopRightRadius: 7.5,
        backgroundColor: "#fff",
        marginBottom: -5
    },
    tab: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    tabTextUnderline: {
        borderBottomWidth: 2,
        borderBottomColor: "#e53935"
    },
    tabTextOn: {
        fontSize: 10,
        color: "#e53935"
    },
    tabTextOff: {
        fontSize: 10,
        color: "grey"
    },
});

function isIPhoneX() {
    const X_WIDTH = 375;
    const X_HEIGHT = 812;
    return (
        Platform.OS === "android" &&
        ((deviceHeight === X_HEIGHT && deviceWidth === X_WIDTH) ||
        (deviceHeight === X_WIDTH && deviceWidth === X_HEIGHT))
    );
}

export default class ReactNativeMasonryListExample extends React.Component {
    constructor(props) {
        super(props)
    }
    state = {
        columns: 2,
        statusBarPaddingTop: isIPhoneX() ? 30 : platform === "android" ? 20 : 0
    }

    addimage = (data) => {
        this.props.addimage(data)
    }

    onLayoutChange = (ev) => {
        const { width, height } = ev.nativeEvent.layout;
        let maxComp = Math.max(width, height);

        if (width >= maxComp) {
            this.setState({
                columns: 3,
                statusBarPaddingTop: 0
            });
        } else if (width < maxComp) {
            this.setState({
                columns: 2,
                statusBarPaddingTop: isIPhoneX() ? 30 : platform === "android" ? 20 : 0
            });
        }
    }

    render() {
        const { statusBarPaddingTop } = this.state;

        return (
            <View
                onLayout={(ev) => this.onLayoutChange(ev)}
                style={styles.container}
            >
                <View style={[styles.header, styles.mobileHeader, { paddingTop: statusBarPaddingTop }]}>
                    <Text style={styles.title}>Image Bank</Text>
                </View>
                <View style={styles.listTab}>
                    {/* <TouchableWithoutFeedback
                        style={{borderTopLeftRadius: 7.5,}}
                        onPress={() => Linking.openURL("https://luehangs.site")}>
                            <View style={styles.tab}>
                                <View style={[styles.tabTextUnderline, {paddingBottom: 3}]}>
                                    <Text style={styles.tabTextOn}>Database Images</Text>
                                </View>
                            </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback>
                        <View style={styles.tab}>
                            <View style={{paddingBottom: 3}}>
                                <Text style={styles.tabTextOn}>CAMERA ROLL</Text>
                            </View>
                        </View>
                    </TouchableWithoutFeedback> */}
                </View>
                <MasonryList
                    images={testData}
                    columns={this.state.columns}
                    // sorted={true}
                    renderIndividualHeader={(data) => {
                        return (
                            <TouchableWithoutFeedback
                                onPress={() => {
                                        this.props.navigation.state.params
                                        .addimage(data.uri)
                                        this.props.navigation.goBack()
                                    }
                                    // Linking.openURL("https://luehangs.site")
                                }>
                                <View style={[styles.masonryHeader, {
                                    width: data.masonryDimensions.width,
                                    margin: data.masonryDimensions.gutter / 2
                                }]}>
                                    <Image
                                        // source={{ uri: "https://luehangs.site/images/lue-hang2018-square.jpg" }}
                                        style={styles.userPic} />
                                     {/* <Text style={styles.userName}>{data.title}</Text> */}
                                </View>
                            </TouchableWithoutFeedback>
                        );
                    }}
                />
            </View>
        );
    }
}