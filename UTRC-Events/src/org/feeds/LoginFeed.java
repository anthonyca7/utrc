package org.feeds;

import com.mongodb.DBCollection;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.conn.ssl.X509HostnameVerifier;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.SingleClientConnManager;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Set;


public class LoginFeed extends Feed {
    private final HashMap<String, String> postData;

    public LoginFeed(String url, DBCollection collection, String[] path, MongoQuery query, int interval,
                     HashMap<String, String> postData) {
        super(url, collection, path, query, interval);

        this.postData = postData;
    }

    @Override
    protected void getInsertingMessage(int inserted, int total, String url) {
        super.getInsertingMessage(inserted, total, url + " for " + postData.get("dataType"));
    }

    @Override
    public void connect() {
        try {
            HttpsURLConnection.setDefaultHostnameVerifier( new HostnameVerifier(){
                public boolean verify(String string,SSLSession ssls) {
                    return true;
                }
            });

            URL uri = new URL(this.getUrl());
            HttpsURLConnection connection = (HttpsURLConnection) uri.openConnection();
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            DataOutputStream pw = new DataOutputStream(connection.getOutputStream());

            HashMap<String, String> postData = getPostData();
            Set<String> parameters = postData.keySet();
            StringBuilder data = new StringBuilder();

            for (String parameter : parameters) {
                String value = postData.get(parameter);
                data.append("&" + URLEncoder.encode(parameter) + "=" + URLEncoder.encode(value));
            }

            String post = data.substring(1);

            pw.writeBytes(post);
            pw.flush();
            pw.close();

            BufferedReader in = new BufferedReader(
                    new InputStreamReader(connection.getInputStream()));
            String inputLine;

            StringBuilder response = new StringBuilder();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            Thread.sleep(10000);

            this.setResponse(response.toString());
        }
        catch (Exception ex) {
            System.out.println("Error getting feed from " + getUrl() + ": " + ex.getMessage());
        }
    }

    public HashMap<String, String> getPostData() {
        return postData;
    }
}
