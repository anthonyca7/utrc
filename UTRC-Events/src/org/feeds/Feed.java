package org.feeds;

import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.util.JSON;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class Feed
{
    public String getUrl() {
        return url;
    }

    private final String url;
    private final DBCollection collection;
    private final String[] path;
    private final int interval;
    private final MongoQuery query;
    private HttpURLConnection connection;
    private String response;

    public Feed(String url, DBCollection collection, String[] path, MongoQuery query, int interval)
    {
        this.url = url;
        this.collection = collection;
        this.path = path;
        this.interval = interval;
        this.query = query;
    }

    public int getInterval()
    {
        return interval;
    }

    protected void getInsertingMessage(int inserted, int total, String url) {
        System.out.printf("%d out of %d data feeds inserted from %s%n", inserted, total, url);
    }

    public void connect()
    {
        try {
            URL uri = new URL(this.url);
            HttpURLConnection connection = (HttpURLConnection) uri.openConnection();

            connection.setRequestMethod("GET");
            String USER_AGENT = "Mozilla/5.0";
            connection.setRequestProperty("User-Agent", USER_AGENT);

            if (connection.getResponseCode() == 200) {
                BufferedReader in = new BufferedReader(
                        new InputStreamReader(connection.getInputStream()));

                String inputLine;
                StringBuilder response = new StringBuilder();

                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
                in.close();

                this.response = response.toString();
            }
            else {
                throw new RuntimeException("Did not get a 200 response");
            }
        }
        catch (Exception ex) {
            System.out.println("Error getting feed from " + url + ": " + ex.getMessage());
        }
    }

    public void getData()
    {
        this.connect();
        int inserted = 0;

        JSONObject jsonResponse = XML.toJSONObject(response);
        JSONArray data = null;

        for (String key : path) {
            if (jsonResponse.has(key)) {
                if (jsonResponse.get(key) instanceof JSONArray) {
                    data = (JSONArray) jsonResponse.get(key);
                } else {
                    jsonResponse = (JSONObject) jsonResponse.get(key);
                }
            } else {
                throw new RuntimeException("INVALID PATH");
            }
        }

        if (data != null) {
            for (int i = 0; i < data.length(); i++) {
                JSONObject jsonObject = data.getJSONObject(i);
                DBObject object = (DBObject) JSON.parse(jsonObject.toString());

                if (query.hasPath()) {
                    if (query.isUnique(jsonObject)) {
                        collection.insert(object);
                        inserted++;
                    }
                }
                else {
                    DBCursor foundFeeds = collection.find(object);

                    if (!foundFeeds.hasNext()) {
                        collection.insert(object);
                        inserted++;
                    }
                }
            }
            getInsertingMessage(inserted, data.length(), url);
        }
        else {
            throw new RuntimeException("PATH DOES NOT CONTAIN THE DATA");
        }
    }

    public void setResponse(String response) {
        this.response = response;
    }
}
