import com.mongodb.*;
import org.utrc.feeds.*;
import org.utrc.feeds.collectors.*;
import org.utrc.feeds.extractors.*;
import org.utrc.feeds.parsers.*;
import org.utrc.feeds.parsers.Parser;
import org.utrc.feeds.savers.*;
import org.utrc.tasks.IndividualTask;
import org.utrc.tasks.Task;
import org.utrc.tasks.TwitterTask;

import java.util.ArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.regex.Pattern;


public class App {
    private static MongoClient mongoClient;
    private static DB db;
    private static final ArrayList<Task> tasks = new ArrayList<Task>();
    final static TwitterTask tweetsProvider = new TwitterTask();

    public static void main(String[] args) {
        App.init();
    }

    public static void init() {
        try {
            mongoClient = new MongoClient("localhost", 27017);
            db = mongoClient.getDB("utrc2");

            tasks.add(tweetsProvider);

//            App.getSimpleFeeds();
//            App.getNew511NYFeeds();
            App.getMTAServiceStatusFeeds();
//            App.getTrafficSpeedFeeds();


            ScheduledExecutorService ses = Executors.newScheduledThreadPool(2);
            System.out.println("Tasks: " + tasks.size());

            for (Task task : tasks) {
                ses.scheduleAtFixedRate(task, 0, task.getDuration(), TimeUnit.MINUTES);
            }
        }
        catch (Exception ex) {
            System.out.println("Error on main");
            ex.printStackTrace();
        }
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

            Collector collector = new BasicCollector(link[0]);
            Extractor[] extractors = new Extractor[]{new DateExtractor(datePaths[i])};
            Parser parser = new XMLParser(path);
            Saver saver = new UniqueSaver(collection);

            Feed feed = new BasicFeed(collector, parser, saver, extractors);
            tasks.add(new IndividualTask(feed, durations[i]));
        }
    }

    private static void getNew511NYFeeds() {
        String[] links = {
//                "https://api.511ny.org/api/GetMainlineLinkDefinitions?key=a8a608d6c7cd490bb453e10d99c6abd4&format=json",
//                "https://api.511ny.org/api/GetMainlineLinkStatuses?key=a8a608d6c7cd490bb453e10d99c6abd4&format=json",
                "https://api.511ny.org/api/GetEvents?key=a8a608d6c7cd490bb453e10d99c6abd4&format=json",
                "https://api.511ny.org/api/GetRoadways?key=a8a608d6c7cd490bb453e10d99c6abd4&format=json",
                "https://api.511ny.org/api/GetCameras?key=a8a608d6c7cd490bb453e10d99c6abd4&format=json",
                "https://api.511ny.org/api/GetMessageSigns?key=a8a608d6c7cd490bb453e10d99c6abd4&format=json",
                "https://api.511ny.org/api/GetAlerts?key=a8a608d6c7cd490bb453e10d99c6abd4&format=json",
        };

        int[] durations = {
//                1,
//                1,
                1,
                1,
                1,
                1,
                1
        };

        String[][][] datePaths = {
//                {{}},
//                {{}},
                {{"StartDate"}, {"PlannedEndDate"}, {"LastUpdated"}, {"Reported"}},
                {{}},
                {{}},
                {{}},
                {{}}
        };

        Saver[] savers = {
//                new UniqueSaver(db.getCollection("new511nylinkdefinitions")),
//                new UniqueSaver(db.getCollection("new511nylinkstatus")),
                new KeySaver(db.getCollection("new511nyevents"), new String[][]{{"ID"}, {"LastUpdated"}}),
                new UniqueSaver(db.getCollection("new511nyevents")),
                new UniqueSaver(db.getCollection("new511nyroadways")),
                new UniqueSaver(db.getCollection("new511nycameras")),
                new UniqueSaver(db.getCollection("new511nymessagesigns")),
                new UniqueSaver(db.getCollection("new511nyalerts"))
        };

        for (int i = 0; i < links.length; i++) {
            Collector collector = new BasicCollector(links[i]);
            Parser parser = new JSONParser();
            Saver saver = savers[i];
            Extractor[] extractors = new Extractor[]{new MMDDYYYYDateExtractor(datePaths[i])};

            Feed feed = new BasicFeed(collector, parser, saver, extractors);
            tasks.add(new IndividualTask(feed, durations[i]));
        }
    }

    private static void getMTAServiceStatusFeeds() {
        String url = "http://web.mta.info/status/serviceStatus.txt";

        Collector collector = new BasicCollector(url);

        Parser parser = new XMLParser();

        String [][] datePaths = {
                {"Date"}, {"Time"}
        };

        Extractor[] extractors = new Extractor[]{
                new DateExtractor(datePaths)
        };

        String[][] paths = {
                {"service", "subway", "line"},
                {"service", "bus", "line"},
                {"service", "BT", "line"},
                {"service", "LIRR", "line"},
                {"service", "MetroNorth", "line"},
        };

        Saver[] savers = {
                new KeySaver(db.getCollection("mtasubwaystatus"), new String[][]{{"name"}, {"status"}, {"text"}}),
                new KeySaver(db.getCollection("mtabusstatus"), new String[][]{{"name"}, {"status"}, {"text"}}),
                new KeySaver(db.getCollection("mtabtstatus"), new String[][]{{"name"}, {"status"}, {"text"}}),
                new KeySaver(db.getCollection("mtalirrstatus"), new String[][]{{"name"}, {"status"}, {"text"}}),
                new KeySaver(db.getCollection("mtametronorthstatus"), new String[][]{{"name"}, {"status"}, {"text"}, {"url"}})
        };

        Feed feed = new MultiFeed(collector, parser, savers, extractors, paths);
        tasks.add(new IndividualTask(feed, 1));
    }

    private static void getTrafficSpeedFeeds() {
        Pattern pattern = Pattern.compile("(\".*?\")");
        String url = "http://207.251.86.229/nyc-links-cams/LinkSpeedQuery.txt";
        DBCollection collection = db.getCollection("nycdottrafficspeed");
        String [][] datePaths = {
                {"DataAsOf"}
        };
        int cols = 13;

        Collector collector = new BasicCollector(url);
        Extractor[] extractor = new Extractor[]{new DateExtractor(datePaths)};
        Parser parser = new PatternParser(pattern, cols);
        Saver saver = new UniqueSaver(collection);

        Feed feed = new BasicFeed(collector, parser, saver, extractor);
        tasks.add(new IndividualTask(feed, 1));
    }
}
