package fun.fifteenpuzzle.hedgehog;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

public class MainActivity extends Activity {

    public static final String WEB_VIEW_URL = "file:///android_asset/www/index.html";

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_webview);
        WebView webView = (WebView) findViewById(R.id.web);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webView.loadUrl(makeStartUrl());
    }

    private static String makeStartUrl() {
        Map<String, String> mainParams = new LinkedHashMap<>();
        mainParams.put("lang", Locale.getDefault().getLanguage());
        mainParams.put("sound", "1");
        return UrlUtils.getLaunchUrl(WEB_VIEW_URL, mainParams);
    }
}
