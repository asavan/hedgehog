package fun.fifteenpuzzle.hedgehog;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Map;

public class UrlUtils {
    public static String getLaunchUrl(String host, Map<String, String> parameters) {
        StringBuilder b = new StringBuilder();
        b.append(host);
        if (parameters != null && !parameters.isEmpty()) {
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
