package org.feeds;

import com.mongodb.*;
import com.mongodb.util.JSON;
import org.apache.commons.codec.binary.StringUtils;
import org.json.JSONObject;
import org.json.XML;
import org.scribe.builder.*;
import org.scribe.builder.api.*;
import org.scribe.model.*;
import org.scribe.oauth.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.DateFormat;
import java.text.SimpleDateFormat;

public class TweetsProvider extends Thread {
    private static final String STREAM_URI = "https://stream.twitter.com/1.1/statuses/filter.json";
    private static final DateFormat dateFormatter = new SimpleDateFormat("EEE MMM dd HH:mm:ss Z yyy");
    private static DBCollection collection;
    private static final String criteria = "accident,crash,traffic,road,freeway,highway,lane,wreck,car,cars";
    private static final String[] keywords = criteria.split(",");

    static {
        try {
            collection = new MongoClient("localhost", 27017).getDB("utrc").getCollection("tweets");
        }
        catch (Exception ex) {
            ex.printStackTrace();
        }
    }
    private void getTweets() {
        while (true) {
            try {
                // Enter your consumer key and secret below
                OAuthService service = new ServiceBuilder()
                        .provider(TwitterApi.class)
                        .apiKey("rDNs9aBAdJXmvuHltO43ozE6p")
                        .apiSecret("q18twMcVM3boO3dPuzc1Dd3N9jWnpOUMlWBFqjTyo0x8muTQ6o")
                        .build();

                // Set your access token
                Token accessToken = new Token("2387896706-UgpVKDAWOVeeOIMf65v0eSSsNfpO89X5DWsTDaB",
                        "IzlFKeIbz5vsxd7b1oZScgZ8VM3lz6XJn08LN5ggLXHfU");

                // Let's generate the request
                OAuthRequest request = new OAuthRequest(Verb.POST, STREAM_URI);
                request.addHeader("version", "HTTP/1.1");
                request.addHeader("host", "stream.twitter.com");
                request.setConnectionKeepAlive(true);
                request.addHeader("user-agent", "Twitter Stream Reader");
                request.addBodyParameter("track", criteria);
//            request.addBodyParameter("locations", "-74,40,-73,41"); // New York Coordinates
//            request.addBodyParameter("filter_level", "medium");
                service.signRequest(accessToken, request);
                Response response = request.send();

                // Create a reader to read Twitter's stream
                BufferedReader reader = new BufferedReader(new InputStreamReader(response.getStream()));

                String line;
                while ((line = reader.readLine()) != null) {
                    BasicDBObject data = (BasicDBObject) JSON.parse(line);
//                if (data.get("coordinates") != null)
//                    System.out.println(data.get("coordinates"));

                    if (isFeedValid(data)) {
                        BasicDBObject tweet = parseJSON(data);
                        try {
                            collection.insert(tweet);
                            System.out.println("Tweet Inserted");
                        } catch (Exception ex) {
                            ex.printStackTrace();
                        }
                    }
                }

//            System.out.println("RESETTING TWEETS PROVIDER");

            } catch (Exception ex) {
//                this.getTweets();
                ex.printStackTrace();
            }
        }
    }

    private BasicDBObject parseJSON(BasicDBObject tweet) throws Exception {
        if (tweet.containsField("created_at")) {
            String value = (String) tweet.get("created_at");
            tweet.remove("created_at");
            tweet.append("created_at", dateFormatter.parse(value));
        }

        if (tweet.containsField("id")) {
            long value = (Long) tweet.get("id");
            tweet.remove("id");
            tweet.remove("id_str");
            tweet.append("_id", value);
        }

//        System.out.println(tweet);
        return tweet;
    }

    private boolean isFeedValid(DBObject tweet) {
        if (tweet.get("coordinates") != null && tweet.get("coordinates") instanceof DBObject) {
            BasicDBList coordinates = (BasicDBList) ((DBObject) tweet.get("coordinates")).get("coordinates");


            //coordinates.size()
            if (coordinates == null && coordinates.size() < 2)
                return false;

            double lon = (Double) coordinates.get(0);
            double lat = (Double) coordinates.get(1);
            //"-74,40,-73,41"
//            System.out.println(lon + " " + lat);
            if (lon < -74 || lon > -73) return false;
            if (lat < 40 || lat > 41) return false;

            tweet.put("lon", lon);
            tweet.put("lat", lat);

            tweet.removeField("coordinate");

        } else return false;

        /*if (tweet.containsField("text")) {
            boolean found = false;
            String text = (String) tweet.get("text");
            // System.out.println(text);
            for (String keyword : keywords) {
                if (text.contains(keyword)) {
                    found = true;
                    break;
                }
            }

            if (!found) {
                return false;
            }
        }*/

        return true;
    }

    public void run(){
        getTweets();
    }
}
