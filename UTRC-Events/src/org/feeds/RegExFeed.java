package org.feeds;

import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.util.JSON;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegExFeed extends Feed{
    private final DBCollection collection;
    private final Pattern pattern;
    private final MongoQuery query;
    private final int cols;
    private static final String doublePattern = "[-+]?[0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)?";
    private static final String intPattern = "[-+]?[0-9]*";


    public RegExFeed(String url, int interval, DBCollection collection, Pattern pattern,int cols, MongoQuery query) {
        super(url, interval);
        this.collection = collection;
        this.pattern = pattern;
        this.query = query;
        this.cols = cols;
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
    void getData() {
        connect();
        int inserted = 0;
        String response = getResponse();

        Matcher matcher = pattern.matcher(response);
        ArrayList<String> data = new ArrayList<String>();

        while (matcher.find()) {
            data.add(matcher.group());
        }

        int size = data.size();
        int feedCount = size / cols;
        ArrayList<String> feeds = new ArrayList<String>(Math.abs(size-cols));


        for (int i = 1; i < feedCount; i++) {
            StringBuilder feed = new StringBuilder("{");
            for (int j = 0; j < cols; j++) {
                String key = data.get(j).replaceAll("\"", "'");

                if (data.get(cols*i + j).replaceAll("\"", "").matches(doublePattern)) {
                    double value = Double.parseDouble(data.get(cols*i + j).replaceAll("\"", ""));
                    feed.append( key + ":" + value +
                            ((j+1==cols) ? "": ", "));
                }
                else if (data.get(cols*i + j).replaceAll("\"", "").matches(intPattern)) {
                    int value = Integer.parseInt(data.get(cols*i + j).replaceAll("\"", ""));
                    feed.append( key + ":" + value +
                            ((j+1==cols) ? "": ", "));
                }
                else {
                    feed.append( key + ":" + data.get(cols*i + j).replaceAll("\"", "'") +
                            ((j+1==cols) ? "": ", "));
                }
            }
            feed.append("}");
            feeds.add(feed.toString());
        }

        for (String feed : feeds) {
            DBObject feedObject = (DBObject) JSON.parse(feed);
            DBCursor foundFeeds = collection.find(feedObject);

            if (!foundFeeds.hasNext()) {
                collection.insert(feedObject);
                inserted++;
            }
        }

        getInsertionMessage(inserted, feedCount-1, getUrl());
    }
}
