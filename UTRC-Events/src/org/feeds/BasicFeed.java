package org.feeds;

import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.DateFormat;
import java.util.Iterator;
import java.util.Map;

public class BasicFeed extends Feed
{
    private final DBCollection collection;
    private final String[] path;
    private final MongoQuery query;

    public BasicFeed(String url, DBCollection collection, String[] path, MongoQuery query, Map<String, DateFormat> dateMap, String[][] datePaths, int interval)
    {
        super(url, interval, dateMap, datePaths);
        this.collection = collection;
        this.path = path;
        this.query = query;
    }

    @Override
    public void connect() {
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

    private JSONArray jsonData() {
        connect();
        String response = getResponse();
        JSONObject res = XML.toJSONObject(response);
        JSONArray data;

        for (String key : path) {
            if (res.has(key)) {
                if (res.get(key) instanceof JSONArray) {
                    data = (JSONArray) res.get(key);
                    return data;
                } else {
                    res = (JSONObject) res.get(key);
                }
            } else {
                throw new RuntimeException("Invalid Path");
            }
        }

        throw new RuntimeException("Invalid Path");
    }

    @Override
    public void getData()
    {
        int inserted = 0;
        JSONArray data = jsonData();

        if (data != null) {
            for (int i = 0; i < data.length(); i++) {
                JSONObject jsonObject = data.getJSONObject(i);
                DBObject object = extractDates(jsonObject);

                if (query != null && query.hasPath()) {
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
            getInsertionMessage(inserted, data.length(), collection.getName(), getUrl());
        }
        else {
            throw new RuntimeException("PATH DOES NOT CONTAIN THE DATA");
        }
    }

    protected void getInsertionMessage(int inserted, int total, String collectionName, String url) {
        System.out.printf("%d out of %d data feeds inserted to %s from %s%n", inserted, total, collectionName, url);
    }


    public DBCollection getCollection() {
        return collection;
    }
}
