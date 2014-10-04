package org.feeds;

import com.mongodb.DBCollection;
import com.mongodb.MongoClient;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Created by Anthony on 9/24/2014.
 */
public class Loader
{
    public static void main(String[] args)
    {
        try
        {
            MongoClient mongoClient = new MongoClient("localhost", 27017);
            ArrayList<Feed> feeds = new ArrayList<Feed>();
            String[][] links = {
                    {"https://data.xcmdata.org/ISGDE/rest/eventProvider/getAllNativeEvents?System=anthonyca7&Key=transcom",
                            "transcom", "events"}
            };

            String[][] paths = {
                    {"eventUpdates", "eventUpdate"}
            };

            String[][][] uniqueKeys ={
                    {{"EventID"}, {"LastUpdate"}}
            };

            int[] duration = {
                5000\
            };

            for (int i = 0; i < links.length; i++)
            {
                String[] link = links[i];
                String[] path = paths[i];
                String[][] uniqueKey = uniqueKeys[i];
                DBCollection collection = mongoClient.getDB(link[1]).getCollection(link[2]);
                MongoQuery query = new MongoQuery(uniqueKey, collection);


                Feed feed = new Feed(link[0], collection, path, query);

                feeds.add(feed);
            }

            for (Feed feed : feeds) {
                feed.getData();
            }
        }

        catch (Exception ex){
            System.out.println("Something went wrong: " + ex.getMessage());
        }
    }
}
