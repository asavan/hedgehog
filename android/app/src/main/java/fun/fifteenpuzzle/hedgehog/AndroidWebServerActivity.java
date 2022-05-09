package fun.fifteenpuzzle.hedgehog;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;

import com.google.androidbrowserhelper.trusted.TwaLauncher;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.URLEncoder;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import androidx.appcompat.app.AppCompatActivity;


public class AndroidWebServerActivity extends AppCompatActivity {
    private static final int STATIC_CONTENT_PORT = 8080;
    private static final String WEB_GAME_URL = "https://hedgehoghorse.ml";
    public static final String LOCAL_IP = "127.0.0.1";
    private static final String DEFAULT_LOGGER_TAG = "ACTIVITY_TAG";
    public static final String WEB_VIEW_URL = "file:///android_asset/www/index.html";
    private AndroidStaticAssetsServer server;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        Context applicationContext = getApplicationContext();

        String formattedIpAddress = getIPAddress();
        final String host;
        if (formattedIpAddress != null) {
            host = getStaticHost(formattedIpAddress);
        } else {
            host = getStaticHost(LOCAL_IP);
        }

        try {
            server = new AndroidStaticAssetsServer(applicationContext, STATIC_CONTENT_PORT, "www");

            addButtons(host);

            Map<String, String> mainParams = new LinkedHashMap<>();
            mainParams.put("lang", Locale.getDefault().getLanguage());
            mainParams.put("sound", "1");
            launchWebView(WEB_VIEW_URL, mainParams);

            // launchWebView(WEB_VIEW_URL, mainParams);
            // launchWebView(getStaticHost(LOCAL_IP), mainParams);
        } catch (IOException e) {
            Log.e(DEFAULT_LOGGER_TAG, "main", e);
        }
    }

    private void addButtons(String host) {
        Map<String, String> mainParams = new LinkedHashMap<>();
        mainParams.put("sound", "1");
        {
            addButton(host, mainParams, R.id.button1);
            addButtonTwa(WEB_GAME_URL, mainParams, R.id.button3);
            addButtonWebView(WEB_VIEW_URL, mainParams, R.id.webviewb);
        }
    }

    private void addButton(final String host, Map<String, String> parameters, int id) {
        Button btn = findViewById(id);
        btn.setOnClickListener(v -> {
            Uri launchUri = Uri.parse(getLaunchUrl(host, parameters));
            startActivity(new Intent(Intent.ACTION_VIEW, launchUri));
        });
    }

    private void addButtonWebView(final String host, Map<String, String> parameters, int id) {
        Button btn = findViewById(id);
        btn.setOnClickListener(v -> {
            launchWebView(host, parameters);
        });
    }

    private void launchWebView(String host, Map<String, String> parameters) {
        Intent intent = new Intent(getApplicationContext(), WebViewActivity.class);
        String launchUrl = getLaunchUrl(host, parameters);
        Log.i(DEFAULT_LOGGER_TAG, launchUrl);
        intent.putExtra("url", launchUrl);
        startActivity(intent);
    }

    private void addButtonTwa(String host, Map<String, String> parameters, int id) {
        addButtonTwa(host, parameters, id, null);
    }

    private void addButtonTwa(String host, Map<String, String> parameters, int id, String text) {
        Button btn = findViewById(id);
        if (text != null) {
            btn.setText(text);
        }
        btn.setOnClickListener(v -> launchTwa(host, parameters));
    }

    private void launchTwa(String host, Map<String, String> parameters) {
        Uri launchUri = Uri.parse(getLaunchUrl(host, parameters));
        TwaLauncher launcher = new TwaLauncher(this);
        launcher.launch(launchUri);
        // startActivity(new Intent(Intent.ACTION_VIEW, launchUri, context, LauncherActivity.class));
    }

    private static String urlEncodeUTF8(String s) {
        try {
            return URLEncoder.encode(s, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            throw new UnsupportedOperationException(e);
        }
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

    private static String getLaunchUrl(String host, Map<String, String> parameters) {
        StringBuilder b = new StringBuilder();
        b.append(host);
//        if (!host.endsWith("/") && parameters != null) {
//            b.append("/");
//        }
        if (parameters != null) {
            b.append("?").append(mapToParamString(parameters));
        }
        return b.toString();
    }


    private static boolean isHostLocal(String host) {
        return host.contains(LOCAL_IP);
    }


    public static String getIPAddress() {
        try {
            List<NetworkInterface> interfaces = Collections.list(NetworkInterface.getNetworkInterfaces());

            for (NetworkInterface interface_ : interfaces) {
                for (InetAddress inetAddress : Collections.list(interface_.getInetAddresses())) {
                    if (inetAddress.isLoopbackAddress()) {
                        continue;
                    }

                    String ipAddr = inetAddress.getHostAddress();
                    boolean isIPv4 = ipAddr.indexOf(':') < 0;
                    if (!isIPv4) {
                        continue;
                    }
                    return ipAddr;
                }

            }
        } catch (Exception e) {
            Log.e(DEFAULT_LOGGER_TAG, "getIPAddress", e);
        }
        return null;
    }

    private static String getStaticHost(String ip) {
        return "http://" + ip + ":" + STATIC_CONTENT_PORT;
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (server != null) {
            server.stop();
        }
    }
}
