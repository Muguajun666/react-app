package com.mynewproject;

import androidx.annotation.NonNull;

import com.alibaba.fastjson.JSON;
import com.alivc.auimessage.model.token.IMNewToken;
import com.alivc.auimessage.model.token.IMNewTokenAuth;
import com.alivc.rtc.AliRtcEngine;
import com.aliyun.auikits.biz.voiceroom.VoiceRoomServerConstant;
import com.aliyun.auikits.rtc.ClientMode;
import com.aliyun.auikits.single.Singleton;
import com.aliyun.auikits.single.server.Server;
import com.aliyun.auikits.voice.ARTCVoiceRoomEngineDelegate;
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
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class VoiceRoomModule extends ReactContextBaseJavaModule {

    private static final String ROOM_MAP_KEY = "roomMap";

    protected Map<String, ARTCVoiceRoomEngine> roomMap = new HashMap<String, ARTCVoiceRoomEngine>();
    protected UserInfo userInfo;
    protected IMNewTokenAuth imNewTokenAuth;
    protected IMNewToken imNewToken;
    protected UserInfo createUser;
    protected RoomInfo roomInfo;
    protected RtcInfo rtcInfo;
    protected ARTCVoiceRoomEngineDelegate voiceRoomObserver;

    public VoiceRoomModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "VoiceRoomModule";
    }

    // 设置授权token
    @ReactMethod
    public void setAuthorizeToken(String authorization, Promise promise) {
        System.out.println("---------authorization----------");
        System.out.println(authorization);
        Singleton.getInstance(Server.class).setAuthorizeToken(authorization);
        promise.resolve(null);
    }

    // 创建房间实例
    @ReactMethod
    public void createVoiceRoom(ReadableMap baseUserInfo, ReadableMap baseImInfo, ReadableMap baseRtcInfo, ReadableMap baseRoomInfo, Promise promise) {
        WritableMap response = new WritableNativeMap();
        try {
            // 先从roomMap里面找
            ARTCVoiceRoomEngine voiceRoom;
            if (roomMap.containsKey(baseRoomInfo.getString("aliRoomId"))) {
                voiceRoom = roomMap.get(baseRoomInfo.getString("aliRoomId"));
                System.out.println("已有房间实例");
            } else {
                voiceRoom = AUIVoiceRoomFactory.createVoiceRoom();
                System.out.println("新建房间实例");
            }
            // 构建 UserInfo
            UserInfo userInfo = new UserInfo(baseUserInfo.getString("id"), baseUserInfo.getString("id"));
            userInfo.avatarUrl = baseUserInfo.isNull("avatar") ? "null" : baseUserInfo.getString("avatar");
            userInfo.userName = baseUserInfo.getString("nickName");
            this.userInfo = userInfo;

            // 构建 IMNewTokenAuth
            IMNewTokenAuth imNewTokenAuth = new IMNewTokenAuth();
            imNewTokenAuth.nonce = baseImInfo.getString("nonce");
            imNewTokenAuth.user_id = baseImInfo.getString("userId");
            imNewTokenAuth.role = baseImInfo.getString("role");
            imNewTokenAuth.timestamp = Long.parseLong(baseImInfo.getString("timestamp"));
            this.imNewTokenAuth = imNewTokenAuth;

            // 构建 IMNewToken
            IMNewToken imNewToken = new IMNewToken();
            imNewToken.app_id = baseImInfo.getString("appId");
            imNewToken.app_sign = baseImInfo.getString("appSign");
            imNewToken.app_token = baseImInfo.getString("appToken");
            imNewToken.auth = imNewTokenAuth;
            this.imNewToken = imNewToken;

            // 构建 createUser
            UserInfo createUser = null;
            String createUserId = baseRoomInfo.getString("createUser");
            if (userInfo.userId.equals(createUserId)) {
                createUser = userInfo;
            } else {
                createUser = new UserInfo(createUserId, createUserId);
            }
            this.createUser = createUser;

            // 构建 RoomInfo
            RoomInfo roomInfo = new RoomInfo(baseRoomInfo.getString("aliRoomId"));
            roomInfo.xqRoomId = baseRoomInfo.getInt("id");
            roomInfo.creator = createUser;
            this.roomInfo = roomInfo;

            // 构建 RtcInfo
            this.rtcInfo = new RtcInfo(baseRtcInfo.getString("rtcToken"), Long.parseLong(baseRtcInfo.getString("timestamp")), VoiceRoomServerConstant.RTC_GLSB);

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
                        response.putBoolean("result",true);
                        response.putString("msg","初始化成功");
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

    // 加入房间
    @ReactMethod
    public void joinRoom(String aliRoomId, Promise promise) {
        WritableMap response = new WritableNativeMap();
        ReactContext reactContext = getReactApplicationContext();
        ARTCVoiceRoomEngine voiceRoom = roomMap.get(aliRoomId);

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



        this.voiceRoomObserver = new VoiceRoomObserver() {
            @Override
            public void onJoin(String roomId, String uid) {
                WritableMap params = Arguments.createMap();
                params.putString("roomId", roomId);
                params.putString("uid", uid);
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("onJoin", params);
            }

            @Override
            public void onJoinedRoom(UserInfo userInfo) {
                String jsonUserInfo = JSON.toJSONString(userInfo);
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("onJoinedRoom", jsonUserInfo);
            }

            @Override
            public void onLeave() {
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("onLeave", null);
            }

            @Override
            public void onJoinedMic(UserInfo userInfo) {
                String jsonUserInfo = JSON.toJSONString(userInfo);
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("onJoinedMic", jsonUserInfo);
            }

            @Override
            public void onLeavedMic(UserInfo userInfo) {
                String jsonUserInfo = JSON.toJSONString(userInfo);
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("onLeavedMic", jsonUserInfo);
            }
        };



        voiceRoom.addObserver(this.voiceRoomObserver);
        voiceRoom.joinRoom(this.roomInfo, this.rtcInfo, joinRoomCallback);
    }

    // 离开房间
    @ReactMethod
    public void leaveRoom(String aliRoomId, Promise promise) {
        ARTCVoiceRoomEngine voiceRoom = roomMap.get(aliRoomId);
        ARTCVoiceRoomEngineDelegate voiceRoomObserver = this.voiceRoomObserver;

        // 构建离开房间回调
        ActionCallback leaveRoomCallback = new ActionCallback(){
            @Override
            public void onResult(int code, String msg, Map<String, Object> params) {
                System.out.println("--------------leaveRoom-------------");
                System.out.println(code);
                System.out.println(msg);
                System.out.println(params);
                System.out.println("--------------leaveRoom-------------");
                if (code == 0) {
                    System.out.println("离开房间成功");
                    voiceRoom.removeObserver(voiceRoomObserver);
                    voiceRoom.release();
                    roomMap.remove(aliRoomId);
                    promise.resolve(true);
                } else {
                    System.out.println("离开房间失败");
                    promise.resolve(false);
                }
            }
        };

        // 离开房间
        if (voiceRoom != null) {
            voiceRoom.leaveRoom(leaveRoomCallback);
        } else {
            System.out.println("房间实例不存在");
            promise.resolve(false);
        }
    }

    // 获取麦位信息
    @ReactMethod
    public void getMicInfoList(String aliRoomId, Promise promise) {
        ARTCVoiceRoomEngine voiceRoom = roomMap.get(aliRoomId);
        ReactContext reactContext = getReactApplicationContext();

        VoiceRoomObserver roomObserver = new VoiceRoomObserver() {
            @Override
            public void onRoomMicListChanged(List<UserInfo> micUsers) {
                String jsonMicUsers = JSON.toJSONString(micUsers);
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("onRoomMicListChanged", jsonMicUsers);
                final WeakReference<VoiceRoomObserver> tempVoiceRoomObserver = new WeakReference<>(this);
                voiceRoom.removeObserver(tempVoiceRoomObserver.get());
                promise.resolve(null);
            }
        };

        voiceRoom.addObserver(roomObserver);
        voiceRoom.listMicUserList(new ActionCallback() {
            @Override
            public void onResult(int code, String msg, Map<String, Object> params) {
                if (code != 0) {
                    voiceRoom.removeObserver(roomObserver);
                    promise.resolve(null);
                }
            }
        });
    }

    // 上麦
    @ReactMethod
    public void joinMic(String aliRoomId, ReadableMap baseMicInfo, Promise promise) {
        WritableMap response = new WritableNativeMap();
        ReactContext reactContext = getReactApplicationContext();
        ARTCVoiceRoomEngine voiceRoom = roomMap.get(aliRoomId);
        Boolean microphoneSwitch = baseMicInfo.getBoolean("microphoneSwitch");
        int micIndex = baseMicInfo.getInt("micIndex");

        VoiceRoomObserver roomObserver = new VoiceRoomObserver() {
            @Override
            public void onResponseMic(MicRequestResult rs) {
                System.out.println(rs.micPosition);
                MicInfo micInfo = new MicInfo(rs.micPosition, !microphoneSwitch);
                final WeakReference<VoiceRoomObserver> tempVoiceRoomObserver = new WeakReference<>(this);
                voiceRoom.joinMic(micInfo, new ActionCallback() {
                    @Override
                    public void onResult(int code, String msg, Map<String, Object> params) {
                        System.out.println("--------------joinMic-------------");
                        System.out.println(code);
                        System.out.println(msg);
                        System.out.println(params);
                        System.out.println("--------------joinMic-------------");
                        if(tempVoiceRoomObserver.get() != null) {
                            voiceRoom.removeObserver(tempVoiceRoomObserver.get());
                        }
                    }
                });
            }
        };

        voiceRoom.addObserver(roomObserver);
        voiceRoom.requestMic(micIndex, new ActionCallback() {
            @Override
            public void onResult(int code, String msg, Map<String, Object> params) {
                System.out.println("--------------requestMic-------------");
                System.out.println(code);
                System.out.println(msg);
                System.out.println(params);
                System.out.println("--------------requestMic-------------");
                if (code != 0) {
//                    voiceRoom.removeObserver(roomObserver);
                    response.putBoolean("result",false);
                    response.putString("msg","请求上麦失败");
                    promise.resolve(response);
                } else {
                    response.putBoolean("result",true);
                    response.putString("msg","请求上麦成功");
                    promise.resolve(response);
                }
            }
        });
    }

    // 下麦
    @ReactMethod
    public void leaveMic(String aliRoomId, Promise promise) {
        WritableMap response = new WritableNativeMap();
        ReactContext reactContext = getReactApplicationContext();
        ARTCVoiceRoomEngine voiceRoom = roomMap.get(aliRoomId);

        voiceRoom.leaveMic(new ActionCallback() {
            @Override
            public void onResult(int code, String msg, Map<String, Object> params) {
                System.out.println("--------------leaveMic-------------");
                System.out.println(code);
                System.out.println(msg);
                System.out.println(params);
                System.out.println("--------------leaveMic-------------");
                if (code == 0) {
                    response.putBoolean("result",true);
                    response.putString("msg","下麦成功");
                    promise.resolve(response);
                } else {
                    response.putBoolean("result",false);
                    response.putString("msg","下麦失败");
                    promise.resolve(response);
                }
            }
        });
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
