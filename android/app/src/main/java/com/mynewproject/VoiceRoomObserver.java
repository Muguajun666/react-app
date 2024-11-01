package com.mynewproject;

import com.alivc.rtc.AliRtcEngine;
import com.aliyun.auikits.voice.ARTCVoiceRoomEngineDelegate;
import com.aliyun.auikits.voiceroom.bean.AccompanyPlayState;
import com.aliyun.auikits.voiceroom.bean.MicRequestResult;
import com.aliyun.auikits.voiceroom.bean.UserInfo;

import java.util.List;

public abstract class VoiceRoomObserver implements ARTCVoiceRoomEngineDelegate {

    @Override
    public void onJoin(String roomId, String uid) {}

    @Override
    public void onJoinedRoom(UserInfo userInfo) {}

    @Override
    public void onLeave() {}

    @Override
    public void onLeavedRoom(UserInfo userInfo) {}

    @Override
    public void onKickOutRoom() {}

    @Override
    public void onDismissRoom(String commander) {
    }

    @Override
    public void onJoinedMic(UserInfo userInfo) {
    }

    @Override
    public void onLeavedMic(UserInfo userInfo) {
    }

    @Override
    public void onResponseMic(MicRequestResult micRequestResult) {}

    @Override
    public void onReceivedTextMessage(UserInfo userInfo, String text) {}

    @Override
    public void onMicUserMicrophoneChanged(UserInfo userInfo, boolean open) {}

    @Override
    public void onMicUserSpeakStateChanged(UserInfo userInfo) {}

    @Override
    public void onNetworkStateChanged(UserInfo userInfo) {}

    @Override
    public void onError(int code, String msg) {}

    @Override
    public void onMute(boolean mute) {}

    @Override
    public void onExitGroup(String msg) {}

    @Override
    public void onRoomMicListChanged(List<UserInfo> micUsers) {}

    @Override
    public void onDataChannelMessage(String uid, AliRtcEngine.AliRtcDataChannelMsg msg) {}

    @Override
    public void onAccompanyStateChanged(AccompanyPlayState state) {}

    @Override
    public void onMemberCountChanged(int count) {}

    @Override
    public void onVoiceRoomDebugInfo(String msg) {}
}