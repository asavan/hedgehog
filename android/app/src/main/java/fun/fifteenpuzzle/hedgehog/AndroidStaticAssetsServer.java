package fun.fifteenpuzzle.hedgehog;

import android.content.Context;
import android.util.Log;

import java.io.IOException;
import java.io.InputStream;

import fi.iki.elonen.NanoHTTPD;

public class AndroidStaticAssetsServer extends NanoHTTPD {
    private final Context context;
    private final String folderToServe;
    private static final String DEFAULT_STATIC_FOLDER = "dist";
    private static final String DEFAULT_LOGGER_TAG = "STATIC_TAG";

    public AndroidStaticAssetsServer(Context context, int port, String folderToServe) throws IOException {
        super(port);
        this.context = context;
        this.folderToServe = folderToServe;
        start(NanoHTTPD.SOCKET_READ_TIMEOUT, false);

    }

    public AndroidStaticAssetsServer(Context context, int port) throws IOException {
        this(context, port, DEFAULT_STATIC_FOLDER);
    }

    // override here
    public String onRequest(String file) {
        return file;
    }

    @Override
    public Response serve(IHTTPSession session) {
        if (session.getMethod() != Method.GET) {
            return notFound();
        }
        String file = session.getUri();
        if ("/".equals(file)) {
            file = "index.html";
        }

        if (file.startsWith("/")) {
            file = file.substring(1);
        }
        if (file.startsWith(".")) {
            file = file.substring(1);
        }

        file = onRequest(file);
        String fileWithFolder = folderToServe + "/" + file;
        try {
            InputStream is = context.getAssets().open(fileWithFolder);
            return newChunkedResponse(Response.Status.OK, getMimeTypeForFile(file), is);
        } catch (IOException e) {
            Log.e(DEFAULT_LOGGER_TAG, "AndroidStaticAssetsServer", e);
        }
        return notFound();
    }

    private static Response notFound() {
        return newFixedLengthResponse(Response.Status.NOT_FOUND, NanoHTTPD.MIME_PLAINTEXT, "Not Found");
    }
}
