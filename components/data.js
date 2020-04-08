import {db, stor} from '../src/config';

import {home_username} from './Home';

// import {story_title} from './Take_title';

import RNfetchBlob from 'react-native-fetch-blob';

import RNBackgroundDownloader from 'react-native-background-downloader';

const fs = RNfetchBlob.fs;

var username = '';
var title = '';

async function sign_up(info) {
  // username = update_name();
  if (info === undefined) {
    return 0;
  }

  let insert_username = await db
    .ref('usernames/' + info.username)
    .set(info.username);

  let checker = await db.ref('users/' + info.username).once('value');
  let result = checker.val();

  if (result === null) {
    console.log('no existing user. ok!');
  } else {
    alert('Username taken!');
    console.log('user already exists...');
    return 0;
  }

  await db.ref('users/' + info.username).set(info);
  return 1;
}

async function sign_in(info) {
  // username = update_name();
  if (info === undefined) {
    return 0;
  }

  let checker = await db.ref('users/' + info.username).once('value');
  let result = checker.val();
  if (result == null) {
    console.log('no existing user!');
    alert('Username does not exist!');
    return 0;
  }

  if (info.password === result.password) {
    return 1;
  }
  alert('Password entered incorrect!');
  return 0;
}

//for cont only,have to make for side

async function save_story(username, title, img_url, story_html) {
  var flag = 'cont';
  // username = update_name();
  // title = update_title();

  var user_title_flag = [username, title, flag];

  var enter_title = await db
    .ref('Titles/' + username + '/' + title)
    .set(user_title_flag);

  var user_imgurl = [username, title, img_url];

  var enter_img_url = await db
    .ref('IMG_URL/' + username + '/' + title)
    .set(user_imgurl);

  var enter_ht = await db
    .ref('Cont_Stories/' + username + '_' + title + '/story_HTML')
    .set(story_html);
}

async function save_story_side(
  username,
  title,
  img_url,
  list_html,
  list_pic,
  n_pages,
) {
  var flag = 'side';
  // username = update_name();
  // title = update_title();

  var user_title_flag = [username, title, flag];

  var enter_title = await db
    .ref('Titles/' + username + '/' + title)
    .set(user_title_flag);

  var user_imgurl = [username, title, img_url];

  var enter_img_url = await db
    .ref('IMG_URL/' + username + '/' + title)
    .set(user_imgurl);

  var side_dict = {};
  side_dict['list_html'] = list_html;
  side_dict['list_pic'] = list_pic;
  side_dict['n_pages'] = n_pages;

  var enter_ht = await db
    .ref('Cont_Stories/' + username + '_' + title + '_side' + '/side_dict')
    .set(side_dict);
}

async function check_image_index(username, title, fl) {
  // username = update_name();
  // title = update_title();

  let checker_img = await db
    .ref('ImgInd/' + username + '/' + title + '_' + fl + '/')
    .once('value');

  let result_img = checker_img.val();
  if (result_img === null) {
    result_img = 0;
  }
  return result_img;
}

//tell from cont or side in mode,fl(simple)
async function uploadImage(
  username,
  title,
  fl,
  uri,
  mime = 'application/octet-stream',
) {
  alert('Uploading Image!');
  //image_uri: 'https://avatars0.githubusercontent.com/u/12028011?v=3&s=200';
  let latest_img_ind = await check_image_index(username, title, fl);
  latest_img_ind = latest_img_ind + 1;

  let checker_img = await db
    .ref('ImgInd/' + username + '/' + title + '_' + fl + '/')
    .set(latest_img_ind);

  // var uri = 'content://media/external/images/media/126072';

  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    let uploadBlob = null;

    const imageRef = stor
      .ref('pictures')
      .child(
        'image_' + username + '_' + title + '_' + fl + '_' + latest_img_ind,
      );

    fs.readFile(uploadUri, 'base64')
      .then(data => {
        return Blob.build(data, {type: `${mime};BASE64`});
      })
      .then(blob => {
        uploadBlob = blob;
        return imageRef.put(blob, {contentType: mime});
      })
      .then(() => {
        uploadBlob.close();
        return imageRef.getDownloadURL();
      })
      .then(url => {
        resolve(url);
        alert('Image Added!');
        return url;
      })
      .catch(error => {
        console.log('Error in uploading!');
        reject(error);
      });
  });
}

