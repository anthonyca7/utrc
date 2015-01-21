package org.feeds;

import com.mongodb.DBCollection;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.HashMap;

public class MTAServiceStatusFeed extends MultiPathFeed {
    private static final String url = "http://web.mta.info/status/serviceStatus.txt";
    public static final String dateTimeRegEx = "^(\\d{1,2})[/](\\d{1,2})[/](\\d{2,4})\\s(\\d{1,2}):(\\d{2}):(\\d{2})\\s(AM|PM)$";
    public static final String dateRegEx = "^(\\d{1,2})[/](\\d{1,2})[/](\\d{2,4})$";
    public static final String timeRegEx = "^(\\d{1,2}):(\\d{2})(AM|PM)$";

    public static final HashMap<String, DateFormat> dateMap = new HashMap<String, DateFormat>();

    static {
        DateFormat dateTimeFormatter = new SimpleDateFormat("M/d/y h:m:s a");
        DateFormat dateFormatter = new SimpleDateFormat("M/d/y");
        DateFormat timeFormatter = new SimpleDateFormat("hh:mma");

        dateMap.put(dateTimeRegEx, dateTimeFormatter);
        dateMap.put(dateRegEx, dateFormatter);
        dateMap.put(timeRegEx, timeFormatter);
    }


    public MTAServiceStatusFeed(DBCollection[] collections,
                                String[][] paths,
                                String[][] datePaths,
                                int interval) {

        super(url, collections, paths, dateMap, datePaths, interval);
    }
}
