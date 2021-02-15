"use strict";

var apn = require("apn");
// var gcm = require('node-gcm')
var apnstopic = process.env.APNS_TOPIC;
var optionsP12 = {
    pfx: process.env.APPLE_P12_FILE_PATH,
    passphrase: process.env.APPLE_P12_PASSWORD,
    production: parseInt(process.env.IS_PRODUCTION)
};
var apnProvider = new apn.Provider(optionsP12);

const userService = require('../services/userService')
class pushNotification {

    async sendPush(module, dTknList, payload, data) {
        try {
            let title = '', message = '', mod_nm = '';
            switch (module) {
                case 1:  // for send friend request
                    title = 'Friend Request'
                    message = 'New friend request has been sent by ' + data.sndr_name;
                    mod_nm = 'friend_request_new'
                    break;
                case 2:  // for update friend request
                    if (data.isAccept == 1) {
                        title = 'Friend Request'
                        message = 'Your friend request has been accepted by ' + data.sndr_name
                        mod_nm = 'friend_request_accepted'
                    } else {
                        title = 'Friend Request'
                        message = 'Your friend request has been rejected by ' + data.sndr_name
                        mod_nm = 'friend_request_rejected'
                    }

                    break;
                case 3:   // sharing halfway code
                    title = 'halfway Code'
                    // message = 'New halfway code has been shared by ' + data.sndr_name
                    message = "" + data.sndr_name + ": has shared halfway Code "
                    mod_nm = 'halfway_code_shared'
                    break;
                case 4:   // halfway code update
                    title = 'halfway Code'
                    message = 'halfway code ' + data.code_name + ' has been updated by ' + data.sndr_name
                    mod_nm = 'halfway_code_updated'
                    break;
            }
            if (dTknList.length != 0) {
                dTknList.forEach(dTkn => {
                    payload['module_nm'] = mod_nm;
                    let notePayload = {
                        'd_tkn': dTkn.token,
                        'd_typ': dTkn.type,
                        'title': title,
                        'message': message,
                        'payload': payload
                    };
                    if (module == 3) {
                        let gc = payload.halfwayCode;
                        console.log("-----------", gc)
                        let halfwayCodeString = "";
                        if (gc.clr_1 != undefined && gc.clr_1 != null) {
                            halfwayCodeString = "" +
                                ((gc.vib_ptrn.toString(16).length < 2) ? '0' : '') + gc.vib_ptrn.toString(16) +

                                ((gc.ptrn_1) ? (((gc.ptrn_1.toString(16).length < 2) ? '0' : '') + gc.ptrn_1.toString(16)) : '') +
                                ((gc.clr_1) ? gc.clr_1.substring(1, gc.clr_1.length) : '') +

                                ((gc.ptrn_2) ? (((gc.ptrn_2.toString(16).length < 2) ? '0' : '') + gc.ptrn_2.toString(16)) : '') +
                                ((gc.clr_2) ? gc.clr_2.substring(1, gc.clr_2.length) : '') +

                                ((gc.ptrn_3) ? (((gc.ptrn_3.toString(16).length < 2) ? '0' : '') + gc.ptrn_3.toString(16)) : '') +
                                ((gc.clr_3) ? gc.clr_3.substring(1, gc.clr_3.length) : '')


                            let halfwayCodeHex = ((halfwayCodeString.length / 2) + 1).toString(16);
                            notePayload.message += "" + ((halfwayCodeHex.length < 2) ? "0" : "") + halfwayCodeHex + halfwayCodeString;
                        } else {

                            halfwayCodeString = "" + ((gc.vib_ptrn.toString(16).length < 2) ? '0' : '') + gc.vib_ptrn.toString(16) +
                                ((gc.alert.toString(16).length < 2) ? '0' : '') + gc.alert.toString(16) +
                                ((gc.ptrn.toString(16).length < 2) ? '0' : '') + gc.ptrn.toString(16) + gc.clr.substring(1, gc.clr.length);
                            notePayload.message += "" + halfwayCodeString;

                        }
                        console.log("===============", halfwayCodeString, " --------", halfwayCodeString.length)

                        console.log("===============", notePayload.message)

                    }
                    if (dTkn._id) {
                        let code_count = 1;
                        for (let i = 0; i < payload.received_code_counts.length; i++) {
                            if (payload.received_code_counts[i]._id.toString() === dTkn._id.toString()) {
                                code_count = payload.received_code_counts[i].codesCount;
                                break;
                            }
                        }
                        notePayload.payload['received_code_count'] = code_count;
                    }
                    new pushNotification().send(notePayload)
                });

            }
            return true;
        } catch (error) {
            console.log("Error in forming messages:", error);
            return false;
        }
    }
    async send(data) {
        try {
            var deviceType = data.d_typ; // os type
            var deviceToken = data.d_tkn; // device Token

            switch (deviceType) {
                // this is to send notification to ios
                case 1:

                    let note = new apn.Notification();
                    note.alert = data.message;
                    note.topic = apnstopic;
                    // if (data.badge) {
                    //     note.aps.badge = data.badge;
                    // } else {
                    //     note.aps.badge = 0;
                    // }
                    note.aps.payload = data.payload;
                    note.aps.sound = 'default';
                    // note.aps["content-available"] = 1;

                    let result = await apnProvider.send(note, deviceToken);
                    console.log(" Response for ios push = ", JSON.stringify(result))
                    break;

                // this is to send notifications for android
                case 2:
                    console.log("Sending Android message ");

                    var message = {
                        registration_ids: [deviceToken],
                        priority: "high",
                        data: {
                            message: data.message,
                            body: {
                                title: data.title,
                            }
                        }
                    }

                    if (data.payload) {
                        message.data.payload = data.payload
                    }
                    // var msg = new gcm.Message(message);

                    // var sender = new gcm.Sender(process.env.ANDROID_API_KEY);

                    // await sender.send(msg, {
                    //     registrationTokens: [ deviceToken ]
                    // }, function(err, response) {
                    //     if (err) {
                    //         console.error("Error: ", err);
                    //     } else {
                    //         console.log("Success: ", response);
                    //     }
                    // });

                    break;
            }
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }

    }
}

module.exports = new pushNotification();