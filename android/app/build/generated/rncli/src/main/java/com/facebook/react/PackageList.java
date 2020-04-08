
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

// react-native-audio
import com.rnim.rn.audio.ReactNativeAudioPackage;
// react-native-background-downloader
import com.eko.RNBackgroundDownloaderPackage;
// react-native-fetch-blob
import com.RNFetchBlob.RNFetchBlobPackage;
// react-native-fs
import com.rnfs.RNFSPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
// react-native-i18n
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
// react-native-image-picker
import com.imagepicker.ImagePickerPackage;
// react-native-localize
import com.reactcommunity.rnlocalize.RNLocalizePackage;
// react-native-reanimated
import com.swmansion.reanimated.ReanimatedPackage;
// react-native-sketch-draw
import com.reactlibrary.RNSketchViewPackage;
// react-native-sound
import com.zmxv.RNSound.RNSoundPackage;
// react-native-vector-icons
import com.oblador.vectoricons.VectorIconsPackage;
// react-native-webview
import com.reactnativecommunity.webview.RNCWebViewPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private MainPackageConfig mConfig;

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost, null);
  }

  public PackageList(Application application) {
    this(application, null);
  }

  public PackageList(ReactNativeHost reactNativeHost, MainPackageConfig config) {
    this.reactNativeHost = reactNativeHost;
    mConfig = config;
  }

  public PackageList(Application application, MainPackageConfig config) {
    this.reactNativeHost = null;
    this.application = application;
    mConfig = config;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(mConfig),
      new ReactNativeAudioPackage(),
      new RNBackgroundDownloaderPackage(),
      new RNFetchBlobPackage(),
      new RNFSPackage(),
      new RNGestureHandlerPackage(),
      new RNI18nPackage(),
      new ImagePickerPackage(),
      new RNLocalizePackage(),
      new ReanimatedPackage(),
      new RNSketchViewPackage(),
      new RNSoundPackage(),
      new VectorIconsPackage(),
      new RNCWebViewPackage()
    ));
  }
}
