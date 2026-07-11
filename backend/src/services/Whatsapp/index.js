'use strict';

const camera = require('./camera');
const media = require('./media');
const webrtc = require('./webrtc');

module.exports = {
  uploadMedia: media.sendMessage,
  captureCamera: camera.capture,
  startCall: webrtc.startCall,
  endCall: webrtc.endCall
};