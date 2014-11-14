package org.feeds;

import com.mongodb.DBCollection;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.regex.Pattern;

public class NYCTrafficSpeedFeed extends RegExFeed {
    private static final String url = "http://207.251.86.229/nyc-links-cams/LinkSpeedQuery.txt";
    private static final Pattern pattern = Pattern.compile("(\".*?\")");
    private static final String dateTimeRegEx = "^(\\d{1,2})[/](\\d{1,2})[/](\\d{2,4})\\s(\\d{1,2}):(\\d{2}):(\\d{2})?\\s(AM|PM)$";
    private static final String dateRegEx = "^(\\d{1,2})[/](\\d{1,2})[/](\\d{2,4})$";
    private static final String dateNARegEx = "^(\\d{1,2})[/](\\d{1,2})[/](\\d{2,4})\\s(\\d{1,2}):(\\d{2}):(\\d{2})$";

    private static final HashMap<String, DateFormat> dateMap = new HashMap<String, DateFormat>();


    static {
        DateFormat dateTimeFormatter = new SimpleDateFormat("M/d/y h:m:s a");
        DateFormat dateNAFormatter = new SimpleDateFormat("M/d/y H:m:s");
        DateFormat dateFormatter = new SimpleDateFormat("M/d/y");

        dateMap.put(dateNARegEx, dateNAFormatter);
        dateMap.put(dateTimeRegEx, dateTimeFormatter);
        dateMap.put(dateRegEx, dateFormatter);
    }

    public NYCTrafficSpeedFeed(int interval,
                               DBCollection collection,
                               String[][] datePaths) {

        super(url, interval, collection, pattern, 13, dateMap, datePaths, null);
    }
}
