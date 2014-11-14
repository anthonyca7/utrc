package org.feeds;

import com.mongodb.DBCollection;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.HashMap;

/**
 * Created by anthony on 11/13/14.
 */
public class SimpleFeed extends BasicFeed {
    private static final String timestamp = "^(\\d{4})[-](\\d{1,2})[-](\\d{1,2})T(\\d{1,2}):(\\d{2}):(\\d{2})[-](\\d{2}):(\\d{2})$";
    private static final String dateTimeRegEx = "^(\\d{1,2})[/](\\d{1,2})[/](\\d{2,4})\\s+(\\d{1,2}):(\\d{2}):(\\d{2})\\s+(AM|PM)$";
    private static final String dateRegEx = "^(\\d{1,2})[/](\\d{1,2})[/](\\d{2,4})$";
    public static final String timeRegEx = "^(\\d{1,2}):(\\d{2})(AM|PM)$";
    private static final HashMap<String, DateFormat> dateMap = new HashMap<String, DateFormat>();

    static {
        DateFormat timestampFormatter = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssX");
        DateFormat dateTimeFormatter = new SimpleDateFormat("M/d/y h:m:s a");
        DateFormat dateFormatter = new SimpleDateFormat("M/d/y");
        DateFormat timeFormatter = new SimpleDateFormat("hh:mma");

        dateMap.put(timeRegEx, timeFormatter);
        dateMap.put(timestamp, timestampFormatter);
        dateMap.put(dateTimeRegEx, dateTimeFormatter);
        dateMap.put(dateRegEx, dateFormatter);
    }

    public SimpleFeed(String url,
                      DBCollection collection,
                      String[] path,
                      String[][] datePaths,
                      int interval) {

        super(url, collection, path, null, dateMap, datePaths, interval);
    }
}
