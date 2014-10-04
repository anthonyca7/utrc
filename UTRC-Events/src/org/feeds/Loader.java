package org.feeds;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;


public class Loader
{
    public static void main(String[] args)
    {
        try {
            MongoClient mongoClient = new MongoClient("localhost", 27017);
            ArrayList<Task> tasks = new ArrayList<Task>();

            String[][] links = {
                    {"https://data.xcmdata.org/ISGDE/rest/eventProvider/getAllNativeEvents?System=anthonyca7&Key=transcom",
                            "utrc", "transcomEvents"},
                    {"https://data.xcmdata.org/ISGDE/rest/linkProvider/getXmitLinkConditions?System=anthonyca7&Key=transcom",
                            "utrc", "transcomConditions"},
                    {"https://data.xcmdata.org/ISGDE/rest/linkProvider/getXmitLinkMaster?System=anthonyca7&Key=transcom",
                            "utrc", "transcomConfigurations"}

            };

            String[][] paths = {
                    {"eventUpdates", "eventUpdate"},
                    {"ns:getDataResponse", "return", "dataResponse", "linkConditions", "linkCondition"},
                    {"ns:getDataResponse", "return", "dataResponse", "linkInventory", "link"}
            };

            int[] durations = {
                    1,
                    1,
                    1440
            };

            String[][][] uniqueKeys = {
                    {{}},
                    { {"ID"} },
                    {{}}
            };

            for (int i = 0; i < links.length; i++) {
                String[] link = links[i];
                String[] path = paths[i];
                DBCollection collection = mongoClient.getDB(link[1]).getCollection(link[2]);
                String[][] uniqueKey = uniqueKeys[i];
                MongoQuery query = new MongoQuery(uniqueKey, collection);

                BasicFeed feed = new BasicFeed(link[0], collection, path, query, durations[i]*60);
                tasks.add(new IndividualTask(feed));
            }

            String MTAlink = "http://web.mta.info/status/serviceStatus.txt";
            String[][] MTApaths = {
                    {"service", "subway", "line"},
                    {"service", "bus", "line"},
                    {"service", "BT", "line"},
                    {"service", "LIRR", "line"},
                    {"service", "MetroNorth", "line"},
            };

            DB db = mongoClient.getDB("utrc");

            DBCollection[] collections = {
                    db.getCollection("MTATrainStatus"),
                    db.getCollection("MTABusStatus"),
                    db.getCollection("MTABTStatus"),
                    db.getCollection("MTALIRRStatus"),
                    db.getCollection("MTAMetroNorthStatus"),
            };

            Feed MTAStatusFeed = new MultiPathFeed(MTAlink, collections, MTApaths, 60);
            tasks.add(new IndividualTask(MTAStatusFeed));

            HashMap<String, String> map = new HashMap<String, String>();
            map.put("username", "ckamga@utrc2.org");
            map.put("password", "CK@utrc");

            String[] dataTypes = {"events", "links", "wtastatus", "wtasegmentdata", "vms"};
            String[][] NYC511Paths = {{"events", "event"}, {"links", "link"}, {"WTASegmentConditionData", "WTASegment"},
                                {"WTASegmentConditionData", "WTASegment"}, {"vmss", "vms"}};

            int[] NYC511Durations = {60, 70, 80, 90, 100};
            BasicFeed[] NYC511Feeds = new BasicFeed[dataTypes.length];
            String[][][] NYC511uniqueKeys = {
                    {{}},
                    {{"LINK_ID"}},
                    {{}},
                    {{}},
                    {{}},
            };

            for (int i = 0; i < dataTypes.length; i++) {
                map.put("dataType", dataTypes[i]);
                DBCollection collection = mongoClient.getDB("utrc").getCollection("511NY_"+dataTypes[i]);

                BasicFeed feed = new LoginFeed("https://165.193.215.51/XMLFeeds/createXML.aspx",
                        collection, NYC511Paths[i], new MongoQuery(NYC511uniqueKeys[i], collection) , 60,
                        (HashMap<String, String>) map.clone());
                NYC511Feeds[i] = feed;
            }

            tasks.add(new MultipleTask(NYC511Feeds, 60, 10000));

            ScheduledExecutorService ses = Executors.newScheduledThreadPool(8);
            for (Task task : tasks) {
                ses.scheduleAtFixedRate(task, 0, task.getDuration(), TimeUnit.SECONDS);
            }
        }
        catch (Exception ex)
        {
            System.out.println("Something went wrong: " + ex.toString());
        }
    }
}
