package fun.fifteenpuzzle.hedgehog;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

public class MainActivity extends Activity {

    public static final String WEB_VIEW_URL = "file:///android_asset/www/index.html";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_webview);
        Map<String, String> mainParams = new LinkedHashMap<>();
        mainParams.put("lang", Locale.getDefault().getLanguage());
        mainParams.put("sound", "1");

        String launchUrl = getLaunchUrl(WEB_VIEW_URL, mainParams);
        WebView webView = (WebView) findViewById(R.id.web);
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webView.loadUrl(launchUrl);
    }

    private static String getLaunchUrl(String host, Map<String, String> parameters) {
        StringBuilder b = new StringBuilder();
        b.append(host);
        if (parameters != null) {
            b.append("?").append(mapToParamString(parameters));
        }
        return b.toString();
    }

    private static String mapToParamString(Map<String, String> parameters) {
        StringBuilder acc = new StringBuilder();
        boolean firstElem = true;
        for (Map.Entry<String, String> p : parameters.entrySet()) {
            if (!firstElem) {
                acc.append("&");
            }
            firstElem = false;
            acc.append(p.getKey()).append("=").append(urlEncodeUTF8(p.getValue()));
        }
        return acc.toString();
    }

    private static String urlEncodeUTF8(String s) {
        try {
            return URLEncoder.encode(s, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            throw new UnsupportedOperationException(e);
        }
    }
}
