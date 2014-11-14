package org.feeds;

import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.MongoClient;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;


public class Loader {
    private static final ArrayList<Task> tasks = new ArrayList<Task>();
    private static final String dbName = "utrc";
    private static MongoClient mongoClient;
    private static DB db;

    public static void main(String[] args) {
        try {
            init();
        }
        catch (Exception ex) {
            System.out.println("Something went wrong: " + ex.getStackTrace());
        }
    }

    private static void init() {
        try {
            mongoClient = new MongoClient("localhost", 27017);
            db = mongoClient.getDB(dbName);

            get511NYFeeds();
            getMTAServiceStatusFeeds();
            getTrafficSpeedFeeds();
            getSimpleFeeds();

            ScheduledExecutorService ses = Executors.newScheduledThreadPool(8);
            for (Task task : tasks) {
                ses.scheduleAtFixedRate(task, 0, task.getDuration(), TimeUnit.SECONDS);
            }
        } catch (Exception ex) {
            System.out.println("Error at Main: " + ex.getStackTrace().toString());
        }
    }

    private static void get511NYFeeds() {
        HashMap<String, String> map = new HashMap<String, String>();
        map.put("username", "ckamga@utrc2.org");
        map.put("password", "CK@utrc");

        String[] dataTypes = {"events", "links", "wtastatus", "wtasegmentdata", "vms"};
        String[][] NYC511Paths = {
                {"events", "event"},
                {"links", "link"},
                {"WTASegmentConditionData", "WTASegment"},
                {"WTASegmentConditionData", "WTASegment"},
                {"vmss", "vms"}
        };

        String [][][] datePaths = {
                {{"CREATE_TIME"}, {"LAST_UPDATE"}, {"START_DATE"}, {"END_DATE"}},
                {{"LAST_UPDATE"}},
                {{"LAST_UPDATE"}},
                {{}},
                {{"last_update"}}
        };

        int[] NYC511Durations = {60, 15*60, 15*60, 15*60, 15*60};
        BasicFeed[] NYC511Feeds = new BasicFeed[dataTypes.length];

        for (int i = 0; i < dataTypes.length; i++) {
            map.put("dataType", dataTypes[i]);
            DBCollection collection = db.getCollection("nysdot"+dataTypes[i]);

            BasicFeed feed = new NYSDOTFeed(collection,
                    NYC511Paths[i],
                    datePaths[i],
                    NYC511Durations[i],
                    (HashMap<String, String>) map.clone());

            NYC511Feeds[i] = feed;
        }

        tasks.add(new MultipleTask(NYC511Feeds, 60, 10000));
    }

    private static void getMTAServiceStatusFeeds() {
        String[][] paths = {
                {"service", "subway", "line"},
                {"service", "bus", "line"},
                {"service", "BT", "line"},
                {"service", "LIRR", "line"},
                {"service", "MetroNorth", "line"},
        };

        String [][] datePaths = {
                {"Date"}, {"Time"}
        };


        DBCollection[] collections = {
                db.getCollection("mtasubwaystatus"),
                db.getCollection("mtabusstatus"),
                db.getCollection("mtabtstatus"),
                db.getCollection("mtalirrstatus"),
                db.getCollection("mtametronorthstatus"),
        };

        Feed MTAStatusFeed = new MTAServiceStatusFeed(collections, paths, datePaths, 60);
        tasks.add(new IndividualTask(MTAStatusFeed));
    }

    private static void getTrafficSpeedFeeds() {
        Pattern pattern = Pattern.compile("(\".*?\")");
        DBCollection collection = db.getCollection("nycdottrafficspeed");
        String [][] datePaths = {
                {"DataAsOf"}
        };

        NYCTrafficSpeedFeed trafficFeed = new NYCTrafficSpeedFeed(15*60, collection, datePaths);
        tasks.add(new IndividualTask(trafficFeed));
    }

    private static void getSimpleFeeds() {
        String[][] links = {
                {"https://data.xcmdata.org/ISGDE/rest/eventProvider/getAllNativeEvents?System=anthonyca7&Key=transcom",
                        "transcomevent"},
                {"https://data.xcmdata.org/ISGDE/rest/linkProvider/getXmitLinkConditions?System=anthonyca7&Key=transcom",
                        "transcomcondition"},
                {"https://data.xcmdata.org/ISGDE/rest/linkProvider/getXmitLinkMaster?System=anthonyca7&Key=transcom",
                        "transcomconfiguration"},
                {"http://web.mta.info/developers/data/nyct/nyct_ene.xml", "mtaoutages"},
                {"http://advisory.mtanyct.info/LPUWebServices/CurrentLostProperty.aspx", "mtalostfound"}
        };

        String[][] paths = {
                {"eventUpdates", "eventUpdate"},
                {"ns:getDataResponse", "return", "dataResponse", "linkConditions", "linkCondition"},
                {"ns:getDataResponse", "return", "dataResponse", "linkInventory", "link"},
                {"NYCOutages", "outage"},
                {"LostProperty", "Category"}
        };

        int[] durations = {
                1,
                15,
                1440,
                5,
                60
        };

        String[][][] datePaths = {
                {{"StartDateTime"}, {"LastUpdate"}, {"EndDateTime"} },
                {{"asOf"}},
                {{}},
                {{"outagedate"}, {"estimatedreturntoservice"}},
                {{}}
        };

        for (int i = 0; i < links.length; i++) {
            String[] link = links[i];
            String[] path = paths[i];
            DBCollection collection = db.getCollection(link[1]);

            Feed feed = new SimpleFeed(link[0], collection, path, datePaths[i], durations[i] * 60);
            tasks.add(new IndividualTask(feed));
        }
    }

}