async function uploadImage_dp(
  username,
  uri,
  mime = 'application/octet-stream',
) {
  alert('Uploading Image!');

  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    let uploadBlob = null;

    const imageRef = stor.ref('profile_pictures').child('image_' + username);

    fs.readFile(uploadUri, 'base64')
      .then(data => {
        return Blob.build(data, {type: `${mime};BASE64`});
      })
      .then(blob => {
        uploadBlob = blob;
        return imageRef.put(blob, {contentType: mime});
      })
      .then(() => {
        uploadBlob.close();
        return imageRef.getDownloadURL();
      })
      .then(async url => {
        resolve(url);
        let add_dp = await db.ref('DP_url/' + username).set(url);
        alert('DP added');
        return url;
      })
      .catch(error => {
        console.log('Error in uploading!');
        reject(error);
      });
  });
}

//tell fl in cont or side mode
async function uploadAudio(
  username,
  title,
  fl,
  path,
  mime = 'application/octet-stream',
) {
  var audio_path = path;
  // username = update_name();
  // title = update_title();
  return new Promise((resolve, reject) => {
    let uploadBlob = null;
    const imageRef = stor
      .ref('audio')
      .child('aud_' + username + '_' + title + fl);

    fs.readFile(audio_path, 'base64')
      .then(data => {
        return Blob.build(data, {type: `${mime};BASE64`});
      })
      .then(blob => {
        uploadBlob = blob;
        return imageRef.put(blob, {contentType: mime});
      })
      .then(() => {
        uploadBlob.close();
        return imageRef.getDownloadURL();
      })
      .then(async url => {
        if (fl == 'cont') {
          await db
            .ref('Cont_Stories/' + username + '_' + title + '/aud_url')
            .set(url);
        } else {
          await db
            .ref(
              'Cont_Stories/' + username + '_' + title + '_side' + '/aud_url',
            )
            .set(url);
        }
        alert('Audio upload Complete!');
        resolve(url);
      })
      .catch(error => {
        console.log('Error in uploading!');
        reject(error);
      });
  });
}

async function downloadaudio_side(audio_url, username, title) {
  // let audio_check = await aud_exist(fl, username, title);
  // let aud_url = '-1';
  // if (audio_check == '0') {
  //   aud_url = '0';
  //   return aud_url;
  // } else {
  //   aud_url = audio_check;
  // }
  let task = RNBackgroundDownloader.download({
    id: 'fiyesle123',
    url: audio_url,
    destination:
      `${RNBackgroundDownloader.directories.documents}/` +
      username +
      '_' +
      title +
      `audio.aac`,
  })
    .begin(expectedBytes => {
      console.log(`Going to download ${expectedBytes} bytes!`);
    })
    .progress(percent => {
      console.log(`Downloaded: ${percent * 100}%`);
    })
    .done(() => {
      alert('Download is done!');
      return '1';
    })
    .error(error => {
      console.log('Download canceled due to error: ', error);
    });
}

//tell fl in cont or side mode
async function downloadaudio(fl, username, title) {
  let audio_check = await aud_exist(fl, username, title);
  let aud_url = '-1';
  if (audio_check == '0') {
    aud_url = '0';
    return aud_url;
  } else {
    aud_url = audio_check;
  }
  let task = RNBackgroundDownloader.download({
    id: 'fiyesle123',
    url: aud_url,
    destination:
      `${RNBackgroundDownloader.directories.documents}/` +
      username +
      '_' +
      title +
      `audio.aac`,
  })
    .begin(expectedBytes => {
      console.log(`Going to download ${expectedBytes} bytes!`);
    })
    .progress(percent => {
      console.log(`Downloaded: ${percent * 100}%`);
    })
    .done(() => {
      alert('Download is done!');
      return '1';
    })
    .error(error => {
      console.log('Download canceled due to error: ', error);
    });
}

async function aud_exist(fl, username, title) {
  let url_struct = '';

  if (fl == 'cont') {
    url_struct = await db
      .ref('Cont_Stories/' + username + '_' + title + '/aud_url')
      .once('value');
  } else {
    url_struct = await db
      .ref('Cont_Stories/' + username + '_' + title + '_side' + '/aud_url')
      .once('value');
  }
  var last_aud_url = url_struct.val();
  console.log('to be url:' + last_aud_url);
  if (last_aud_url == null) {
    return '0';
  } else {
    return last_aud_url;
  }
}

