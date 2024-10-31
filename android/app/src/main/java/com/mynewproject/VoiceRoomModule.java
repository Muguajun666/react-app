package com.mynewproject;

import com.alivc.auimessage.model.token.IMNewToken;
import com.alivc.auimessage.model.token.IMNewTokenAuth;
import com.aliyun.auikits.biz.voiceroom.VoiceRoomServerConstant;
import com.aliyun.auikits.rtc.ClientMode;
import com.aliyun.auikits.voiceroom.callback.ActionCallback;
import com.aliyun.auikits.voiceroom.external.RtcInfo;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Arguments;

import com.aliyun.auikits.voiceroom.bean.*;
import com.aliyun.auikits.voiceroom.factory.AUIVoiceRoomFactory;
import com.aliyun.auikits.voice.ARTCVoiceRoomEngine;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;

import java.util.HashMap;
import java.util.Map;

public class VoiceRoomModule extends ReactContextBaseJavaModule {

    private static final String ROOM_MAP_KEY = "roomMap";

    private static Map<String, Object> roomMap = new HashMap<>();

    public VoiceRoomModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "VoiceRoomModule";
    }

    @ReactMethod
    public void createVoiceRoom(ReadableMap baseUserInfo, ReadableMap baseImInfo, ReadableMap baseRtcInfo, ReadableMap baseRoomInfo, Promise promise) {
        WritableMap response = new WritableNativeMap();
        try {
            // todo 先从roomMap里面找

            ARTCVoiceRoomEngine voiceRoom = AUIVoiceRoomFactory.createVoiceRoom();

            // 构建 UserInfo
            UserInfo userInfo = new UserInfo(baseUserInfo.getString("id"), baseUserInfo.getString("id"));
            userInfo.avatarUrl = baseUserInfo.isNull("avatar") ? "" : baseUserInfo.getString("avatar");
            userInfo.userName = baseUserInfo.getString("nickName");

            // 构建 IMNewTokenAuth
            IMNewTokenAuth imNewTokenAuth = new IMNewTokenAuth();
            imNewTokenAuth.nonce = baseImInfo.getString("nonce");
            imNewTokenAuth.user_id = baseImInfo.getString("userId");
            imNewTokenAuth.role = baseImInfo.getString("role");
            imNewTokenAuth.timestamp = Long.parseLong(baseImInfo.getString("timestamp"));

            // 构建 IMNewToken
            IMNewToken imNewToken = new IMNewToken();
            imNewToken.app_id = baseImInfo.getString("appId");
            imNewToken.app_sign = baseImInfo.getString("appSign");
            imNewToken.app_token = baseImInfo.getString("appToken");
            imNewToken.auth = imNewTokenAuth;

            // 构建 createUser
            UserInfo createUser = null;
            String createUserId = baseRoomInfo.getString("createUser");
            if (userInfo.userId.equals(createUserId)) {
                createUser = userInfo;
            } else {
                createUser = new UserInfo(createUserId, createUserId);
            }

            // 构建 RoomInfo
            RoomInfo roomInfo = new RoomInfo(baseRoomInfo.getString("aliRoomId"));
            roomInfo.xqRoomId = baseRoomInfo.getInt("id");
            roomInfo.creator = createUser;

            // 构建 RtcInfo
            RtcInfo rtcInfo = new RtcInfo(baseRtcInfo.getString("rtcToken"), Long.parseLong(baseRtcInfo.getString("timestamp")), VoiceRoomServerConstant.RTC_GLSB);

            // 构建 joinRoomCallback
            ActionCallback joinRoomCallback = new ActionCallback() {
                @Override
                public void onResult(int code, String msg, Map<String, Object> params) {
                    System.out.println("--------------joinRoom-------------");
                    System.out.println(code);
                    System.out.println(msg);
                    System.out.println(params);
                    System.out.println("--------------joinRoom-------------");
                    if (code == 0) {
                        response.putBoolean("result",true);
                        response.putString("msg","加入房间成功");
                        promise.resolve(response);
                    } else {
                        response.putBoolean("result",false);
                        response.putString("msg","加入房间失败");
                        promise.resolve(response);
                    }
                }
            };

            // 构建 initRoomCallback
            ActionCallback initRoomCallback = new ActionCallback(){
                @Override
                public void onResult(int code, String msg, Map<String, Object> params) {
                    System.out.println("--------------initRoom-------------");
                    System.out.println(code);
                    System.out.println(msg);
                    System.out.println(params);
                    System.out.println("--------------initRoom-------------");
                    if (code == 0) {
                        roomMap.put(baseRoomInfo.getString("aliRoomId"), voiceRoom);
//                        voiceRoom.joinRoom(roomInfo, rtcInfo, joinRoomCallback);
                        response.putBoolean("result",true);
                        response.putString("msg","初始化房间成功");
                        promise.resolve(response);
                    } else {
                        roomMap.remove(baseRoomInfo.getString("aliRoomId"));
                        voiceRoom.release();
                        response.putBoolean("result",false);
                        response.putString("msg","初始化失败");
                        promise.resolve(response);
                    }
                }
            };
            voiceRoom.init(getReactApplicationContext(), ClientMode.VOICE_ROOM, VoiceRoomServerConstant.APP_ID, userInfo, imNewToken, initRoomCallback);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            response.putBoolean("result",false);
            response.putString("msg","异常报错");
            promise.resolve(response);
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String helloWorld() {
        return "Hello World";
    }

    @ReactMethod
    public void helloWorldPromise(Promise promise) {
        promise.resolve("Hello World");
    }
}
