package com.biscosiddhi

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.jstasks.HeadlessJsTaskConfig
import com.facebook.react.bridge.Arguments

class LocationTaskService : HeadlessJsTaskService() {

    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig {
        val data = Arguments.createMap()  // ✔ empty WritableMap

        return HeadlessJsTaskConfig(
            "LocationTask",
            data,           
            5000,            
            true           
        )
    }
}