//only for cont mode,have to make for stor
async function get_story1(username, title) {
  var down_aud = await downloadaudio('cont', username, title);
  
  var story_html = await db
    .ref('Cont_Stories/' + username + '_' + title + '/story_HTML/')
    .once('value');

  let check_story = story_html.val();

  if (check_story === null) {
    return '-1';
  } else {
    return [check_story, down_aud];
  }
}

async function get_story_side(username, title) {
  var down_aud = await aud_exist('side', username, title);
  console.log('down_aud:'+down_aud)

  var story_dict = await db
    .ref('Cont_Stories/' + username + '_' + title + '_side' + '/side_dict/')
    .once('value');

  let story_side = story_dict.val();
  // console.log('yes');
  // console.log(story_side);
  var dict_html_aud = {};
  dict_html_aud['html_pic_dic'] = story_side;
  dict_html_aud['audio_url'] = down_aud;
  return dict_html_aud;
}

async function get_usernames() {
  var u_names = await db.ref('usernames/').once('value');
  return u_names.val();
}

async function get_titles(username) {
  var t_n = await db.ref('Titles/' + username).once('value');
  var t_names = t_n.val();
  return t_names;
}

async function get_title_pic(username, title) {
  var t_p = await db.ref('IMG_URL/' + username + '/' + title).once('value');
  var t_pic = t_p.val();
  return t_pic;
}

async function check_user(username) {
  var u_name = await db.ref('usernames/' + username).once('value');
  if (u_name.val() == null) {
    return '0';
  } else {
    return '1';
  }
}

async function check_password(username, old_password, new_password) {
  let u_pass = await db.ref('users/' + username).once('value');
  let result = u_pass.val();

  if (old_password != result.password) {
    alert('Current password incorrect!');
    return 0;
  } else {
    let ch_pass = await db
      .ref('users/' + username + '/' + 'password')
      .set(new_password);
    alert('Password Successfully changed!');
    return 1;
  }
}

async function get_dp(username) {
  var dp_url = await db.ref('DP_url/' + username).once('value');
  let pp_url = dp_url.val();
  // console.log('pp_url:' + pp_url);
  if (pp_url == null) {
    // alert("User has not uploaded DP!")
    return 0;
  } else {
    return pp_url;
  }
}

async function follow_user(curr_user, to_follow_user) {
  var f_user = await db
    .ref('Following/' + curr_user + '/' + to_follow_user)
    .set(to_follow_user);

  var f_user = await db
    .ref('Followers/' + to_follow_user + '/' + curr_user)
    .set(curr_user);
}

async function unfollow_user(curr_user, to_unfollow_user) {
  var f_user = await db
    .ref('Following/' + curr_user + '/' + to_unfollow_user)
    .set(null);

  var f_user = await db
    .ref('Followers/' + to_unfollow_user + '/' + curr_user)
    .set(null);
}

async function get_following(my_user) {
  var f_g = await db.ref('Following/' + my_user + '/').once('value');
  var fg_names = f_g.val();
  return fg_names;
}

async function get_followers(my_user) {
  var foll = await db.ref('Followers/' + my_user + '/').once('value');
  var fgr_names = foll.val();
  return fgr_names;
}

async function get_dp_list(list_users) {
  var list_dp_urls = [];
  for (var i = 0; i < list_users.length; i++) {
    var temp_dp_url = await get_dp(list_users[i]);
    var dp_url = temp_dp_url;
    if (dp_url == 0) {
      list_dp_urls.push('https://unsplash.it/550/?random');
    } else {
      list_dp_urls.push(dp_url);
    }
  }
  return list_dp_urls;
}

export {
  sign_up,
  get_usernames,
  sign_in,
  save_story,
  save_story_side,
  get_story1,
  get_story_side,
  check_image_index,
  uploadImage,
  uploadAudio,
  downloadaudio,
  downloadaudio_side,
  get_titles,
  get_title_pic,
  aud_exist,
  check_user,
  check_password,
  uploadImage_dp,
  get_dp,
  follow_user,
  unfollow_user,
  get_followers,
  get_following,
  get_dp_list,
};
