/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var plot;
var notificationsArray = [];//array of notifications. for future...
var userViewed = false;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

        document.addEventListener('resume', this.onResume, false);
        document.addEventListener('pause', this.onPause, false);

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'  
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        // navigator.geolocation.getCurrentPosition(onSuccess, onError);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

        app.loadPlot();

    },
    //intialize plot
    loadPlot: function() {

        plot = cordova.require("cordova/plugin/plot"); 

        //add notification handler
        // plot.notificationHandler = function(notification, notificationData) {

        //     console.log('notificationHandler called.');

        //     setTimeout(function(){

        //         console.log('setTimeout called.');
        //         app.getSentNotifications();

        //     }, 0);
        // };

        //Optional, by default the data is treated as set in the dashboard.
        plot.init();
    }, 
    //cear all notifications form plot
    clearNotifications: function() {

        console.log('clearNotifications is called.');

        plot.clearSentNotifications ( function () {

            hideNotificationTags();

            // alert("All notifications were successfully cleared.");

        }, function () {

            alert("Notifications' clear is failed.");

        });
    },
    //get and show all notifications form plot
    getSentNotifications: function() {

        $('#notification_list').empty();
    
        plot.sentNotifications( function (notifications) {

            if (notifications.length > 0) {
                
                userViewed = true;
                showNotificationTags ();    
            } else {

                console.log('There are no notifications.');

                userViewed = false;
                hideNotificationTags ();
                return;
            }           

            notificationsArray = notifications;

             for (var i = 0; i < notifications.length; i++) {

                var txt = '<li class="list" data-index="'+i+'"';
                txt += '"><a href="#" '
                txt += 'class="ui-btn ui-btn-icon-right ui-icon-carat-r"';
                txt += '>';
                txt += notifications[i].message;
                txt += '</a></li>';

                $("#notification_list").append($(txt));
            }

        }, function () {

            alert("sentNotifications failed");
        });
    }, 
    onResume() {
    // Handle the resume event
        console.log('onResume called.');

        setTimeout(function(){

            console.log('setTimeout called.');
            app.getSentNotifications();

        }, 0);

    },
    onPause() {
    // Handle the pause event
        console.log('onPause called.');

        if (userViewed == true)
            app.clearNotifications();

    }

};

$(document).ready(function () {

    //fully shows notification's message 
    $('body').on ('click', '.list', function () {

        var index = $(this).data('index');

        var notification = notificationsArray[index];
        
        if (notification.data) {

            cordova.InAppBrowser.open(notification.data, '_system', 'location=yes');
            
        } else {

            alert(notification.message);
        }

        return;
    });


});

//shows none notification
function hideNotificationTags() {

    $('#notification_list').css('display', 'none');

    $('#no_notification_title').css('display', 'block');
    $('#no_notification_message').css('display', 'block');
}

//shows notifications
function showNotificationTags () {

    $('#notification_list').css('display', 'block');

    $('#no_notification_title').css('display', 'none');
    $('#no_notification_message').css('display', 'none');
}