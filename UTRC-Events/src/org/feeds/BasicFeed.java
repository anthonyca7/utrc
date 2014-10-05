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

public class BasicFeed extends Feed
{
    private final DBCollection collection;
    private final String[] path;
    private final MongoQuery query;
    public BasicFeed(String url, DBCollection collection, String[] path, MongoQuery query, int interval)
    {
        super(url, interval);
        this.collection = collection;
        this.path = path;
        this.query = query;
    }

    protected void getInsertionMessage(int inserted, int total, String url) {
        System.out.printf("%d out of %d data feeds inserted from %s%n", inserted, total, url);
    }

    @Override
    public void connect()
   {
        try {
            URL uri = new URL(getUrl());
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

                setResponse(response.toString());
            }
            else {
                throw new RuntimeException("Did not get a 200 response instead got " + connection.getResponseCode());
            }
        }
        catch (Exception ex) {
            System.out.println("Error getting feed from " + getUrl() + ": " + ex.getMessage());
        }
    }

    @Override
    public void getData()
    {
        connect();
        int inserted = 0;
        String response = getResponse();

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
            getInsertionMessage(inserted, data.length(), getUrl());
        }
        else {
            throw new RuntimeException("PATH DOES NOT CONTAIN THE DATA");
        }
    }
}
